import * as FileSystem   from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing      from "expo-sharing";
import { Alert }         from "react-native";

const CLOUD_NAME    = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "dyrst7cfc";  
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "hwunmlaj";  
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// ─── Clean base64 string ──────────────────────────────────────────────────────
function cleanBase64(uri) {
  if (!uri) throw new Error("No image data received.");
  const commaIndex = uri.indexOf(",");
  return commaIndex !== -1
    ? uri.substring(commaIndex + 1).trim()
    : uri.trim();
}

// ─── Upload to Cloudinary using multipart (works with unsigned presets) ────────
// Key changes:
//   1. If image is already a Cloudinary URL (from Worker), skip upload
//   2. If image is base64, convert to file and upload
export async function uploadToCloudinary(imageUri) {
  // If already a Cloudinary URL (from Worker generation), skip re-upload
  if (imageUri && imageUri.includes("cloudinary.com")) {
    return {
      url:      imageUri,
      publicId: imageUri.split("/").pop().split(".")[0], // extract public_id from URL
    };
  }

  if (!imageUri) throw new Error("No image URI provided.");

  // Otherwise treat as base64 and upload
  const b64      = cleanBase64(imageUri);
  const tempPath = FileSystem.cacheDirectory + `upload_${Date.now()}.png`;

  // Write to a real file first — uploadAsync needs a file path, not raw base64
  await FileSystem.writeAsStringAsync(tempPath, b64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  try {
    const response = await FileSystem.uploadAsync(UPLOAD_URL, tempPath, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName:  "file",
      mimeType:   "image/png",
      parameters: {
        upload_preset: UPLOAD_PRESET,
        // Intentionally minimal — unsigned presets reject most extra fields
        // Set folder, tags, transformations inside Cloudinary dashboard preset
      },
    });

    if (response.status !== 200) {
      const body = JSON.parse(response.body || "{}");
      throw new Error(
        body?.error?.message || `Cloudinary upload failed (${response.status})`
      );
    }

    const data = JSON.parse(response.body);
    return {
      url:      data.secure_url,   // permanent HTTPS URL — store this
      publicId: data.public_id,
      width:    data.width,
      height:   data.height,
    };

  } finally {
    await FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
  }
}

// ─── Permission helper — checks first, only prompts if truly undecided ────────
async function getMediaPermission() {
  // 1. Check WITHOUT prompting — no dialog shown
  const { status: current } = await MediaLibrary.getPermissionsAsync();

  if (current === "granted") return true;   // already allowed → silent

  // 2. Only show dialog if never asked before
  if (current === "undetermined") {
    const { status: asked } = await MediaLibrary.requestPermissionsAsync();
    return asked === "granted";
  }

  return false;   // "denied" — skip straight to share sheet
}

// ─── Download Cloudinary URL → save to device gallery ────────────────────────
export async function downloadAndSave(cloudinaryUrl, onStart, onEnd) {
  onStart?.();
  const localPath = FileSystem.cacheDirectory + `wagraph_${Date.now()}.jpg`;

  try {
    // Download from permanent URL — no base64 mess at all
    const result = await FileSystem.downloadAsync(cloudinaryUrl, localPath);
    if (result.status !== 200) {
      throw new Error(`Download failed with status ${result.status}`);
    }

    const info = await FileSystem.getInfoAsync(localPath);
    if (!info.exists || info.size === 0) throw new Error("Downloaded file is empty.");

    // Try saving to gallery only if permission already granted
    const hasPerms = await getMediaPermission();
    if (hasPerms) {
      try {
        const asset  = await MediaLibrary.createAssetAsync(localPath);
        const albums = await MediaLibrary.getAlbumsAsync();
        const album  = albums.find((a) => a.title === "WaGraph");

        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync("WaGraph", asset, false);
        }
        Alert.alert("✅ Saved!", "Image saved to your album.");
        return;
      } catch (_) {
        // Fall through to share if album save fails
      }
    }

    // Fallback: Share sheet (works in Expo Go and doesn't prompt repeatedly)
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) throw new Error("Sharing unavailable on this device.");
    await Sharing.shareAsync(localPath, {
      mimeType:    "image/jpeg",
      dialogTitle: "Save your WaGraph image",
      UTI:         "public.jpeg",
    });

  } catch (err) {
    Alert.alert("Save Failed", err.message || "Unknown error.");
  } finally {
    await FileSystem.deleteAsync(localPath, { idempotent: true }).catch(() => {});
    onEnd?.();
  }
}

// ─── One-shot: upload (if needed) then save to device ────────────────────────
// If imageUri is already a Cloudinary URL (from Worker), skip upload
// If imageUri is base64, upload first, then save
export async function uploadAndSave(imageUri, prompt, onStart, onEnd) {
  onStart?.();
  try {
    const { url } = await uploadToCloudinary(imageUri);
    await downloadAndSave(url, null, null);
    return url;  // Cloudinary URL is already in metadata
  } catch (err) {
    Alert.alert("Failed", err.message || "Upload or save failed.");
    return null;
  } finally {
    onEnd?.();
  }
}

// ─── Optimized thumbnail URL for gallery screen ───────────────────────────────
export function getCloudinaryThumb(url, width = 400) {
  if (!url || !url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${width},q_auto,f_auto/`);
}
