import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ASPECT_RATIOS } from "../../utils/api";
import { colors, spacing, radius, typography } from "../../styles/theme";

export default function AspectRatioSelector({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.heading}>ASPECT RATIO</Text>
        <View style={styles.resBadge}>
          <Text style={styles.resText}>
            {selected.w} × {selected.h}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        {ASPECT_RATIOS.map((a) => {
          const isOn = selected.label === a.label;
          // Scale preview down so cards stay compact
          const previewH = a.ratio < 0.8 ? 28 : a.ratio > 1.2 ? 18 : 22;
          const previewW = a.ratio >= 1 ? 28 : Math.round(28 * a.ratio);

          return (
            <TouchableOpacity
              key={a.label}
              style={[styles.card, isOn && styles.cardOn]}
              onPress={() => onSelect(a)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.preview,
                  { width: previewW, height: previewH },
                  isOn && styles.previewOn,
                ]}
              />
              <Text style={[styles.label, isOn && styles.labelOn]}>
                {a.label}
              </Text>
              <Text style={[styles.tag, isOn && styles.tagOn]}>
                {a.tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  resBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  resText: {
    fontSize: 9,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    elevation: 2,
  },
  cardOn: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  preview: {
    borderRadius: 2,
    borderWidth: 1.3,
    borderColor: colors.border,
    backgroundColor: "transparent",
  },
  previewOn: {
    borderColor: colors.primary,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  labelOn: {
    color: colors.primary,
  },
  tag: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: colors.textDim,
  },
  tagOn: {
    color: colors.primaryDim,
  },
});