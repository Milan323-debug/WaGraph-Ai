import React, { useState, useEffect } from "react";
import {
  View, Text, Image, TouchableOpacity,
  Alert, StyleSheet, Dimensions,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming,
  FadeIn, FadeInDown, FadeInUp,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DotsLoader from "../ui/DotsLoader";
import { MODEL_INFO } from "../../utils/api";
import { colors, spacing, radius, typography } from "../../styles/theme";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

// ─── Layout constants ─────────────────────────────────────────────────────────
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// Parent ScrollView has paddingHorizontal: 20 on each side.
// We use marginHorizontal: -H_PAD on the frame wrapper to break out of it,
// giving us a true full-bleed image with zero right-side gap.
const H_PAD   = 20;
const FRAME_W = SCREEN_W;

const MAX_PORTRAIT_H  = SCREEN_H * 0.55;
const MAX_LANDSCAPE_H = SCREEN_H * 0.42;

function getImageHeight(aspectRatio, zoomed) {
  const naturalH = FRAME_W / aspectRatio.ratio;
  if (zoomed) return naturalH;
  const cap = aspectRatio.ratio < 1 ? MAX_PORTRAIT_H : MAX_LANDSCAPE_H;
  return Math.min(naturalH, cap);
}

// ─── Corner accent ────────────────────────────────────────────────────────────
function CornerAccent({ position, color }) {
  const s = {
    position: "absolute", width: 20, height: 20,
    borderColor: color, zIndex: 10,
    ...(position === "TL" && { top: 10,    left: 10,  borderTopWidth: 2,    borderLeftWidth: 2   }),
    ...(position === "TR" && { top: 10,    right: 10, borderTopWidth: 2,    borderRightWidth: 2  }),
    ...(position === "BL" && { bottom: 10, left: 10,  borderBottomWidth: 2, borderLeftWidth: 2   }),
    ...(position === "BR" && { bottom: 10, right: 10, borderBottomWidth: 2, borderRightWidth: 2  }),
  };
  return <View style={s} />;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, color }) {
  return (
    <View style={[styles.statPill, { borderColor: `${color}55` }]}>
      <View style={[styles.statDot, { backgroundColor: color }]} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────
function ActionBtn({ icon, label, onPress, primary, loading }) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.90, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    onPress?.();
  };

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.actionBtnWrap, anim]}>
      <TouchableOpacity
        style={[styles.actionBtn, primary && styles.actionBtnPrimary]}
        onPress={handlePress}
        activeOpacity={1}
      >
        {primary && (
          <LinearGradient
            colors={[colors.primary, `${colors.primary}AA`]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {loading ? (
          <DotsLoader color={primary ? "#fff" : colors.primary} size={5} />
        ) : (
          <View style={styles.actionBtnRow}>
            <Ionicons name={icon} size={15} color={primary ? "#fff" : colors.textMuted} />
            <Text style={[styles.actionBtnLabel, primary && { color: "#fff" }]}>
              {label}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Portrait overlay ─────────────────────────────────────────────────────────
function PortraitOverlay({
  prompt, color, modelLabel, elapsed, ratioLabel,
  onSave, onRegen, onNew, saving, zoomed,
}) {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Top gradient → stat pills */}
      <LinearGradient
        colors={["rgba(0,0,0,0.78)", "transparent"]}
        style={styles.overlayTop}
        pointerEvents="none"
      >
        <StatPill label={modelLabel}     color={color} />
        <StatPill label={`${elapsed}s`}  color={color} />
        <StatPill label={ratioLabel}     color={color} />
      </LinearGradient>

      {/* Bottom gradient → caption + buttons */}
      {!zoomed && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.84)", "rgba(0,0,0,0.97)"]}
          style={styles.overlayBottom}
          pointerEvents="box-none"
        >
          <Text style={styles.overlayCaption} numberOfLines={2}>"{prompt}"</Text>
          <View style={styles.overlayActions}>
            <ActionBtn icon="refresh"    label="REGEN" onPress={onRegen} />
            <ActionBtn icon="download"   label="SAVE"  onPress={onSave} primary loading={saving} />
            <ActionBtn icon="add-circle" label="NEW"   onPress={onNew} />
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

// ─── Landscape panel ──────────────────────────────────────────────────────────
function LandscapePanel({
  prompt, color, modelLabel, elapsed, ratioLabel,
  onSave, onRegen, onNew, saving,
}) {
  return (
    <Animated.View entering={FadeInUp.duration(300).delay(100)} style={styles.landscapePanel}>
      <View style={styles.statsRow}>
        <StatPill label={modelLabel}       color={color} />
        <StatPill label={ratioLabel}       color={color} />
        <StatPill label={`⏱ ${elapsed}s`} color={color} />
      </View>
      <Text style={styles.captionText} numberOfLines={2}>"{prompt}"</Text>
      <View style={styles.actionRow}>
        <ActionBtn icon="refresh"    label="REGEN"      onPress={onRegen} />
        <ActionBtn icon="download"   label="SAVE IMAGE" onPress={onSave} primary loading={saving} />
        <ActionBtn icon="add-circle" label="NEW"        onPress={onNew} />
      </View>
    </Animated.View>
  );
}

// ─── ResultCard ───────────────────────────────────────────────────────────────
export default function ResultCard({
  imageUri, prompt, model, elapsed, aspectRatio, onRegen, onNew,
}) {
  const [zoomed, setZoomed] = useState(false);
  const [saving, setSaving] = useState(false);

  const isPortrait = aspectRatio.ratio < 1;
  const color      = MODEL_INFO[model]?.color || colors.primary;
  const modelLabel = MODEL_INFO[model]?.label  || model;
  const imgH       = getImageHeight(aspectRatio, zoomed);

  // Card entrance
  const enterY   = useSharedValue(36);
  const enterOpa = useSharedValue(0);
  useEffect(() => {
    enterY.value   = withSpring(0, { damping: 18, stiffness: 200 });
    enterOpa.value = withTiming(1, { duration: 360, easing: Easing.out(Easing.quad) });
  }, []);
  const cardStyle = useAnimatedStyle(() => ({
    opacity:   enterOpa.value,
    transform: [{ translateY: enterY.value }],
  }));

  const handleSave = async () => {
    if (!imageUri || saving) return;
    setSaving(true);

    try {
      // Remove base64 header
      const b64 = imageUri.replace(/^data:image\/\w+;base64,/, "");

      // File path
      const path = FileSystem.cacheDirectory + `imagine_${Date.now()}.png`;

      // Write file
      await FileSystem.writeAsStringAsync(path, b64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Ask permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required");
        return;
      }

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(path);
      await MediaLibrary.createAlbumAsync("AI Images", asset, false);

      Alert.alert("Saved to gallery ✅");

    } catch (e) {
      Alert.alert("Save failed", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Animated.View style={cardStyle}>

      {/* ── RESULT label (inside normal padding) ── */}
      <Animated.View entering={FadeIn.duration(260)} style={styles.resultRow}>
        <View style={[styles.resultDot, { backgroundColor: color }]} />
        <Text style={styles.resultLabel}>RESULT</Text>
        <View style={styles.resultRule} />
      </Animated.View>

      {/* ── Image frame
            marginHorizontal: -H_PAD cancels the parent ScrollView's
            paddingHorizontal so the image bleeds edge-to-edge.
            Width is SCREEN_W so it exactly fills — no right-side gap. ── */}
      <Animated.View
        entering={FadeInDown.duration(360).springify()}
        style={[styles.frameWrap, { shadowColor: color }]}
      >
        <TouchableOpacity
          activeOpacity={0.97}
          onPress={() => setZoomed((v) => !v)}
          style={styles.frame}
        >
          {["TL","TR","BL","BR"].map((pos) => (
            <CornerAccent key={pos} position={pos} color={color} />
          ))}

          <Image
            source={{ uri: imageUri }}
            style={{
              width: FRAME_W,
              height: imgH,
              backgroundColor: colors.bgCard,
            }}
            resizeMode={zoomed ? "contain" : "cover"}
          />

          {isPortrait && (
            <PortraitOverlay
              prompt={prompt}      color={color}
              modelLabel={modelLabel} elapsed={elapsed}
              ratioLabel={aspectRatio.label}
              onSave={handleSave}  onRegen={onRegen}  onNew={onNew}
              saving={saving}      zoomed={zoomed}
            />
          )}

          <View style={styles.tapHintWrap} pointerEvents="none">
            <Text style={styles.tapHint}>
              {zoomed ? "TAP TO COLLAPSE" : "TAP TO EXPAND"}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Landscape controls (back inside normal padding) ── */}
      {!isPortrait && (
        <LandscapePanel
          prompt={prompt}         color={color}
          modelLabel={modelLabel} elapsed={elapsed}
          ratioLabel={aspectRatio.label}
          onSave={handleSave}     onRegen={onRegen}  onNew={onNew}
          saving={saving}
        />
      )}

      {/* ── Tip (inside normal padding) ── */}
      <Animated.View entering={FadeInUp.duration(280).delay(180)} style={styles.tipCard}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipBody}>
          Try a <Text style={styles.tipAccent}>Style Preset</Text> or raise{" "}
          <Text style={styles.tipAccent}>Steps to 35+</Text> for sharper results.
        </Text>
      </Animated.View>

    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // RESULT label
  resultRow: {
    flexDirection: "row", alignItems: "center",
    gap: 8, marginBottom: 14,
  },
  resultDot:   { width: 7, height: 7, borderRadius: 4 },
  resultLabel: { ...typography.label, color: colors.textMuted, letterSpacing: 3 },
  resultRule:  { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" },

  // ── Full-bleed frame ──────────────────────────────────────────────────────
  frameWrap: {
    marginRight: -H_PAD,        // ← shift right to cancel parent paddingRight
    width: SCREEN_W,            // ← explicit full width so left side doesn't gap
    marginBottom: spacing.md,
    shadowOffset:  { width: 0, height: 10 },
    shadowOpacity: 0.42,
    shadowRadius:  30,
    elevation: 16,
  },
  frame: {
    width: SCREEN_W,
    overflow: "hidden",
    position: "relative",
  },

  // ── Portrait overlay ──────────────────────────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  overlayTop: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 7, padding: 14,
  },
  overlayBottom: {
    padding: 16, paddingBottom: 20, gap: 10,
  },
  overlayCaption: {
    ...typography.bodySm,
    color: "rgba(255,255,255,0.82)",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 19,
  },
  overlayActions: { flexDirection: "row", gap: 8 },

  // ── Stat pills ────────────────────────────────────────────────────────────
  statPill: {
    flexDirection: "row", alignItems: "center",
    gap: 5, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 99, borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  statDot:  { width: 5, height: 5, borderRadius: 3 },
  statText: {
    fontSize: 10, fontWeight: "700",
    color: "rgba(255,255,255,0.84)", letterSpacing: 0.6,
  },

  // ── Tap hint ──────────────────────────────────────────────────────────────
  tapHintWrap: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    alignItems: "center", paddingBottom: 8,
  },
  tapHint: {
    fontSize: 9, fontWeight: "700",
    letterSpacing: 2.5, color: "rgba(255,255,255,0.22)",
  },

  // ── Landscape panel ───────────────────────────────────────────────────────
  landscapePanel: { marginBottom: spacing.md },
  statsRow: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 7, marginBottom: 10,
  },
  captionText: {
    ...typography.bodySm,
    color: colors.textMuted, fontStyle: "italic",
    textAlign: "center", lineHeight: 18,
    marginBottom: 14, opacity: 0.8,
  },
  actionRow: { flexDirection: "row", gap: 8 },

  // ── Action buttons ────────────────────────────────────────────────────────
  actionBtnWrap: { flex: 1 },
  actionBtn: {
    height: 46, borderRadius: radius.md,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden", alignItems: "center", justifyContent: "center",
  },
  actionBtnPrimary: {
    borderColor: `${colors.primary}80`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55, shadowRadius: 12,
    elevation: 8,
  },
  actionBtnRow:   { flexDirection: "row", alignItems: "center", gap: 6 },
  actionBtnLabel: {
    fontSize: 10, fontWeight: "800",
    letterSpacing: 1.8, color: colors.textMuted,
  },

  // ── Tip card ─────────────────────────────────────────────────────────────
  tipCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    borderRadius: radius.md,
    padding: 13, gap: 10,
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  tipIcon:   { fontSize: 13 },
  tipBody:   { flex: 1, ...typography.bodySm, color: colors.textMuted, lineHeight: 17 },
  tipAccent: { color: colors.primary, fontWeight: "700" },
});