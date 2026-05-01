import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withRepeat,
  withSequence, interpolate, Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import DotsLoader from "../ui/DotsLoader";
import { MODEL_INFO } from "../../utils/api";
import { colors, spacing, radius, typography } from "../../styles/theme";

export default function GenerateButton({ onPress, loading, disabled, model, steps, elapsed }) {
  const scale    = useSharedValue(1);
  const glowSize = useSharedValue(0);
  const spinVal  = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      glowSize.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 700 }),
          withTiming(0.3, { duration: 700 })
        ),
        -1, true
      );
      spinVal.value = withRepeat(withTiming(1, { duration: 1800 }), -1, false);
    } else {
      glowSize.value = withTiming(0, { duration: 300 });
      spinVal.value  = withTiming(0, { duration: 200 });
    }
  }, [loading]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowSize.value, [0, 1], [0.2, 0.6], Extrapolation.CLAMP),
    shadowRadius:  interpolate(glowSize.value, [0, 1], [12, 32],  Extrapolation.CLAMP),
  }));

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinVal.value * 360}deg` }],
  }));

  const onPressIn  = () => { scale.value = withSpring(0.965, { damping: 14, stiffness: 300 }); };
  const onPressOut = () => { scale.value = withSpring(1,     { damping: 14, stiffness: 280 }); };

  const icon = MODEL_INFO[model]?.icon || "sparkles";

  return (
    <Animated.View style={[styles.wrapper, containerStyle]}>
      <Animated.View
        style={[
          styles.glowWrap,
          { shadowColor: colors.primary },
          glowStyle,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={loading || disabled}
          activeOpacity={1}
          style={styles.touch}
        >
          <LinearGradient
            colors={loading
              ? [colors.bgCard, colors.bgCard]
              : (disabled ? ["#2D2F6B", "#3B2F6B"] : [colors.primary, colors.accent])
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradient,
              loading && styles.gradientLoading,
              disabled && !loading && styles.gradientDisabled,
            ]}
          >
            {loading ? (
              <View style={styles.inner}>
                <Animated.Text style={[styles.spinIcon, spinStyle]}>✦</Animated.Text>
                <DotsLoader color={colors.primary} size={7} />
                <Text style={[styles.text, { color: colors.primary }]}>{elapsed}s</Text>
              </View>
            ) : (
              <View style={styles.inner}>
                <Ionicons name={icon} size={16} color="#fff" />
                <Text style={[styles.text, disabled && { opacity: 0.5 }]}>GENERATE IMAGE</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{steps}ST</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // No marginBottom — the screen's btnWrap with marginTop:"auto" handles spacing
  wrapper:  {},
  glowWrap: {
    borderRadius: radius.lg,
    shadowOffset: { width: 0, height: 8 },
    elevation: 18,
  },
  touch:    { borderRadius: radius.lg, overflow: "hidden" },
  gradient: {
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  gradientLoading:  { borderWidth: 1, borderColor: `${colors.primary}44` },
  gradientDisabled: { opacity: 0.55 },
  inner:    { flexDirection: "row", alignItems: "center", gap: spacing.sm + 2 },
  spinIcon: { fontSize: 16, color: colors.primary },
  text:     { ...typography.label, fontSize: 12, letterSpacing: 4, color: "#fff" },
  badge:    {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { ...typography.micro, color: "rgba(255,255,255,0.8)" },
});