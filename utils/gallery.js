// utils/gallery.js
// Replaces atlas.js — all gallery operations go through your Workers API
// Cloudinary is the database — no MongoDB, no Supabase, nothing extra

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const authHeaders = {
  "Content-Type":  "application/json",
  "Authorization": `Bearer ${API_KEY}`,
};

// ─── Fetch gallery images (newest first) ──────────────────────────────────────
export async function fetchImages(limit = 50) {
  const res = await fetch(`${API_URL}/gallery?limit=${limit}`, {
    headers: authHeaders,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Gallery fetch failed (${res.status})`);
  }
  const data = await res.json();
  return data.images || [];
}

// ─── Delete an image by publicId ──────────────────────────────────────────────
export async function deleteImage(publicId) {
  const res = await fetch(`${API_URL}/image`, {
    method:  "DELETE",
    headers: authHeaders,
    body:    JSON.stringify({ publicId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Delete failed (${res.status})`);
  }
}
