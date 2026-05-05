import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import StatPill from "./StatPill";
import IconBtn from "./IconBtn";
import ShimmerSaveBtn from "./ShimmerSaveBtn";
import { colors, typography, spacing } from "../../styles/theme";

/**
 * Landscape panel - controls shown beside landscape aspect ratio images
 */
export default function LandscapePanel({
  prompt,
  color,
  modelLabel,
  elapsed,
  ratioLabel,
  imageUri,
  onRegen,
  onNew,
}) {
  return (
    <Animated.View entering={FadeInUp.duration(320).delay(80)} style={styles.landscapePanel}>
      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatPill label={modelLabel} color={color} icon="cube-outline" />
        <StatPill label={ratioLabel} color={color} icon="crop-outline" />
        <StatPill label={`⏱ ${elapsed}s`} color={color} icon="timer-outline" />
      </View>

      {/* Caption */}
      <Text style={styles.captionText} numberOfLines={2}>
        "{prompt}"
      </Text>

      {/* Action row */}
      <View style={styles.actionRow}>
        <IconBtn icon="refresh-outline" label="REGEN" onPress={onRegen} />
        <ShimmerSaveBtn url={imageUri} style={{ flex: 2 }} />
        <IconBtn icon="add-circle-outline" label="NEW" onPress={onNew} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  landscapePanel: {
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  captionText: {
    ...typography.bodySm,
    color: colors.textMuted,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 12,
    opacity: 0.8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
});
