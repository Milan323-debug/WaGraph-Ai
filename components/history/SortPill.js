import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { historyStyles } from "../../styles/historyStyles";

export function SortPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[historyStyles.sortPill, active && historyStyles.sortPillActive]}
      onPress={onPress}
    >
      <Text style={[historyStyles.sortPillTxt, active && historyStyles.sortPillTxtActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
