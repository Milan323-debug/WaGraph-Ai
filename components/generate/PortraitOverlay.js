import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StatPill from "./StatPill";
import IconBtn from "./IconBtn";
import { colors, typography } from "../../styles/theme";

/**
 * Portrait overlay - stats and controls shown on portrait aspect ratio images
 */
export default function PortraitOverlay({
  prompt,
  color,
  modelLabel,
  elapsed,
  ratioLabel,
  onRegen,
  onNew,
  zoomed,
}) {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <LinearGradient
        colors={["rgba(0,0,0,0.72)", "transparent"]}
        style={styles.overlayTop}
        pointerEvents="none"
      >
        <StatPill label={modelLabel} color={color} icon="cube-outline" />
        <StatPill label={`${elapsed}s`} color={color} icon="timer-outline" />
        <StatPill label={ratioLabel} color={color} icon="crop-outline" />
      </LinearGradient>

      {!zoomed && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.82)", "rgba(0,0,0,0.97)"]}
          style={styles.overlayBottom}
          pointerEvents="box-none"
        >
          <Text style={styles.overlayCaption} numberOfLines={2}>
            "{prompt}"
          </Text>
          <View style={styles.overlayActions}>
            <IconBtn icon="refresh-outline" label="REGEN" onPress={onRegen} />
            <IconBtn icon="add-circle-outline" label="NEW" onPress={onNew} />
          </View>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  overlayTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    padding: 12,
    paddingTop: 14,
  },
  overlayBottom: {
    padding: 14,
    paddingBottom: 16,
    gap: 10,
  },
  overlayCaption: {
    ...typography.bodySm,
    color: "rgba(255,255,255,0.82)",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 18,
  },
  overlayActions: {
    flexDirection: "row",
    gap: 8,
  },
});
