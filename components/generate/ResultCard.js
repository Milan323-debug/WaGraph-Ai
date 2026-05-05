import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, interpolate, Extrapolation, Easing,
  FadeIn, FadeInDown, FadeInUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CornerAccent from "./CornerAccent";
import SkeletonLoader from "./SkeletonLoader";
import ShimmerSaveBtn from "./ShimmerSaveBtn";
import StatPill from "./StatPill";
import IconBtn from "./IconBtn";
import InfoBar from "./InfoBar";
import PortraitOverlay from "./PortraitOverlay";
import LandscapePanel from "./LandscapePanel";
import FullscreenViewer from "./FullscreenViewer";
import { MODEL_INFO } from "../../utils/api";
import { colors } from "../../styles/theme";
import { resultCardStyles, getImageHeight } from "../../styles/resultCardStyles";

const { width: SCREEN_W } = Dimensions.get("window");
const FRAME_W = SCREEN_W;

// ─── Main ResultCard ──────────────────────────────────────────────────────────
export default function ResultCard({ imageUri, prompt, model, elapsed, aspectRatio, onRegen, onNew }) {
  const [zoomed,   setZoomed]   = useState(false);
  const [fsOpen,   setFsOpen]   = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [longPressed, setLongPressed] = useState(false);

  const isPortrait = aspectRatio.ratio < 1;
  const color      = MODEL_INFO[model]?.color || colors.primary;
  const modelLabel = MODEL_INFO[model]?.label  || model;
  const imgH       = getImageHeight(aspectRatio, zoomed);

  // Card entrance
  const enterY   = useSharedValue(48);
  const enterOpa = useSharedValue(0);
  const enterScl = useSharedValue(0.94);

  useEffect(() => {
    enterY.value   = withSpring(0,   { damping: 18, stiffness: 180 });
    enterOpa.value = withTiming(1,   { duration: 400, easing: Easing.out(Easing.quad) });
    enterScl.value = withSpring(1,   { damping: 16, stiffness: 200 });
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    opacity:   enterOpa.value,
    transform: [
      { translateY: enterY.value },
      { scale: enterScl.value },
    ],
  }));

  // Long press glow pulse on frame
  const framePulse = useSharedValue(0);
  const frameStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(framePulse.value, [0, 1], [0.42, 0.8], Extrapolation.CLAMP),
    shadowRadius:  interpolate(framePulse.value, [0, 1], [28, 48],    Extrapolation.CLAMP),
  }));

  const handleLongPress = () => {
    // Open fullscreen on long press
    framePulse.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 300 })
    );
    setFsOpen(true);
  };

  return (
    <>
      <Animated.View style={cardStyle}>

        {/* ── RESULT label ── */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.resultRow}>
          <View style={[styles.resultDot, { backgroundColor: color }]}>
            <View style={[styles.resultDotInner, { backgroundColor: color }]} />
          </View>
          <Text style={styles.resultLabel}>RESULT</Text>
          <View style={styles.resultRule} />
          {/* Fullscreen button */}
          <TouchableOpacity style={styles.fsHintBtn} onPress={() => setFsOpen(true)}>
            <Ionicons name="expand-outline" size={14} color={colors.textMuted} />
            <Text style={styles.fsHintTxt}>FULLSCREEN</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Info bar ── */}
        <InfoBar model={model} elapsed={elapsed} aspectRatio={aspectRatio} color={color} />

        {/* ── Image frame ── */}
        <Animated.View
          entering={FadeInDown.duration(400).springify()}
          style={[styles.frameWrap, { shadowColor: color }, frameStyle]}
        >
          <TouchableOpacity
            activeOpacity={0.97}
            onPress={() => setZoomed(v => !v)}
            onLongPress={handleLongPress}
            delayLongPress={350}
            style={styles.frame}
          >
            {["TL","TR","BL","BR"].map(p => (
              <CornerAccent key={p} position={p} color={`${color}90`} />
            ))}

            {!imageLoaded && <SkeletonLoader height={imgH} />}

            <Image
              source={{ uri: imageUri }}
              style={{ width: FRAME_W, height: imgH, backgroundColor: colors.bgCard }}
              contentFit={zoomed ? "contain" : "cover"}
              transition={300}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Scan line effect — subtle horizontal lines over the image */}
            <View style={styles.scanLines} pointerEvents="none" />

            {isPortrait && (
              <PortraitOverlay
                prompt={prompt} color={color}
                modelLabel={modelLabel} elapsed={elapsed}
                ratioLabel={aspectRatio.label}
                onSave={() => {}} onRegen={onRegen} onNew={onNew}
                saving={false} zoomed={zoomed}
                imageUri={imageUri}
              />
            )}

            {/* Tap / long-press hints */}
            <View style={styles.tapHintWrap} pointerEvents="none">
              <Text style={styles.tapHint}>
                {zoomed ? "TAP TO COLLAPSE" : "TAP TO EXPAND  ·  HOLD FOR FULLSCREEN"}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Landscape controls ── */}
        {!isPortrait && (
          <LandscapePanel
            prompt={prompt} color={color}
            modelLabel={modelLabel} elapsed={elapsed}
            ratioLabel={aspectRatio.label}
            imageUri={imageUri}
            onRegen={onRegen} onNew={onNew}
            saving={false}
          />
        )}

        {/* ── Portrait save (below frame, not in overlay) ── */}
        {isPortrait && (
          <Animated.View entering={FadeInUp.duration(280).delay(220)} style={styles.portraitSaveRow}>
            <IconBtn icon="refresh-outline"    label="REGEN" onPress={onRegen} />
            <ShimmerSaveBtn url={imageUri} style={{ flex: 1.4 }} />
            <IconBtn icon="add-circle-outline" label="NEW"   onPress={onNew} />
          </Animated.View>
        )}

        {/* ── Tip card ── */}
        <Animated.View entering={FadeInUp.duration(280).delay(300)} style={styles.tipCard}>
          <LinearGradient
            colors={[`${colors.primary}10`, "transparent"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.tipAccentBar, { backgroundColor: colors.primary }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>PRO TIP</Text>
            <Text style={styles.tipBody}>
              Try a <Text style={styles.tipHighlight}>Style Preset</Text> or raise{" "}
              <Text style={styles.tipHighlight}>Steps to 35+</Text> for sharper results.
              Hold the image for fullscreen view.
            </Text>
          </View>
        </Animated.View>

      </Animated.View>

      {/* ── Fullscreen viewer ── */}
      <FullscreenViewer
        imageUri={imageUri}
        aspectRatio={aspectRatio}
        prompt={prompt}
        model={model}
        elapsed={elapsed}
        visible={fsOpen}
        onClose={() => setFsOpen(false)}
      />
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = resultCardStyles;