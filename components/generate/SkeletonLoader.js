import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat,
  withSequence, withTiming, cancelAnimation, Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import CornerAccent from "./CornerAccent";
import { colors } from "../../styles/theme";

const { width: SCREEN_W } = Dimensions.get("window");

/**
 * Image frame skeleton loader - shimmer animation during image load
 */
export default function SkeletonLoader({ height }) {
  const shimX = useSharedValue(-SCREEN_W);

  useEffect(() => {
    shimX.value = withRepeat(
      withSequence(
        withTiming(-SCREEN_W, { duration: 0 }),
        withTiming(SCREEN_W * 2, { duration: 1100, easing: Easing.out(Easing.quad) }),
        withTiming(SCREEN_W * 2, { duration: 600 })
      ),
      -1,
      false
    );
    return () => cancelAnimation(shimX);
  }, []);

  const shimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimX.value }],
  }));

  return (
    <View style={[styles.skeletonFrame, { height }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}>
        <Animated.View style={[styles.skeletonShimmer, shimStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.12)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>
      {/* Corner accents during load */}
      {["TL", "TR", "BL", "BR"].map((p) => (
        <CornerAccent key={p} position={p} color={`${colors.primary}30`} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonFrame: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 4,
  },
  skeletonShimmer: {
    height: "100%",
  },
});
