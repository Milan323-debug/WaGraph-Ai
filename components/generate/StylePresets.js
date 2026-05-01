import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { STYLE_PRESETS } from "../../utils/api";
import { colors, spacing, radius, typography } from "../../styles/theme";

export default function StylePresets({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>STYLE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STYLE_PRESETS.map((p) => {
          const isOn = selected?.label === p.label;
          return (
            <TouchableOpacity
              key={p.label}
              style={[styles.chip, isOn && styles.chipOn]}
              onPress={() => onSelect(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.text, isOn && styles.textOn]} numberOfLines={1}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { marginBottom: 0 },
  heading: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  scrollContent: { paddingRight: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    elevation: 2,
  },
  chipOn:  { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
  text:    { fontSize: 10, fontWeight: "600", color: colors.textMuted },
  textOn:  { color: colors.primary, fontWeight: "700" },
});