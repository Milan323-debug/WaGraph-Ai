import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ParticleField       from "../../components/ui/ParticleField";
import ModelSelector       from "../../components/generate/ModelSelector";
import AspectRatioSelector from "../../components/generate/AspectRatioSelector";
import StylePresets        from "../../components/generate/StylePresets";
import PromptInput         from "../../components/generate/PromptInput";
import SuggestionPicker    from "../../components/generate/SuggestionPicker";
import GenerateButton      from "../../components/generate/GenerateButton";
import ResultCard          from "../../components/generate/ResultCard";

import { useGenerate } from "../../hooks/useGenerate";
import { useStore }    from "../../hooks/useStore";
import { fetchModels, ASPECT_RATIOS, STYLE_PRESETS, DEFAULT_SETTINGS } from "../../utils/api";
import { setState }    from "../../store/appStore";
import { colors, spacing, typography, screen, radius } from "../../styles/theme";

// Match your tab bar height exactly
const TAB_BAR_HEIGHT = 64;

export default function GenerateScreen() {
  const insets = useSafeAreaInsets();
  const { models } = useStore();
  const { loading, imageUri, elapsed, error, generate, reset } = useGenerate();

  const [prompt, setPrompt]           = useState("");
  const [negPrompt, setNegPrompt]     = useState("blurry, low quality, deformed, watermark, text, extra limbs");
  const [showNeg, setShowNeg]         = useState(false);
  const [selectedModel, setModel]     = useState("sdxl-base");
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [stylePreset, setStylePreset] = useState(STYLE_PRESETS[0]);
  const [settings]                    = useState(DEFAULT_SETTINGS);
  const [loadingModels, setLM]        = useState(true);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 11, useNativeDriver: true }),
    ]).start();

    if (models.length === 0) {
      fetchModels()
        .then((m) => { setState({ models: m }); setLM(false); })
        .catch(() => setLM(false));
    } else {
      setLM(false);
    }
  }, []);

  const handleGenerate = () =>
    generate({ prompt, model: selectedModel, negPrompt, settings, aspectRatio, stylePreset });
  const handleNew = () => { reset(); setPrompt(""); };

  // Total bottom clearance: tab bar + its safe area + a small gap
  const bottomClearance = TAB_BAR_HEIGHT + insets.bottom + 16;

  return (
    <View style={styles.safe}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <ParticleField count={12} />
      </View>

      {/* ── Top bar (fixed) ── */}
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={styles.topLeft}>
          <Image source={require("../../assets/icon.png")} style={styles.logo} />
          <Text style={styles.logoText}>WAGRAPH</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{settings.steps}ST · {settings.guidance}CFG</Text>
        </View>
      </View>

      <Animated.View
        style={[
          styles.root,
          {
            paddingBottom: bottomClearance,            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={{ top: 0, bottom: 0, left: 10, right: 10 }}
        >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>DREAM IT</Text>
          <Text style={styles.heroAccent}>INTO BEING</Text>
          <Text style={styles.heroSub}>
            Workers AI · {models.length > 0 ? models.length : "—"} models · {aspectRatio.desc}
          </Text>
        </View>

        {/* ── Prompt — fixed short height ── */}
        <View style={styles.promptWrap}>
          <PromptInput
            prompt={prompt}       onChangePrompt={setPrompt}
            negPrompt={negPrompt} onChangeNeg={setNegPrompt}
            showNeg={showNeg}     onToggleNeg={() => setShowNeg((v) => !v)}
            disabled={loading}    stylePreset={stylePreset}
            compact
          />
        </View>

        {/* ── Quick Ideas ── */}
        <View style={styles.quickWrap}>
          <SuggestionPicker onSelect={setPrompt} />
        </View>

        {/* ── Style Preset + Model — side by side ── */}
        <View style={styles.midRow}>
          <View style={styles.midLeft}>
            <StylePresets selected={stylePreset} onSelect={setStylePreset} />
          </View>
          <View style={styles.midRight}>
            <ModelSelector
              models={models}
              selected={selectedModel}
              onSelect={setModel}
              loading={loadingModels}
            />
          </View>
        </View>

        {/* ── Aspect Ratio ── */}
        <View style={styles.aspectWrap}>
          <AspectRatioSelector
            selected={aspectRatio}
            onSelect={(a) => { setAspectRatio(a); reset(); }}
          />
        </View>

        {/* ── Error ── */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.errorTitle}>Generation Failed</Text>
              <Text style={styles.errorMsg}>{error}</Text>
            </View>
          </View>
        )}

        {/* ── Generate — pinned to bottom ── */}
        <View style={styles.btnWrap}>
          <GenerateButton
            onPress={handleGenerate}
            loading={loading}
            disabled={!prompt.trim() || loadingModels}
            model={selectedModel}
            steps={settings.steps}
            elapsed={elapsed}
          />
        </View>
      </ScrollView>
      </Animated.View>

      {/* ── Result overlay ── */}
      {imageUri && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.resultOverlay,
            { paddingTop: insets.top, paddingBottom: bottomClearance },
          ]}
        >
          <ResultCard
            imageUri={imageUri}
            prompt={prompt}
            model={selectedModel}
            elapsed={elapsed}
            aspectRatio={aspectRatio}
            onRegen={handleGenerate}
            onNew={handleNew}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

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

  // ── Top bar ──────────────────────────────────────────────────────────────
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
  topLeft:  { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 24, height: 24 },
  dot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 6,
  },
  logoText: { ...typography.label, fontSize: 11, color: colors.textSecondary, letterSpacing: 4 },
  pill: {
    borderWidth: 1, borderColor: `${colors.primary}44`,
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: `${colors.primary}12`,
  },
  pillText: { ...typography.micro, color: colors.primary, letterSpacing: 1.5 },

  // ── Hero ─────────────────────────────────────────────────────────────────
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
  heroSub: { ...typography.caption, color: colors.textMuted, letterSpacing: 0.8, fontSize: 10 },

  // ── Prompt ───────────────────────────────────────────────────────────────
  promptWrap: {
    marginBottom: 10,
  },

  // ── Quick Ideas ───────────────────────────────────────────────────────────
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

  // ── Aspect Ratio ─────────────────────────────────────────────────────────
  aspectWrap: {
    marginBottom: 12,
  },

  // ── Generate button ───────────────────────────────────────────────────────
  btnWrap: {
    marginTop: "auto",
    marginBottom: 12,
    overflow: "visible",
    marginHorizontal: -screen.paddingH,
    paddingHorizontal: screen.paddingH,
  },

  // ── Error ─────────────────────────────────────────────────────────────────
  errorCard: {
    flexDirection: "row", alignItems: "flex-start", gap: 8,
    backgroundColor: "#1A0808", borderWidth: 1, borderColor: "#EF444444",
    borderRadius: radius.md, padding: 10, marginBottom: 10,
    overflow: "visible",
  },
  errorIcon:  { fontSize: 13, color: colors.error },
  errorTitle: { ...typography.caption, color: colors.error, fontWeight: "700", marginBottom: 2 },
  errorMsg:   { ...typography.bodySm, color: "#EF444488" },

  // ── Result overlay ────────────────────────────────────────────────────────
  resultOverlay: {
    backgroundColor: colors.bg,
    justifyContent: "center",
    zIndex: 10,
  },
});