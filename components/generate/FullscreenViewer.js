import React, { useState, useEffect } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CornerAccent from "./CornerAccent";
import StatPill from "./StatPill";
import ShimmerSaveBtn from "./ShimmerSaveBtn";
import { MODEL_INFO } from "../../utils/api";
import { colors, typography } from "../../styles/theme";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/**
 * Fullscreen viewer modal - immersive image viewing with touch-to-hide controls
 */
export default function FullscreenViewer({
  imageUri,
  aspectRatio,
  prompt,
  model,
  elapsed,
  visible,
  onClose,
}) {
  const [chromeOn, setChromeOn] = useState(true);
  const chromeOpa = useSharedValue(1);
  const bgOpa = useSharedValue(0);
  const imgScale = useSharedValue(0.85);

  const imgW = aspectRatio?.w || 1024;
  const imgH = aspectRatio?.h || 1024;
  const ratio = imgW / imgH;
  let dW = SCREEN_W,
    dH = SCREEN_W / ratio;
  if (dH > SCREEN_H) {
    dH = SCREEN_H;
    dW = SCREEN_H * ratio;
  }

  const color = MODEL_INFO[model]?.color || colors.primary;
  const modelLabel = MODEL_INFO[model]?.label || model;

  useEffect(() => {
    if (visible) {
      setChromeOn(true);
      bgOpa.value = withTiming(1, { duration: 300 });
      imgScale.value = withSpring(1, { damping: 16, stiffness: 180 });
      chromeOpa.value = withTiming(1, { duration: 250 });
    } else {
      bgOpa.value = withTiming(0, { duration: 200 });
      imgScale.value = withTiming(0.88, { duration: 200 });
    }
  }, [visible]);

  const toggleChrome = () => {
    const next = !chromeOn;
    setChromeOn(next);
    chromeOpa.value = withTiming(next ? 1 : 0, { duration: 220 });
  };

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpa.value }));
  const imgAnim = useAnimatedStyle(() => ({ transform: [{ scale: imgScale.value }] }));
  const chromeStyle = useAnimatedStyle(() => ({ opacity: chromeOpa.value }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.root, bgStyle]}>
        {/* Tap outside = close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />

        {/* Image */}
        <Animated.View style={[styles.imgWrap, imgAnim, { shadowColor: color }]}>
          <TouchableOpacity activeOpacity={1} onPress={toggleChrome}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: dW, height: dH }}
              contentFit="contain"
              transition={250}
            />
            {/* Corner accents on fullscreen */}
            {["TL", "TR", "BL", "BR"].map((p) => (
              <CornerAccent key={p} position={p} color={`${color}80`} size={16} />
            ))}
          </TouchableOpacity>
        </Animated.View>

        {/* Top chrome */}
        <Animated.View style={[styles.topBar, chromeStyle]} pointerEvents="box-none">
          <LinearGradient
            colors={["rgba(0,0,0,0.75)", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.topPills}>
            <StatPill label={modelLabel} color={color} icon="cube-outline" />
            <StatPill label={`${elapsed}s`} color={color} icon="timer-outline" />
            <StatPill label={aspectRatio?.label || ""} color={color} icon="crop-outline" />
          </View>
        </Animated.View>

        {/* Bottom chrome */}
        <Animated.View style={[styles.bottomBar, chromeStyle]} pointerEvents="box-none">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.88)", "rgba(0,0,0,0.97)"]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.fsPrompt} numberOfLines={3}>
            "{prompt}"
          </Text>
          <View style={styles.fsActionRow}>
            <ShimmerSaveBtn url={imageUri} style={{ flex: 1 }} />
          </View>
          <Text style={styles.tapHint}>TAP IMAGE TO TOGGLE CONTROLS</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  imgWrap: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 48,
    elevation: 24,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  topPills: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 48,
    gap: 14,
  },
  fsPrompt: {
    ...typography.body,
    color: "rgba(255,255,255,0.88)",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },
  fsActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  tapHint: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.18)",
    textAlign: "center",
  },
});
