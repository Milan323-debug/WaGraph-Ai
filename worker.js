const AVAILABLE_MODELS = {
  "sdxl-lightning": "@cf/bytedance/stable-diffusion-xl-lightning",
  "dreamshaper":    "@cf/lykon/dreamshaper-8-lcm",
  "sdxl-base":      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
};

// ─── Cloudinary Admin API (secret stays server-side) ─────────────────────────
async function cloudinaryAdmin(path, env, method = "GET") {
  const credentials = btoa(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}${path}`,
    {
      method,
      headers: { "Authorization": `Basic ${credentials}` },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Cloudinary Admin error (${res.status})`);
  }
  return res.json();
}

// ─── Upload image blob to Cloudinary ─────────────────────────────────────────
async function uploadToCloudinary(imageResult, metadata, env) {
  // Workers AI returns a ReadableStream or ArrayBuffer — normalise to Uint8Array
  let imageBuffer;
  if (imageResult instanceof ReadableStream) {
    const reader  = imageResult.getReader();
    const chunks  = [];
    let   done    = false;
    while (!done) {
      const { value, done: d } = await reader.read();
      if (value) chunks.push(value);
      done = d;
    }
    const total  = chunks.reduce((n, c) => n + c.length, 0);
    imageBuffer  = new Uint8Array(total);
    let offset   = 0;
    for (const chunk of chunks) {
      imageBuffer.set(chunk, offset);
      offset += chunk.length;
    }
  } else if (imageResult instanceof ArrayBuffer) {
    imageBuffer = new Uint8Array(imageResult);
  } else {
    // Already Uint8Array
    imageBuffer = imageResult;
  }

  // Use File constructor — correct API for binary data in Cloudflare Workers FormData
  const imageFile = new File([imageBuffer], "image.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("file",          imageFile);
  formData.append("upload_preset", env.CLOUDINARY_UPLOAD_PRESET);
  formData.append("tags",          "wagraph");
  formData.append("context", [
    `prompt=${metadata.prompt.slice(0, 100)}`,
    `model=${metadata.model}`,
    `style=${metadata.style}`,
    `aspectRatio=${metadata.aspectRatio}`,
    `elapsed=${metadata.elapsed}`,
  ].join("|"));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Cloudinary upload error:", err);
    throw new Error(err?.error?.message || `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return {
    url:       data.secure_url,
    publicId:  data.public_id,
    width:     data.width,
    height:    data.height,
    createdAt: data.created_at,
  };
}

// ─── Parse Cloudinary resource into clean record ──────────────────────────────
function parseResource(r) {
  const ctx = r.context?.custom || {};
  return {
    id:          r.public_id,
    url:         r.secure_url,
    width:       r.width,
    height:      r.height,
    createdAt:   r.created_at,
    prompt:      ctx.prompt       || "",
    model:       ctx.model        || "",
    style:       ctx.style        || "None",
    aspectRatio: ctx.aspectRatio  || "1:1",
    elapsed:     parseFloat(ctx.elapsed || "0"),
  };
}

// ─── Main Worker ──────────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const API_KEY = env.API_KEY;
    const url     = new URL(request.url);
    const auth    = request.headers.get("Authorization");

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    // Auth check
    if (auth !== `Bearer ${API_KEY}`) {
      return json({ error: "Unauthorized" }, 401);
    }

    // ── GET /models ──────────────────────────────────────────────────────────
    if (request.method === "GET" && url.pathname === "/models") {
      return json({ models: Object.keys(AVAILABLE_MODELS), default: "sdxl-base" });
    }

    // ── GET /gallery ─────────────────────────────────────────────────────────
    // Returns all images tagged "wagraph" from Cloudinary, newest first
    if (request.method === "GET" && url.pathname === "/gallery") {
      try {
        const limit      = url.searchParams.get("limit")  || "50";
        const nextCursor = url.searchParams.get("next")   || "";

        let apiPath = `/resources/image/tags/wagraph?max_results=${limit}&context=true&direction=-1`;
        if (nextCursor) apiPath += `&next_cursor=${nextCursor}`;

        const data   = await cloudinaryAdmin(apiPath, env);
        const images = (data.resources || []).map(parseResource);

        return json({ images, next: data.next_cursor || null });
      } catch (err) {
        return json({ error: "Failed to fetch gallery", details: err.message }, 500);
      }
    }

    // ── DELETE /image ─────────────────────────────────────────────────────────
    // Deletes image from Cloudinary by publicId
    if (request.method === "DELETE" && url.pathname === "/image") {
      try {
        const body     = await request.json();
        const publicId = body.publicId;
        if (!publicId) return json({ error: "publicId required" }, 400);

        await cloudinaryAdmin(
          `/resources/image/upload?public_ids=${encodeURIComponent(publicId)}`,
          env,
          "DELETE"
        );
        return json({ success: true });
      } catch (err) {
        return json({ error: "Delete failed", details: err.message }, 500);
      }
    }

    // ── POST /generate ────────────────────────────────────────────────────────
    if (request.method !== "POST" || url.pathname !== "/generate") {
      return json({ error: "Use POST /generate" }, 405);
    }

    try {
      const body = await request.json();
      const {
        prompt,
        model           = "sdxl-base",
        negative_prompt = "",
        num_steps       = 20,
        guidance        = 7.5,
        seed            = null,
        width           = 1024,
        height          = 1024,
        style           = "None",
        aspectRatio     = "1:1",
      } = body;

      if (!prompt)                  return json({ error: "Prompt required" }, 400);
      if (!AVAILABLE_MODELS[model]) return json({ error: "Invalid model"   }, 400);

      // Clamp dimensions to safe range (multiples of 8, within 512–1024)
      const safeW = Math.min(1024, Math.max(512, Math.round(width  / 8) * 8));
      const safeH = Math.min(1024, Math.max(512, Math.round(height / 8) * 8));

      const aiOptions = { prompt, width: safeW, height: safeH };
      if (negative_prompt) aiOptions.negative_prompt = negative_prompt;
      if (num_steps)        aiOptions.num_steps       = num_steps;
      if (guidance)         aiOptions.guidance        = guidance;
      if (seed !== null)    aiOptions.seed            = seed;

      // 1. Generate image with Workers AI
      const start       = Date.now();
      const imageResult = await env.AI.run(AVAILABLE_MODELS[model], aiOptions);
      const elapsed     = parseFloat(((Date.now() - start) / 1000).toFixed(1));

      // 2. Upload to Cloudinary — metadata stored as context tags
      const cloudinary = await uploadToCloudinary(imageResult, {
        prompt, model, style, aspectRatio, elapsed,
      }, env);

      // 3. Return clean JSON record — app uses URL directly, no base64
      return json({
        id:          cloudinary.publicId,
        url:         cloudinary.url,
        publicId:    cloudinary.publicId,
        width:       cloudinary.width  || safeW,
        height:      cloudinary.height || safeH,
        elapsed,
        model,
        style,
        aspectRatio,
        prompt,
        createdAt:   cloudinary.createdAt,
      });

    } catch (err) {
      console.error("Generation error:", err);
      return json({ error: "Generation failed", details: err.message }, 500);
    }
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}
