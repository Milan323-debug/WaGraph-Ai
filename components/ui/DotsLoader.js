import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { colors } from "../../styles/theme";

export default function DotsLoader({ color = colors.textPrimary, size = 7 }) {
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 360, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 360, useNativeDriver: true }),
        ])
      );
    const a1 = pulse(d1, 0);
    const a2 = pulse(d2, 160);
    const a3 = pulse(d3, 320);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const dotStyle = (anim) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }],
  });

  return (
    <View style={styles.row}>
      {[d1, d2, d3].map((d, i) => (
        <Animated.View
          key={i}
          style={[
            { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
            dotStyle(d),
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 5 },
});