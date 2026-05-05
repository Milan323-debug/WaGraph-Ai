import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { historyStyles } from "../../styles/historyStyles";

export function EmptyState() {
  return (
    <Animated.View entering={FadeIn.duration(500)} style={historyStyles.empty}>
      <View style={historyStyles.emptyIconWrap}>
        <Text style={historyStyles.emptyIconText}>🖼</Text>
      </View>
      <Text style={historyStyles.emptyTitle}>No Creations Yet</Text>
      <Text style={historyStyles.emptySub}>
        Generate your first AI image — it will automatically appear here.
      </Text>
    </Animated.View>
  );
}
