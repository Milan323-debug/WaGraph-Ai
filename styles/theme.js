import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// ─── NEON INDIGO PALETTE ──────────────────────────────────────
export const colors = {
  // Backgrounds
  bg:          "#0B0F1A",
  bgCard:      "#111827",
  bgElevated:  "#161D2E",
  bgInput:     "#0D1120",
  bgSurface:   "#1A2035",

  // Primary / Accent
  primary:     "#6366F1",
  primaryDim:  "#4F52C4",
  primaryGlow: "rgba(99,102,241,0.35)",
  accent:      "#8B5CF6",
  accentGlow:  "rgba(139,92,246,0.3)",

  // Gradient stops (use as array)
  gradientPrimary: ["#6366F1", "#8B5CF6"],
  gradientSubtle:  ["#6366F120", "#8B5CF610"],

  // Text
  textPrimary:   "#E5E7EB",
  textSecondary: "#9CA3AF",
  textMuted:     "#6B7280",
  textDim:       "#374151",

  // Borders (translucent)
  border:        "rgba(255,255,255,0.08)",
  borderFocus:   "rgba(99,102,241,0.5)",
  borderActive:  "#6366F1",

  // States
  error:   "#EF4444",
  success: "#22C55E",

  // Overlays
  overlay:      "rgba(0,0,0,0.8)",
  overlayLight: "rgba(11,15,26,0.7)",

  // Glass
  glass:        "rgba(17,24,39,0.75)",
  glassBorder:  "rgba(255,255,255,0.06)",
};

// ─── SPACING ──────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ─── TYPOGRAPHY ───────────────────────────────────────────────
export const typography = {
  display: { fontSize: 52, fontWeight: "900", letterSpacing: 4,   lineHeight: 58 },
  h1:      { fontSize: 30, fontWeight: "800", letterSpacing: 1,   lineHeight: 36 },
  h2:      { fontSize: 22, fontWeight: "700", letterSpacing: 0.3, lineHeight: 28 },
  h3:      { fontSize: 16, fontWeight: "700", letterSpacing: 0.2, lineHeight: 22 },
  body:    { fontSize: 15, fontWeight: "400", lineHeight: 24 },
  bodyMd:  { fontSize: 13, fontWeight: "400", lineHeight: 20 },
  bodySm:  { fontSize: 12, fontWeight: "400", lineHeight: 18 },
  label:   { fontSize: 9,  fontWeight: "800", letterSpacing: 3   },
  caption: { fontSize: 11, fontWeight: "500", letterSpacing: 0.4 },
  micro:   { fontSize: 8,  fontWeight: "900", letterSpacing: 2   },
};

// ─── RADIUS ───────────────────────────────────────────────────
export const radius = {
  sm:   6,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  full: 999,
};

// ─── SHADOWS / GLOWS ──────────────────────────────────────────
export const shadows = {
  primary: {
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 18,
  },
  accent: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 14,
  },
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  subtle: {
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// ─── SCREEN ───────────────────────────────────────────────────
export const screen = {
  width,
  height,
  paddingH: 20,
  contentWidth: width - 40,
};

// ─── ANIMATION CONSTANTS ──────────────────────────────────────
export const motion = {
  fast:   200,
  normal: 280,
  slow:   380,
  spring: { damping: 18, stiffness: 220 },
  springBouncy: { damping: 14, stiffness: 180 },
};