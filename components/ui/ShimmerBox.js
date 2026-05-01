import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { screen, colors } from "../../styles/theme";

export default function ShimmerBox({ style }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, { toValue: 1, duration: 1600, useNativeDriver: true })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange:  [0, 1],
    outputRange: [-screen.width, screen.width],
  });

  return (
    <View style={[styles.base, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }, styles.sheen]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base:  { backgroundColor: colors.bgCard, overflow: "hidden" },
  sheen: {
    backgroundColor: "transparent",
    borderRightWidth: 120,
    borderRightColor: "rgba(99,102,241,0.07)",
  },
});