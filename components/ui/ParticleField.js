import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// ─── AURORA BLOB ──────────────────────────────────────────────
// Slow-drifting radial gradient blobs that pulse and drift
function AuroraBlob({ config }) {
  const pulse  = useRef(new Animated.Value(0)).current;
  const driftX = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse: scale + opacity breathe
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(pulse, {
          toValue: 1,
          duration: config.pulseDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: config.pulseDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Drift X — slow wander left/right
    Animated.loop(
      Animated.sequence([
        Animated.timing(driftX, {
          toValue: 1,
          duration: config.driftDuration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(driftX, {
          toValue: 0,
          duration: config.driftDuration,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Drift Y — offset phase from X for organic movement
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.driftDuration * 0.4),
        Animated.timing(driftY, {
          toValue: 1,
          duration: config.driftDuration * 1.3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(driftY, {
          toValue: 0,
          duration: config.driftDuration * 1.3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, config.scaleRange],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [config.opacityMin, config.opacityMax, config.opacityMin],
  });

  const translateX = driftX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.driftX],
  });

  const translateY = driftY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, config.driftY],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: config.x - config.size / 2,
        top:  config.y - config.size / 2,
        width:  config.size,
        height: config.size,
        borderRadius: config.size / 2,
        backgroundColor: config.color,
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
        // Soft glow via shadow
        shadowColor:   config.color,
        shadowOpacity: 0.6,
        shadowRadius:  config.size * 0.4,
      }}
    />
  );
}

// ─── GRID LINES ───────────────────────────────────────────────
// Subtle perspective grid that pulses
function GridLines() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const opacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.018, 0.038, 0.018],
  });

  const COLS = 6;
  const ROWS = 10;
  const colW  = width / COLS;
  const rowH  = height / ROWS;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { opacity }]}
      pointerEvents="none"
    >
      {/* Vertical lines */}
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <View
          key={`v${i}`}
          style={{
            position: "absolute",
            left:   i * colW,
            top:    0,
            width:  1,
            height: height,
            backgroundColor: "#7C6FFF",
          }}
        />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: ROWS + 1 }, (_, i) => (
        <View
          key={`h${i}`}
          style={{
            position:  "absolute",
            top:       i * rowH,
            left:      0,
            width:     width,
            height:    1,
            backgroundColor: "#7C6FFF",
          }}
        />
      ))}
    </Animated.View>
  );
}

// ─── CORNER ACCENTS ───────────────────────────────────────────
function CornerAccents() {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.35] });

  const corners = [
    { top: 0,        left: 0,        borderTopWidth: 1,    borderLeftWidth: 1  },
    { top: 0,        right: 0,       borderTopWidth: 1,    borderRightWidth: 1 },
    { bottom: 0,     left: 0,        borderBottomWidth: 1, borderLeftWidth: 1  },
    { bottom: 0,     right: 0,       borderBottomWidth: 1, borderRightWidth: 1 },
  ];

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]} pointerEvents="none">
      {corners.map((style, i) => (
        <View
          key={i}
          style={[
            {
              position:    "absolute",
              width:       32,
              height:      32,
              borderColor: "#F59E0B",
            },
            style,
          ]}
        />
      ))}
    </Animated.View>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────
export default function BackgroundAnimation() {
  // Aurora blobs — big soft glowing orbs
  const auroraBlobs = [
    {
      x: width * 0.15, y: height * 0.08,
      size: 320, color: "#3B1FD4",
      opacityMin: 0.06, opacityMax: 0.18, scaleRange: 1.25,
      driftX: 60,  driftY: 40,
      pulseDuration: 5000, driftDuration: 11000, delay: 0,
    },
    {
      x: width * 0.85, y: height * 0.15,
      size: 280, color: "#F59E0B",
      opacityMin: 0.04, opacityMax: 0.13, scaleRange: 1.3,
      driftX: -50, driftY: 55,
      pulseDuration: 6500, driftDuration: 13000, delay: 1200,
    },
    {
      x: width * 0.5,  y: height * 0.35,
      size: 360, color: "#7C3AED",
      opacityMin: 0.05, opacityMax: 0.14, scaleRange: 1.2,
      driftX: -40, driftY: -30,
      pulseDuration: 7500, driftDuration: 15000, delay: 600,
    },
    {
      x: width * 0.1,  y: height * 0.55,
      size: 220, color: "#0EA5E9",
      opacityMin: 0.04, opacityMax: 0.12, scaleRange: 1.35,
      driftX: 70,  driftY: -40,
      pulseDuration: 5500, driftDuration: 10000, delay: 2000,
    },
    {
      x: width * 0.9,  y: height * 0.65,
      size: 260, color: "#EC4899",
      opacityMin: 0.03, opacityMax: 0.1,  scaleRange: 1.4,
      driftX: -60, driftY: -50,
      pulseDuration: 8000, driftDuration: 14000, delay: 3000,
    },
  ];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Layer 1: Grid — deepest, most subtle */}
      <GridLines />

      {/* Layer 2: Aurora blobs — large atmospheric glows */}
      {auroraBlobs.map((config, i) => (
        <AuroraBlob key={i} config={config} />
      ))}

      {/* Layer 3: Corner accents — foreground frame */}
      <CornerAccents />
    </View>
  );
}