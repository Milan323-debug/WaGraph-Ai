import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/theme";
import { historyStyles } from "../../styles/historyStyles";

export function ErrorState({ message, onRetry }) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={historyStyles.empty}>
      <Text style={{ fontSize: 40 }}>⚠️</Text>
      <Text style={historyStyles.emptyTitle}>Failed to Load</Text>
      <Text style={historyStyles.emptySub}>{message}</Text>
      <TouchableOpacity style={historyStyles.retryBtn} onPress={onRetry}>
        <Ionicons name="refresh" size={14} color={colors.primary} />
        <Text style={historyStyles.retryTxt}>TRY AGAIN</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
