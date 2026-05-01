const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY  = process.env.EXPO_PUBLIC_API_KEY;

const TIMEOUT_MS = 120_000;

// ─── MODELS ───────────────────────────────────────────────────
export const MODEL_INFO = {
  "sdxl-base": {
    label: "SDXL Base",
    tag:   "QUALITY",
    desc:  "Highest quality, slower",
    color: "#C084FC",
    icon:  "snow-outline",
  },
  "sdxl-lightning": {
    label: "Lightning",
    tag:   "FAST",
    desc:  "4× faster generation",
    color: "#38BDF8",
    icon:  "flash-outline",
  },
  dreamshaper: {
    label: "Dreamshaper",
    tag:   "CREATIVE",
    desc:  "Artistic & imaginative",
    color: "#FB7185",
    icon:  "sparkles-outline",
  },
};

export const WORKING_MODELS = Object.keys(MODEL_INFO);

// ─── STYLE PRESETS ────────────────────────────────────────────
export const STYLE_PRESETS = [
  { label: "None",      prefix: "" },
  { label: "Cinematic", prefix: "cinematic shot, dramatic lighting, film grain, 8K UHD," },
  { label: "Anime",     prefix: "anime style, vibrant colors, highly detailed," },
  { label: "Ghibli",    prefix: "studio ghibli, hand-drawn animation, whimsical, soft pastels, magical," },
  { label: "Oil Paint", prefix: "oil painting, impressionist brushstrokes, textured canvas, masterpiece," },
  { label: "Neon Noir", prefix: "neon noir, cyberpunk, rain-slick streets, glowing signs, ultra-detailed," },
  { label: "Watercolor",prefix: "delicate watercolor illustration, soft washes, flowing, artstation," },
  { label: "3D Render", prefix: "3D octane render, subsurface scattering, volumetric light, photorealistic," },
  { label: "Pixel Art", prefix: "16-bit pixel art, retro game sprite, dithered shading, crisp edges," },
  { label: "Sketch",    prefix: "detailed pencil sketch, cross-hatching, charcoal texture, hand-drawn," },
];

// ─── ASPECT RATIOS ────────────────────────────────────────────
export const ASPECT_RATIOS = [
  { label: "1:1",  tag: "SQUARE",   desc: "1024×1024", w: 1024, h: 1024, ratio: 1     },
  { label: "4:3",  tag: "CLASSIC",  desc: "1024×768",  w: 1024, h: 768,  ratio: 4/3   },
  { label: "16:9", tag: "WIDE",     desc: "1024×576",  w: 1024, h: 576,  ratio: 16/9  },
  { label: "9:16", tag: "PORTRAIT", desc: "576×1024",  w: 576,  h: 1024, ratio: 9/16  },
  { label: "2:3",  tag: "TALL",     desc: "512×768",   w: 512,  h: 768,  ratio: 2/3   },
];

// ─── SUGGESTION CATEGORIES ────────────────────────────────────
export const SUGGESTIONS = {
  "Sci-Fi": [
    "Neon hacker in rain soaked alley",
    "Floating city above thunder clouds",
    "Android with glowing cracked porcelain face",
    "Cyberpunk market under holographic dragons",
    "AI goddess made of shifting code",
    "Futuristic samurai with plasma katana",
    "City powered by giant energy core",
    "Humans merging with machines in lab",
  ],

  "Space": [
    "Astronaut sitting on Saturn rings",
    "Space whale swimming through nebula",
    "Black hole bending colorful galaxies",
    "Cosmic library floating in void",
    "Alien planet with bioluminescent forests",
    "Spaceship entering a wormhole tunnel",
    "Galaxy shaped like a human eye",
    "Lonely rover on a distant red planet",
  ],

  "Fantasy": [
    "Dragon wrapped around burning castle",
    "Elven warrior in glowing forest",
    "Phoenix rising in golden flames",
    "Ancient sword inside crystal cave",
    "Wizard casting spell under starry sky",
    "Floating islands with waterfalls in sky",
    "Dark knight with cursed armor",
    "Magical deer with glowing antlers",
  ],

  "Surreal": [
    "City melting under red sun",
    "Floating clock tower in dream sky",
    "Shattered reality with glass butterflies",
    "Mirror world with inverted sky",
    "Infinite staircase in pastel clouds",
    "Face made of clouds and lightning",
    "Ocean waves flowing through a room",
    "Eyes growing on tree branches",
  ],

  "Horror": [
    "Abandoned hospital with shadow figures",
    "Creepy doll with cracked face smiling",
    "Foggy forest with glowing eyes watching",
    "Ghostly figure standing in doorway",
    "Bloody moon over silent village",
    "Hands reaching from dark walls",
    "Distorted human with missing face",
    "Haunted mirror reflecting another world",
  ],

  "Nature": [
    "Waterfall flowing into glowing cave",
    "Giant tree with village inside trunk",
    "Sunlight piercing dense jungle fog",
    "Mountain peak above sea of clouds",
    "Crystal clear lake reflecting stars",
    "Autumn forest with golden leaves falling",
    "Hidden valley with wild horses running",
    "Frozen landscape with blue ice caves",
  ],

  "Anime": [
    "Anime boy standing in rain with neon lights",
    "School girl with glowing magical aura",
    "Battle scene with energy blasts mid-air",
    "Lonely character on rooftop at sunset",
    "Cyber anime girl with robotic arm",
    "Samurai duel under cherry blossoms",
    "Fantasy anime city at night",
    "Hero awakening hidden power glowing eyes",
  ],

  "Cyberpunk": [
    "Rainy neon street with flying cars",
    "Augmented human with glowing implants",
    "Underground hacker base with holograms",
    "Mega city skyline filled with ads",
    "Masked rebel in dystopian future",
    "Robot bartender in neon club",
    "High tech slums under skyscrapers",
    "Digital rain falling over city",
  ],

  "Mythology": [
    "Zeus summoning lightning from sky",
    "Shiva meditating in cosmic void",
    "Anubis guarding ancient tomb",
    "Poseidon rising from stormy ocean",
    "Valkyrie flying over battlefield",
    "Kraken emerging from deep sea",
    "Medusa turning warrior to stone",
    "Thor with hammer in thunderstorm",
  ],

  "Steampunk": [
    "Victorian city with flying airships",
    "Clockwork robot powered by steam",
    "Engineer with mechanical wings",
    "Steam train crossing floating bridge",
    "Brass goggles inventor in workshop",
    "Airship battle in cloudy skies",
    "Gear driven city with pipes everywhere",
    "Mechanical dragon made of copper",
  ],

  "Post-Apocalyptic": [
    "Abandoned city covered in vines",
    "Survivor walking through ruined highway",
    "Rusty robots in desert wasteland",
    "Broken skyscrapers under orange sky",
    "Lone figure with gas mask in fog",
    "Nature reclaiming destroyed buildings",
    "Burning horizon after global war",
    "Empty streets with scattered memories",
  ],

  "Underwater": [
    "Lost city beneath glowing ocean",
    "Mermaid swimming with jellyfish lights",
    "Sunken ship covered in coral",
    "Giant sea creature in deep abyss",
    "Underwater temple with ancient statues",
    "Diver exploring glowing cave",
    "Fish forming shapes in blue void",
    "Ocean floor with alien-like plants",
  ],

  "Minimal": [
    "Single tree in endless white field",
    "Tiny figure under massive moon",
    "Lonely chair in empty room",
    "Floating cube casting long shadow",
    "Simple horizon with soft gradient sky",
    "Minimal desert with one cactus",
    "Black dot in infinite space",
    "Clean geometric shapes in balance",
  ],

  "Abstract": [
    "Colorful fluid shapes blending together",
    "Geometric chaos with neon lines",
    "Fractal patterns expanding infinitely",
    "Liquid metal forming human face",
    "Exploding colors in dark void",
    "Energy waves crossing dimensions",
    "Shapes folding into each other",
    "Glowing particles forming symmetry",
  ],
};
export const NEGATIVE_PRESETS = [
  "blurry, low quality",
  "extra limbs, deformed",
  "watermark, text",
  "oversaturated",
];

export const QUALITY_SUFFIX =
  ", masterpiece, best quality, highly detailed, sharp focus, 8K resolution";

export const DEFAULT_SETTINGS = { steps: 20, guidance: 8.5, seed: "" };

// ─── API CALLS ────────────────────────────────────────────────
export async function fetchModels() {
  const res = await fetch(`${API_URL}/models`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.models)) throw new Error("Invalid response");
  return data.models.filter((m) => WORKING_MODELS.includes(m));
}

export async function generateImage({ prompt, model, negPrompt, steps, guidance, seed, genWidth, genHeight }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body = { prompt, model, num_steps: steps, guidance, width: genWidth, height: genHeight };
    if (negPrompt) body.negative_prompt = negPrompt;
    if (seed)      body.seed = parseInt(seed, 10);

    const res = await fetch(`${API_URL}/generate`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || `HTTP ${res.status}`);
    }
    const blob = await res.blob();
    return await blobToBase64(blob);
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror   = reject;
    reader.readAsDataURL(blob);
  });
}