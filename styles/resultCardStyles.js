import { StyleSheet, Dimensions } from "react-native";
import { colors, spacing, radius, typography } from "./theme";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const H_PAD = 20;
const FRAME_W = SCREEN_W;

export const resultCardStyles = StyleSheet.create({
  // ── Result label ──────────────────────────────────────────────────────────
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  resultDotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  resultLabel: {
    ...typography.label,
    color: colors.textMuted,
    letterSpacing: 3,
  },
  resultRule: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  fsHintBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  fsHintTxt: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: colors.textMuted,
  },

  // ── Frame ─────────────────────────────────────────────────────────────────
  frameWrap: {
    alignSelf: "center",
    marginLeft: -H_PAD,
    marginRight: -H_PAD,
    width: SCREEN_W,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.42,
    shadowRadius: 28,
    elevation: 16,
  },
  frame: {
    width: SCREEN_W,
    overflow: "hidden",
    position: "relative",
  },

  // Subtle CRT scanline texture
  scanLines: {
    ...StyleSheet.absoluteFillObject,
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
    opacity: 0.4,
  },

  // ── Portrait save row (below frame) ───────────────────────────────────────
  portraitSaveRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: spacing.md,
    alignItems: "stretch",
  },

  // ── Tap hint ──────────────────────────────────────────────────────────────
  tapHintWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 7,
  },
  tapHint: {
    fontSize: 7.5,
    fontWeight: "800",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.2)",
  },

  // ── Tip card ─────────────────────────────────────────────────────────────
  tipCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
    borderRadius: radius.md,
    padding: 13,
    gap: 12,
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  tipAccentBar: {
    width: 2.5,
    borderRadius: 2,
    alignSelf: "stretch",
    opacity: 0.8,
  },
  tipTitle: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 2.5,
    color: colors.primary,
    marginBottom: 4,
  },
  tipBody: {
    ...typography.bodySm,
    color: colors.textMuted,
    lineHeight: 17,
  },
  tipHighlight: {
    color: colors.primary,
    fontWeight: "700",
  },
});

export const getImageHeight = (aspectRatio, zoomed, screenH = SCREEN_H) => {
  const MAX_PORTRAIT_H = screenH * 0.56;
  const MAX_LANDSCAPE_H = screenH * 0.44;

  const naturalH = FRAME_W / aspectRatio.ratio;
  if (zoomed) return naturalH;
  const cap = aspectRatio.ratio < 1 ? MAX_PORTRAIT_H : MAX_LANDSCAPE_H;
  return Math.min(naturalH, cap);
};
