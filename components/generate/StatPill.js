import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "../../styles/theme";

/**
 * Stat pill - small badge displaying model, aspect ratio, or time info
 */
export default function StatPill({ label, color, icon }) {
  return (
    <View style={[styles.statPill, { borderColor: `${color}50` }]}>
      {icon && <Ionicons name={icon} size={9} color={color} />}
      <Text style={[styles.statText, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  statText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
