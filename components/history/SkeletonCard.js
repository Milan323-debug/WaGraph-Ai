import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing, cancelAnimation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { historyStyles } from "../../styles/historyStyles";

const { width: SCREEN_W } = Dimensions.get("window");
const COL_W = (SCREEN_W - 16 * 2 - 10) / 2; // H_PAD = 16, GAP = 10

export function SkeletonCard({ height }) {
  const shimX   = useSharedValue(-COL_W);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    shimX.value = withRepeat(
      withSequence(
        withTiming(-COL_W, { duration: 0 }),
        withTiming(COL_W * 2, { duration: 900, easing: Easing.out(Easing.quad) }),
        withTiming(COL_W * 2, { duration: 600 })
      ),
      -1, false
    );
    return () => cancelAnimation(shimX);
  }, []);

  const shimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimX.value }],
  }));

  return (
    <View style={[historyStyles.skeletonCard, { height }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}>
        <Animated.View style={[historyStyles.skeletonShimmer, shimStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.06)", "transparent"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
