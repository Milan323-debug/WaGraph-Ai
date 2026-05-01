import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import ShimmerBox   from "../ui/ShimmerBox";
import { MODEL_INFO } from "../../utils/api";
import { colors, spacing, radius, typography } from "../../styles/theme";

function ModelCard({ model, isOn, onPress }) {
  const info  = MODEL_INFO[model];
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isOn ? 1.03 : 1, { damping: 16, stiffness: 240 });
  }, [isOn]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.94, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(isOn ? 1.03 : 1, { damping: 16, stiffness: 240 });
    });
    onPress(model);
  };

  return (
    <Animated.View style={[styles.cardWrap, cardStyle]}>
      <TouchableOpacity
        style={[
          styles.card,
          isOn && {
            borderColor: info.color,
            backgroundColor: `${info.color}12`,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <Ionicons name={info.icon} size={18} color={isOn ? info.color : colors.textMuted} />
        <Text style={[styles.label, isOn && { color: info.color }]} numberOfLines={1}>
          {info.label}
        </Text>
        <View style={[
          styles.tag,
          isOn && { borderColor: `${info.color}55`, backgroundColor: `${info.color}18` },
        ]}>
          <Text style={[styles.tagText, isOn && { color: info.color }]}>{info.tag}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ModelSelector({ models, selected, onSelect, loading }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>MODEL</Text>
      <View style={styles.grid}>
        {loading
          ? [0, 1, 2].map((i) => <ShimmerBox key={i} style={styles.shimmer} />)
          : models.map((m) => (
              <ModelCard
                key={m}
                model={m}
                isOn={selected === m}
                onPress={onSelect}
              />
            ))
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 0 },
  heading: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  grid:      { flexDirection: "row", gap: 4 },
  cardWrap:  {
    flex: 1,
    borderRadius: radius.md,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    gap: 4,
    overflow: "hidden",
    elevation: 3,
  },
  shimmer:  { flex: 1, height: 72, borderRadius: radius.md },
  label: {
    fontSize: 9,
    fontWeight: "700",
    color: colors.textMuted,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  tag: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 4,
    paddingVertical: 1,
    backgroundColor: "transparent",
  },
  tagText: { fontSize: 7, fontWeight: "700", letterSpacing: 0.5, color: colors.textMuted },
});