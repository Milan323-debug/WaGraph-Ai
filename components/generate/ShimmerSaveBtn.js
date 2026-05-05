import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat,
  withSequence, withTiming, withSpring, cancelAnimation, Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DotsLoader from "../ui/DotsLoader";
import { colors, radius } from "../../styles/theme";
import { downloadAndSave } from "../../utils/cloudinary";

/**
 * Shimmer save button - animated save action with visual feedback
 */
export default function ShimmerSaveBtn({ url, style: extStyle }) {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const shimX = useSharedValue(-120);
  const scale = useSharedValue(1);
  const checkOpa = useSharedValue(0);

  useEffect(() => {
    shimX.value = withRepeat(
      withSequence(
        withTiming(-120, { duration: 0 }),
        withTiming(240, { duration: 1000, easing: Easing.out(Easing.quad) }),
        withTiming(240, { duration: 1800 })
      ),
      -1,
      false
    );
    return () => cancelAnimation(shimX);
  }, []);

  const shimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimX.value }, { skewX: "-20deg" }],
  }));
  
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const checkStyle = useAnimatedStyle(() => ({ opacity: checkOpa.value }));

  const handleSave = async () => {
    if (saving || done) return;
    scale.value = withSpring(0.92, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    await downloadAndSave(url, () => setSaving(true), () => {
      setSaving(false);
      setDone(true);
      checkOpa.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 300 })
      );
      setTimeout(() => setDone(false), 2200);
    });
  };

  return (
    <Animated.View style={[styles.shimSaveBtnWrap, extStyle, scaleStyle]}>
      <TouchableOpacity
        style={styles.shimSaveBtn}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={1}
      >
        {/* Gradient fill */}
        <LinearGradient
          colors={[colors.primary, colors.accent, `${colors.primary}CC`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Shimmer sweep */}
        <Animated.View style={[styles.shimStreak, shimStyle]}>
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.35)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        {/* Top edge highlight */}
        <View style={styles.shimTopEdge} />

        {/* Label */}
        {saving ? (
          <DotsLoader color="#fff" size={5} />
        ) : done ? (
          <Animated.View style={[styles.shimLabelRow, checkStyle]}>
            <Ionicons name="checkmark-circle" size={16} color="#fff" />
            <Text style={styles.shimLabelTxt}>SAVED!</Text>
          </Animated.View>
        ) : (
          <View style={styles.shimLabelRow}>
            <Ionicons name="download" size={15} color="#fff" />
            <Text style={styles.shimLabelTxt}>SAVE IMAGE</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shimSaveBtnWrap: {},
  shimSaveBtn: {
    height: 48,
    borderRadius: radius.md,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}80`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 10,
  },
  shimStreak: {
    position: "absolute",
    top: -4,
    bottom: -4,
    width: 60,
  },
  shimTopEdge: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: 1,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  shimLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  shimLabelTxt: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#fff",
  },
});
