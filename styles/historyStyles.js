import { StyleSheet, Dimensions } from "react-native";
import { colors, spacing, radius, typography } from "./theme";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const H_PAD = spacing.md;
const GAP = 10;
const COL_W = (SCREEN_W - H_PAD * 2 - GAP) / 2;

export const historyStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Header ────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: H_PAD,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    letterSpacing: 4,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    backgroundColor: `${colors.primary}22`,
    borderWidth: 1,
    borderColor: `${colors.primary}55`,
  },
  countBadgeTxt: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 1,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Sort bar ──────────────────────────────────────────────────────────
  sortBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: H_PAD,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  sortPillActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}18`,
  },
  sortPillTxt: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
  sortPillTxtActive: {
    color: colors.primary,
  },

  // ── Grid ──────────────────────────────────────────────────────────────
  grid: {
    flexDirection: "row",
    paddingHorizontal: H_PAD,
    paddingTop: spacing.md,
    gap: GAP,
    alignItems: "flex-start",
  },
  col: {
    flex: 1,
    gap: GAP,
  },

  // ── Card ──────────────────────────────────────────────────────────────
  card: {
    width: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardGrad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 32,
    gap: 5,
  },
  cardPrompt: {
    ...typography.bodySm,
    color: "rgba(255,255,255,0.88)",
    fontStyle: "italic",
    lineHeight: 15,
  },
  cardTagRow: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  cardTag: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 99,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardTagTxt: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.4,
    color: "rgba(255,255,255,0.7)",
  },

  // Card action buttons (top right)
  cardTopRight: {
    position: "absolute",
    top: 7,
    right: 7,
    gap: 5,
    alignItems: "center",
  },
  cardSaveBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: `${colors.primary}CC`,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  cardDeleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,100,100,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Corner accents
  cornerTL: {
    position: "absolute",
    top: 7,
    left: 7,
    width: 12,
    height: 12,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  cornerBR: {
    position: "absolute",
    width: 12,
    height: 12,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
  },

  // ── Skeleton ──────────────────────────────────────────────────────────
  skeletonCard: {
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  skeletonShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: COL_W * 0.7,
  },

  // ── Empty / Error ─────────────────────────────────────────────────────
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 14,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}12`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptySub: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  retryTxt: {
    ...typography.label,
    color: colors.primary,
  },

  // ── Detail Modal ──────────────────────────────────────────────────────
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.90)",
    alignItems: "center",
    justifyContent: "center",
    padding: H_PAD,
  },
  modalCard: {
    width: "100%",
    maxHeight: "92%",
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalClosePill: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  modalBody: {
    padding: spacing.md,
    maxHeight: SCREEN_H * 0.42,
  },
  modalPrompt: {
    ...typography.body,
    color: colors.textPrimary,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },

  // Stat grid
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statBox: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    alignItems: "center",
    gap: 3,
  },
  statLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  statValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  // Modal action row
  modalActionRow: {
    flexDirection: "row",
    gap: 10,
  },

  // Save button (full, in modal)
  modalSaveBtnWrap: {
    flex: 1,
  },
  modalSaveBtn: {
    height: 48,
    borderRadius: radius.md,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: `${colors.primary}80`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  modalSaveBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  modalSaveBtnTxt: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#fff",
  },

  // Delete button (in modal)
  modalDeleteBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#FF6B6B33",
    backgroundColor: "#FF6B6B0A",
  },
  modalDeleteTxt: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FF6B6B",
  },

  // ── Fullscreen viewer styles ──────────────────────────────────────────
  fsBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.97)",
    alignItems: "center",
    justifyContent: "center",
  },
  fsImgWrap: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  fsTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  fsBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  fsBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 44,
    gap: 12,
  },
  fsPrompt: {
    ...typography.body,
    color: "rgba(255,255,255,0.85)",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },
  fsActions: {
    flexDirection: "row",
    gap: 10,
  },
  fsDeleteBtn: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#FF6B6B77",
    backgroundColor: "#FF6B6B33",
  },
  fsDeleteTxt: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FF6B6B",
  },
  fsTapHint: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 2.5,
    color: "rgba(255,255,255,0.18)",
    textAlign: "center",
  },
});

export const getColumnWidth = () => COL_W;
export const getScreenDimensions = () => ({ width: SCREEN_W, height: SCREEN_H });
