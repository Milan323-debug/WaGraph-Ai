import { Tabs } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  View, TouchableOpacity, StyleSheet,
  Dimensions, Keyboard, Platform,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withTiming, withSequence,
  interpolate, Extrapolation, cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, typography, motion } from "../../styles/theme";
import { useStore } from "../../hooks/useStore";

// ── Blur / glass fallback ────────────────────────────────────────────────────
let BlurView;
if (Platform.OS === "ios") {
  BlurView = require("expo-blur").BlurView;
} else {
  BlurView = ({ style, children }) => (
    <LinearGradient
      colors={["rgba(17,24,39,0.88)", "rgba(17,24,39,0.65)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

// ── Constants ────────────────────────────────────────────────────────────────
const { width } = Dimensions.get("window");

const TABS = [
  { name: "index",    label: "Generate", icon: "sparkles" },
  { name: "history",  label: "Gallery",  icon: "images"   },
  { name: "settings", label: "Settings", icon: "settings" },
];

const TAB_BAR_H   = 64;
const H_MARGIN    = 50;
const TAB_BAR_W   = width - H_MARGIN * 2;
const TAB_W       = TAB_BAR_W / TABS.length;
const PILL_W      = TAB_W - 16;
const PILL_OFFSET = 8;

// ── Shimmer streak — driven by parent-owned shimmerX shared value ─────────────
function PillShimmer({ shimmerX }) {
  // skewX inside the animated transform works on both iOS & Android.
  // No intermediate overflow:hidden wrapper — the pill already clips us,
  // and removing it lets the angled top/bottom edges stay fully visible.
  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shimmerX.value },
      { skewX: "-22deg" },
    ],
  }));

  return (
    <Animated.View style={[styles.shimmerStreak, shimmerStyle]}>
      <LinearGradient
        colors={[
          "transparent",
          "rgba(255,255,255,0.0)",
          "rgba(255,255,255,0.30)",
          "rgba(255,255,255,0.65)",
          "rgba(255,255,255,0.30)",
          "rgba(255,255,255,0.0)",
          "transparent",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

// ── Glow ring — driven by parent-owned glowAnim shared value ─────────────────
function PillGlowRing({ glowAnim }) {
  const ringStyle = useAnimatedStyle(() => ({
    opacity:   interpolate(glowAnim.value, [0, 1], [0, 0.9]),
    transform: [
      { scaleX: interpolate(glowAnim.value, [0, 1], [1, 1.07]) },
      { scaleY: interpolate(glowAnim.value, [0, 1], [1, 1.07]) },
    ],
  }));

  return <Animated.View style={[styles.pillGlowRing, ringStyle]} />;
}

// ── Border shimmer — driven by parent-owned borderAnim shared value ───────────
function BorderShimmer({ borderAnim }) {
  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: borderAnim.value,
  }));

  return (
    <Animated.View style={[styles.borderShimmerWrap, shimmerStyle]}>
      <LinearGradient
        colors={["transparent", colors.primary, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

// ── Animated pill ────────────────────────────────────────────────────────────
function AnimatedPill({ pillX, shimmerX, glowAnim }) {
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
  }));

  return (
    <Animated.View style={[styles.pill, pillStyle]}>
      {/* Inner glass gradient */}
      <LinearGradient
        colors={[`${colors.primary}22`, `${colors.primary}10`, `${colors.primary}1A`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius.xl }]}
      />
      {/* Top-edge catchlight */}
      <View style={styles.pillTopEdge} />
      {/* Glow ring — off until tab press */}
      <PillGlowRing glowAnim={glowAnim} />
      {/* Shimmer streak — off until tab press */}
      <PillShimmer shimmerX={shimmerX} />
    </Animated.View>
  );
}

// ── Single tab item ──────────────────────────────────────────────────────────
function TabItem({ tab, isFocused, navigation }) {
  const { hapticEnabled } = useStore();
  const scaleAnim = useSharedValue(1);
  const labelAnim = useSharedValue(isFocused ? 1 : 0);
  const iconGlow  = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    labelAnim.value = withTiming(isFocused ? 1 : 0, { duration: motion.fast });
    iconGlow.value  = withTiming(isFocused ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFocused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const iconGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(iconGlow.value, [0, 1], [0, 0.45]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: labelAnim.value,
    transform: [
      {
        translateY: interpolate(
          labelAnim.value, [0, 1], [4, 0], Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const handlePress = () => {
    if (hapticEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scaleAnim.value = withSpring(1.2, { damping: 8, stiffness: 320 }, () => {
      scaleAnim.value = withSpring(1, { damping: 14, stiffness: 250 });
    });
    if (!isFocused) navigation.navigate(tab.name);
  };

  return (
    <TouchableOpacity style={styles.tab} onPress={handlePress} activeOpacity={1}>
      <View style={styles.iconWrap}>
        {/* Opacity-only glow bloom — no object props in useAnimatedStyle */}
        <Animated.View style={[styles.iconGlowBloom, iconGlowStyle]} />
        <Animated.View style={iconStyle}>
          <Ionicons
            name={tab.icon}
            size={24}
            color={isFocused ? colors.primary : colors.textMuted}
            style={{ opacity: isFocused ? 1 : 0.55 }}
          />
        </Animated.View>
      </View>
      <Animated.Text
        style={[
          styles.label,
          isFocused ? styles.labelActive : styles.labelInactive,
          labelStyle,
        ]}
      >
        {tab.label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

// ── Custom tab bar ────────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation }) {
  const insets          = useSafeAreaInsets();
  const pillX           = useSharedValue(state.index * TAB_W + PILL_OFFSET);
  const tabBarY         = useSharedValue(0);
  const keyboardVisible = useRef(false);

  // ── Shared values owned here, passed down — no loops, one-shot only ────────
  const shimmerX   = useSharedValue(-PILL_W);   // starts hidden (left of pill)
  const glowAnim   = useSharedValue(0);          // 0 = off
  const borderAnim = useSharedValue(0);          // 0 = off

  // ── Fire all shine effects once every time the active tab changes ──────────
  useEffect(() => {
    // 1. Slide pill
    pillX.value = withSpring(
      state.index * TAB_W + PILL_OFFSET,
      { damping: 22, stiffness: 280, mass: 0.75 }
    );

    // 2. Shimmer: reset to left edge → sweep across → park off-screen right
    cancelAnimation(shimmerX);
    shimmerX.value = -PILL_W;                    // snap back instantly
    shimmerX.value = withTiming(PILL_W * 1.5, {
      duration: 920,
      easing: Easing.out(Easing.quad),
    });

    // 3. Glow ring: flash up then decay to off
    cancelAnimation(glowAnim);
    glowAnim.value = withSequence(
      withTiming(1,   { duration: 160, easing: Easing.out(Easing.quad) }),
      withTiming(0,   { duration: 920 , easing: Easing.in(Easing.quad)  })
    );

    // 4. Border shimmer: flash then fade
    cancelAnimation(borderAnim);
    borderAnim.value = withSequence(
      withTiming(0.85, { duration: 140, easing: Easing.out(Easing.quad) }),
      withTiming(0,    { duration: 920, easing: Easing.in(Easing.quad)  })
    );
  }, [state.index]);

  // ── Keyboard hide/show ────────────────────────────────────────────────────
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        if (!keyboardVisible.current) {
          keyboardVisible.current = true;
          tabBarY.value = withTiming(TAB_BAR_H + insets.bottom + 20, { duration: 220 });
        }
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        if (keyboardVisible.current) {
          keyboardVisible.current = false;
          tabBarY.value = withSpring(0, { damping: 18, stiffness: 200 });
        }
      }
    );
    return () => { showSub.remove(); hideSub.remove(); };
  }, [insets.bottom]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarY.value }],
  }));

  return (
    <Animated.View
      style={[styles.outerWrap, { paddingBottom: insets.bottom + 12 }, containerStyle]}
    >
      <View style={styles.blurContainer}>
        <BlurView intensity={90} style={StyleSheet.absoluteFill} />

        {/* Border shimmer — fires once on tab press */}
        <BorderShimmer borderAnim={borderAnim} />

        <View style={styles.bar}>
          <AnimatedPill pillX={pillX} shimmerX={shimmerX} glowAnim={glowAnim} />

          {TABS.map((tab, index) => (
            <TabItem
              key={tab.name}
              tab={tab}
              isFocused={state.index === index}
              navigation={navigation}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

// ── Root layout ───────────────────────────────────────────────────────────────
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: "Generate" }} />
      <Tabs.Screen name="history"  options={{ title: "Gallery"  }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outerWrap: {
    position: "absolute",
    bottom: 0,
    left: H_MARGIN,
    right: H_MARGIN,
    alignItems: "center",
  },
  blurContainer: {
    width: TAB_BAR_W,
    borderRadius: radius.xxl,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.45,
    shadowRadius: 36,
    elevation: 24,
  },
  bar: {
    width: TAB_BAR_W,
    height: TAB_BAR_H,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17,24,39,0.22)",
  },

  // ── Pill ───────────────────────────────────────────────────────────────────
  pill: {
    position: "absolute",
    top: 10,
    left: 0,
    width: PILL_W,
    height: TAB_BAR_H - 20,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: `${colors.primary}1C`,
    borderWidth: 1.4,
    borderColor: `${colors.primary}60`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 12,
  },
  pillTopEdge: {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: 1.5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  pillGlowRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: radius.xl + 4,
    borderWidth: 1.5,
    borderColor: `${colors.primary}80`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
  },
  shimmerStreak: {
    position: "absolute",
    top: -10,        // extend beyond pill top so skewed edge isn't cut awkwardly
    bottom: -10,     // extend beyond pill bottom
    width: PILL_W * 0.45,
  },

  // ── Border shimmer ─────────────────────────────────────────────────────────
  borderShimmerWrap: {
    position: "absolute",
    top: 0,
    left: "10%",
    right: "10%",
    height: 1.5,
    borderRadius: 999,
    overflow: "hidden",
  },

  // ── Tab items ──────────────────────────────────────────────────────────────
  tab: {
    width: TAB_W,
    height: TAB_BAR_H,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlowBloom: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    shadowOpacity: 0.9,
  },
  label:         { ...typography.micro, letterSpacing: 1 },
  labelActive:   { color: colors.primary },
  labelInactive: { color: colors.textMuted },
});