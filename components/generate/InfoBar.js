import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, FadeIn, Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import StatPill from "./StatPill";
import { MODEL_INFO } from "../../utils/api";
import { colors, typography, radius } from "../../styles/theme";

/**
 * Info bar - displays model, aspect ratio, and elapsed time with progress bar
 */
export default function InfoBar({ model, elapsed, aspectRatio, color }) {
  const barW = useSharedValue(0);
  
  useEffect(() => {
    barW.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) });
  }, []);
  
  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: barW.value }],
    transformOrigin: "left",
  }));

  return (
    <Animated.View entering={FadeIn.duration(400).delay(200)} style={styles.infoBar}>
      <View style={[styles.infoModelDot, { backgroundColor: color }]} />
      <Text style={styles.infoModelTxt}>{MODEL_INFO[model]?.label || model}</Text>
      <View style={styles.infoDivider} />
      <Text style={styles.infoDetailTxt}>{aspectRatio.label}</Text>
      <View style={styles.infoDivider} />
      <Ionicons name="timer-outline" size={10} color={colors.textMuted} />
      <Text style={styles.infoDetailTxt}>{elapsed}s</Text>
      <View style={{ flex: 1 }} />
      {/* Generation time progress bar */}
      <View style={styles.infoBarTrack}>
        <Animated.View style={[styles.infoBarFill, { backgroundColor: color }, barStyle]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  infoModelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  infoModelTxt: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  infoDivider: {
    width: 1,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  infoDetailTxt: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoBarTrack: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  infoBarFill: {
    height: "100%",
    borderRadius: 2,
  },
});
