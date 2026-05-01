import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "../../styles/theme";

export default function SectionLabel({ label, right }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {right && <View>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm + 2,
  },
  label: {
    ...typography.label,
    color: colors.textMuted,
  },
});