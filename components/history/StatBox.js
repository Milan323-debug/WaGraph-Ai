import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/theme";
import { historyStyles } from "../../styles/historyStyles";

export function StatBox({ icon, label, value }) {
  return (
    <View style={historyStyles.statBox}>
      <Ionicons name={icon} size={14} color={colors.primary} />
      <Text style={historyStyles.statLabel}>{label}</Text>
      <Text style={historyStyles.statValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}
