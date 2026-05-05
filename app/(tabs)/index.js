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
import { generateScreenStyles } from "../../styles/generateScreenStyles";

// Match your tab bar height exactly
const TAB_BAR_HEIGHT = 64;

export default function GenerateScreen() {
  const insets = useSafeAreaInsets();
  const styles = generateScreenStyles; // Alias for convenience
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