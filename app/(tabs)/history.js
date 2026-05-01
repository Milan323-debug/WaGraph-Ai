import React, { useState } from "react";
import {
  View, Text, Image, TouchableOpacity,
  FlatList, StyleSheet, Modal, Alert, ScrollView,
  StatusBar, Dimensions,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useStore }     from "../../hooks/useStore";
import { clearHistory } from "../../store/appStore";
import { MODEL_INFO }   from "../../utils/api";
import { colors, spacing, radius, typography, screen } from "../../styles/theme";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const COLS  = 2;
const THUMB = (screen.width - spacing.md * 3) / COLS;
const { width: W, height: H } = Dimensions.get("window");

// ─── EMPTY STATE ──────────────────────────────────────────────
function EmptyState() {
  return (
    <View style={empty.container}>
      <View style={empty.iconWrap}>
        <Text style={empty.icon}>◫</Text>
      </View>
      <Text style={empty.title}>No Images Yet</Text>
      <Text style={empty.sub}>Generate your first image on the{"\n"}Generate tab to see it here.</Text>
    </View>
  );
}
const empty = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: -40 },
  iconWrap:  {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: `${colors.primary}14`,
    borderWidth: 1, borderColor: `${colors.primary}30`,
    alignItems: "center", justifyContent: "center", marginBottom: spacing.md,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, shadowRadius: 20,
  },
  icon:  { fontSize: 30, color: colors.primary },
  title: { ...typography.h3, color: colors.textSecondary, marginBottom: spacing.sm },
  sub:   { ...typography.bodySm, color: colors.textMuted, textAlign: "center", lineHeight: 20 },
});

// ─── ANIMATED THUMB ───────────────────────────────────────────
function ThumbCard({ item, onPress }) {
  const scale      = useSharedValue(1);
  const modelColor = MODEL_INFO[item.model]?.color || colors.primary;

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.94, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 14, stiffness: 260 });
    });
    onPress(item);
  };

  return (
    <Animated.View style={[
      { width: THUMB, borderRadius: radius.md, overflow: "hidden" },
      cardStyle,
      { shadowColor: modelColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
    ]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        <Image source={{ uri: item.uri }} style={styles.thumbImg} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(11,15,26,0.85)"]}
          style={styles.thumbOverlay}
        >
          <View style={[styles.thumbPip, { backgroundColor: modelColor }]} />
          <Text style={styles.thumbMeta}>{item.aspectLabel}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── FULLSCREEN VIEWER ────────────────────────────────────────
function FullscreenViewer({ item, onClose }) {
  const insets  = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const scale   = useSharedValue(0.9);
  const uiOpacity = useSharedValue(1);
  const [uiVisible, setUiVisible] = useState(true);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 260 });
    scale.value   = withSpring(1, { damping: 20, stiffness: 220 });
  }, []);

  const bgStyle  = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const imgStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const uiStyle  = useAnimatedStyle(() => ({ opacity: uiOpacity.value }));

  const handleClose = () => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value   = withTiming(0.93, { duration: 200 });
    setTimeout(onClose, 200);
  };

  const toggleUI = () => {
    const next = uiVisible ? 0 : 1;
    uiOpacity.value = withTiming(next, { duration: 200 });
    setUiVisible(!uiVisible);
  };

  return (
    <Modal
      visible
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={handleClose}
    >
      <StatusBar hidden />
      <Animated.View style={[fs.backdrop, bgStyle]}>

        {/* Tap image to toggle UI / tap edges to close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={toggleUI}
        />

        {/* Full-screen image */}
        <Animated.View style={[fs.imgWrap, imgStyle]}>
          <Image
            source={{ uri: item.uri }}
            style={fs.img}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Top bar — close button */}
        <Animated.View style={[fs.topBar, { paddingTop: insets.top + 8 }, uiStyle]}>
          <TouchableOpacity style={fs.closeBtn} onPress={handleClose} activeOpacity={0.8}>
            <Text style={fs.closeTxt}>✕</Text>
          </TouchableOpacity>
          {/* Tap hint */}
          <View style={fs.hint}>
            <Text style={fs.hintTxt}>TAP TO TOGGLE UI</Text>
          </View>
        </Animated.View>

        {/* Bottom caption gradient */}
        <Animated.View style={[fs.captionWrap, uiStyle]} pointerEvents="none">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.82)"]}
            style={[fs.captionGrad, { paddingBottom: insets.bottom + 24 }]}
          >
            {/* Model dot + meta */}
            <View style={fs.metaRow}>
              <View style={[fs.pip, { backgroundColor: MODEL_INFO[item.model]?.color || colors.primary }]} />
              <Text style={fs.metaTxt}>
                {MODEL_INFO[item.model]?.label} · {item.aspectLabel} · {item.steps} steps · ⏱ {item.elapsed}s
              </Text>
            </View>
            <Text style={fs.promptTxt} numberOfLines={2}>
              {item.rawPrompt || item.prompt}
            </Text>
          </LinearGradient>
        </Animated.View>

      </Animated.View>
    </Modal>
  );
}

const fs = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  imgWrap: {
    width: W,
    height: H,
    position: "absolute",
  },
  img: { width: "100%", height: "100%" },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
  },
  closeTxt: { fontSize: 16, color: "#fff", fontWeight: "700" },

  hint: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  hintTxt: { fontSize: 9, letterSpacing: 1.5, color: "rgba(255,255,255,0.5)", fontWeight: "700" },

  captionWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  captionGrad: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  pip:     { width: 6, height: 6, borderRadius: 3 },
  metaTxt: { fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 0.8 },
  promptTxt: { fontSize: 15, fontWeight: "600", color: "#fff", lineHeight: 22 },
});

// ─── DETAIL MODAL ─────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  const [saving, setSaving]         = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const insets = useSafeAreaInsets();
  if (!item) return null;

  const modelColor = MODEL_INFO[item.model]?.color || colors.primary;
  const ratio      = item.aspectRatio?.ratio ?? 1;
  const imgW       = screen.width - spacing.md * 2;
  const naturalH   = imgW / ratio;
  const imgH       = Math.min(naturalH, screen.height * 0.5);

  const handleSave = async () => {
    setSaving(true);

    try {
      // Remove base64 header
      const b64 = item.uri.replace(/^data:image\/\w+;base64,/, "");

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
    <>
      <Modal visible animationType="slide" transparent onRequestClose={onClose}>
        <View style={dm.overlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

          <View style={[dm.sheet, { paddingBottom: insets.bottom + 16 }]}>
            {/* Handle + close */}
            <View style={dm.topBar}>
              <View style={dm.handle} />
              <TouchableOpacity style={dm.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={dm.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={dm.inner}
              contentContainerStyle={dm.innerContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Image — tap opens fullscreen */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setFullscreen(true)}
                style={[dm.imgWrap, { height: imgH }]}
              >
                {[dm.cTL, dm.cTR, dm.cBL, dm.cBR].map((c, i) => (
                  <View key={i} style={[dm.corner, c, { borderColor: colors.primary }]} />
                ))}
                <Image source={{ uri: item.uri }} style={dm.img} resizeMode="contain" />

                {/* Expand badge */}
                <View style={dm.expandBadge}>
                  <Text style={dm.expandIcon}>⛶</Text>
                  <Text style={dm.expandTxt}>FULLSCREEN</Text>
                </View>
              </TouchableOpacity>

              {/* Meta */}
              <View style={dm.meta}>
                <View style={[dm.pip, { backgroundColor: modelColor }]} />
                <Text style={dm.metaText}>
                  {MODEL_INFO[item.model]?.label} · {item.aspectLabel} · {item.steps} steps · ⏱ {item.elapsed}s
                </Text>
              </View>

              <Text style={dm.prompt} numberOfLines={3}>
                {item.rawPrompt || item.prompt}
              </Text>

              <View style={dm.badges}>
                {[item.stylePreset, item.aspectLabel, `${item.steps} STEPS`].map((b) => (
                  <View key={b} style={dm.badge}>
                    <Text style={dm.badgeText}>{b}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Actions pinned at bottom */}
            <View style={dm.actions}>
              <TouchableOpacity
                style={[dm.btn, dm.fsBtn]}
                onPress={() => setFullscreen(true)}
                activeOpacity={0.8}
              >
                <Text style={[dm.btnText, { color: colors.textSecondary }]}>⛶</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[dm.btn, dm.saveBtn, { flex: 2 }]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Text style={[dm.btnText, { color: colors.primary }]}>
                  {saving ? "SAVING…" : "↓  SAVE IMAGE"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={[dm.btn, { flex: 1 }]} onPress={onClose} activeOpacity={0.8}>
                <Text style={dm.btnText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {fullscreen && (
        <FullscreenViewer item={item} onClose={() => setFullscreen(false)} />
      )}
    </>
  );
}

const dm = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    maxHeight: "92%",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  handle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: `${colors.primary}14`,
    alignItems: "center", justifyContent: "center",
  },
  closeIcon: { fontSize: 18, color: colors.primary, fontWeight: "600" },

  inner:        { flexShrink: 1 },
  innerContent: { paddingBottom: spacing.sm },

  imgWrap: {
    width: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: spacing.md,
    position: "relative",
    backgroundColor: colors.bgCard,
  },
  img: { width: "100%", height: "100%" },

  corner: { position: "absolute", width: 16, height: 16, zIndex: 10 },
  cTL:    { top: 8,    left: 8,   borderTopWidth: 2,    borderLeftWidth: 2  },
  cTR:    { top: 8,    right: 8,  borderTopWidth: 2,    borderRightWidth: 2 },
  cBL:    { bottom: 8, left: 8,   borderBottomWidth: 2, borderLeftWidth: 2  },
  cBR:    { bottom: 8, right: 8,  borderBottomWidth: 2, borderRightWidth: 2 },

  expandBadge: {
    position: "absolute",
    bottom: 10, right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  expandIcon: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
  expandTxt:  { fontSize: 8, fontWeight: "800", letterSpacing: 1.5, color: "rgba(255,255,255,0.65)" },

  meta:     { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  pip:      { width: 6, height: 6, borderRadius: 3 },
  metaText: { ...typography.caption, color: colors.textMuted },

  prompt: { ...typography.body, color: colors.textPrimary, marginBottom: spacing.md, lineHeight: 22 },

  badges:    { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: spacing.sm },
  badge:     {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: colors.bgCard,
  },
  badgeText: { ...typography.micro, color: colors.textMuted, letterSpacing: 1.5 },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
  },
  btn: {
    flex: 1,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingVertical: 14,
    alignItems: "center", backgroundColor: colors.bgCard,
  },
  fsBtn:   { borderColor: `${colors.primary}44`, backgroundColor: `${colors.primary}0A` },
  saveBtn: { borderColor: colors.primary, backgroundColor: `${colors.primary}14` },
  btnText: { ...typography.micro, letterSpacing: 2, color: colors.textMuted },
});

// ─── MAIN SCREEN ──────────────────────────────────────────────
export default function HistoryScreen() {
  const insets      = useSafeAreaInsets();
  const { history } = useStore();
  const [detail, setDetail] = useState(null);

  const handleClear = () => {
    Alert.alert("Clear Gallery", "Remove all images from this session?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: clearHistory },
    ]);
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gallery</Text>
          <Text style={styles.subtitle}>
            {history.length} image{history.length !== 1 ? "s" : ""} this session
          </Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear} activeOpacity={0.7}>
            <Text style={styles.clearText}>CLEAR ALL</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          numColumns={COLS}
          renderItem={({ item }) => <ThumbCard item={item} onPress={setDetail} />}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}

      <DetailModal item={detail} onClose={() => setDetail(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: screen.paddingH, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title:    { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  clearBtn: {
    borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 6,
  },
  clearText: { ...typography.micro, color: colors.textMuted, letterSpacing: 2 },
  grid:      { padding: spacing.md, gap: spacing.sm, paddingBottom: 120 },
  row:       { gap: spacing.sm },
  thumbImg:  { width: "100%", height: THUMB },
  thumbOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 44, flexDirection: "row", alignItems: "flex-end",
    padding: 8, gap: 5,
  },
  thumbPip:  { width: 5, height: 5, borderRadius: 2.5 },
  thumbMeta: { ...typography.micro, color: "rgba(255,255,255,0.6)", letterSpacing: 1 },
});