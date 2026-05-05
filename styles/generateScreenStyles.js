import { StyleSheet } from "react-native";
import { colors, spacing, typography, screen, radius } from "./theme";

export const generateScreenStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  root: {
    flex: 1,
    paddingTop: 0,
    overflow: "visible",
  },

  scroll: {
    flex: 1,
    overflow: "visible",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screen.paddingH,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // ── Top bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: screen.paddingH,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: "transparent",
    zIndex: 5,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 24,
    height: 24,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  logoText: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 4,
  },
  pill: {
    borderWidth: 1,
    borderColor: `${colors.primary}44`,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: `${colors.primary}12`,
  },
  pillText: {
    ...typography.micro,
    color: colors.primary,
    letterSpacing: 1.5,
  },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
    color: colors.textPrimary,
    lineHeight: 26,
  },
  heroAccent: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
    color: colors.primary,
    lineHeight: 26,
    marginBottom: 4,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  heroSub: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontSize: 10,
  },

  // ── Prompt ─────────────────────────────────────────────────────────────────
  promptWrap: {
    marginBottom: 10,
  },

  // ── Quick Ideas ────────────────────────────────────────────────────────────
  quickWrap: {
    marginBottom: 10,
  },

  // ── Style + Model stack ───────────────────────────────────────────────────
  midRow: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 10,
  },
  midLeft: {
    width: "100%",
  },
  midRight: {
    width: "100%",
  },

  // ── Aspect Ratio ───────────────────────────────────────────────────────────
  aspectWrap: {
    marginBottom: 12,
  },

  // ── Generate button ────────────────────────────────────────────────────────
  btnWrap: {
    marginTop: "auto",
    marginBottom: 12,
    overflow: "visible",
    marginHorizontal: -screen.paddingH,
    paddingHorizontal: screen.paddingH,
  },

  // ── Error ──────────────────────────────────────────────────────────────────
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#1A0808",
    borderWidth: 1,
    borderColor: "#EF444444",
    borderRadius: radius.md,
    padding: 10,
    marginBottom: 10,
    overflow: "visible",
  },
  errorIcon: {
    fontSize: 13,
    color: colors.error,
  },
  errorTitle: {
    ...typography.caption,
    color: colors.error,
    fontWeight: "700",
    marginBottom: 2,
  },
  errorMsg: {
    ...typography.bodySm,
    color: "#EF444488",
  },

  // ── Result overlay ─────────────────────────────────────────────────────────
  resultOverlay: {
    backgroundColor: colors.bg,
    justifyContent: "center",
    zIndex: 10,
  },
});
