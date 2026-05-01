import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore }  from "../../hooks/useStore";
import { setState }  from "../../store/appStore";
import { DEFAULT_SETTINGS, MODEL_INFO, ASPECT_RATIOS } from "../../utils/api";
import { colors, spacing, radius, typography, screen, motion } from "../../styles/theme";

// ─── ANIMATED TOGGLE ──────────────────────────────────────────
function AnimatedToggle({ value, onChange }) {
  const progress = useSharedValue(value ? 1 : 0);

  const handlePress = () => {
    const next = !value;
    progress.value = withSpring(next ? 1 : 0, { damping: 16, stiffness: 280 });
    onChange(next);
  };

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(99,102,241,${interpolate(progress.value, [0, 1], [0, 0.35], Extrapolation.CLAMP)})`,
    borderColor: `rgba(99,102,241,${interpolate(progress.value, [0, 1], [0.2, 0.8], Extrapolation.CLAMP)})`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [2, 22], Extrapolation.CLAMP) }],
    backgroundColor: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP) > 0.5
      ? colors.primary
      : colors.textMuted,
  }));

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View style={[tog.track, trackStyle]}>
        <Animated.View style={[tog.thumb, thumbStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const tog = StyleSheet.create({
  track: {
    width: 48, height: 28, borderRadius: 14, borderWidth: 1,
    justifyContent: "center",
  },
  thumb: { width: 22, height: 22, borderRadius: 11 },
});

// ─── TICK ROW ─────────────────────────────────────────────────
function TickRow({ options, value, onChange, recommended }) {
  return (
    <View style={tr.track}>
      {options.map((v) => {
        const isOn = value === v;
        return (
          <TouchableOpacity
            key={v}
            style={[tr.tick, isOn && tr.tickOn]}
            onPress={() => onChange(v)}
            activeOpacity={0.75}
          >
            <Text style={[tr.text, isOn && tr.textOn]}>{v}</Text>
            {v === recommended && <Text style={tr.rec}>REC</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tr = StyleSheet.create({
  track:  { flexDirection: "row", gap: 5, marginBottom: spacing.lg },
  tick:   { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard },
  tickOn: { borderColor: colors.primary, backgroundColor: `${colors.primary}14` },
  text:   { fontSize: 10, color: colors.textMuted, fontWeight: "600" },
  textOn: { color: colors.primary },
  rec:    { fontSize: 6, fontWeight: "900", color: colors.primaryDim, letterSpacing: 1, marginTop: 2 },
});

// ─── SECTION ──────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <View style={sec.container}>
      <Text style={sec.title}>{title}</Text>
      <View style={sec.card}>{children}</View>
    </View>
  );
}
const sec = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  title:     { ...typography.label, color: colors.textMuted, marginBottom: spacing.sm },
  card:      { backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md },
});

// ─── SETTING ROW ──────────────────────────────────────────────
function SettingRow({ label, desc, right }) {
  return (
    <View style={sr.row}>
      <View style={{ flex: 1, marginRight: spacing.md }}>
        <Text style={sr.label}>{label}</Text>
        {desc && <Text style={sr.desc}>{desc}</Text>}
      </View>
      {right}
    </View>
  );
}
const sr = StyleSheet.create({
  row:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  label: { ...typography.caption, color: colors.textSecondary, fontWeight: "700" },
  desc:  { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
});

// ─── MAIN SCREEN ──────────────────────────────────────────────
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { history, hapticEnabled } = useStore();

  const [steps,       setSteps]       = useState(DEFAULT_SETTINGS.steps);
  const [guidance,    setGuidance]    = useState(DEFAULT_SETTINGS.guidance);
  const [seed,        setSeed]        = useState(DEFAULT_SETTINGS.seed);
  const [qualityMode, setQualityMode] = useState(false);
  const [autoNeg,     setAutoNeg]     = useState(true);
  const [haptic,      setHaptic]      = useState(hapticEnabled);

  const handleReset = () => {
    Alert.alert("Reset Settings", "Restore all defaults?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset", onPress: () => {
          setSteps(DEFAULT_SETTINGS.steps);
          setGuidance(DEFAULT_SETTINGS.guidance);
          setSeed("");
          setQualityMode(false);
          setAutoNeg(true);
          setHaptic(false);
          setState({ hapticEnabled: false });
        },
      },
    ]);
  };

  const handleHapticChange = (val) => {
    setHaptic(val);
    setState({ hapticEnabled: val });
  };

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: spacing.xxl + insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <LinearGradient
          colors={[`${colors.primary}18`, `${colors.accent}08`]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerDot} />
          <Text style={styles.bannerText}>
            Higher steps + guidance = sharper images.{"\n"}Generation time increases accordingly.
          </Text>
        </LinearGradient>

        {/* Generation quality */}
        <Section title="GENERATION">
          <SettingRow
            label="INFERENCE STEPS"
            desc="More steps = better quality, slower"
            right={<Text style={styles.bigVal}>{steps}</Text>}
          />
          <TickRow
            options={[15, 20, 25, 30, 35, 40, 50]}
            value={steps}
            onChange={setSteps}
            recommended={20}
          />

          <SettingRow
            label="GUIDANCE SCALE (CFG)"
            desc="Higher = follows prompt more strictly"
            right={<Text style={styles.bigVal}>{guidance.toFixed(1)}</Text>}
          />
          <TickRow
            options={[5, 6.5, 7.5, 8.5, 10, 12, 15]}
            value={guidance}
            onChange={setGuidance}
            recommended={8.5}
          />

          <View style={styles.divider} />

          <SettingRow
            label="QUALITY TOKENS"
            desc="Append quality keywords to every prompt"
            right={<AnimatedToggle value={qualityMode} onChange={setQualityMode} />}
          />

          <View style={styles.divider} />

          <SettingRow
            label="AUTO NEGATIVE PROMPT"
            desc="Pre-fill negative prompt with common artifacts"
            right={<AnimatedToggle value={autoNeg} onChange={setAutoNeg} />}
          />

          <View style={styles.divider} />

          <SettingRow
            label="HAPTIC FEEDBACK"
            desc="Vibration feedback when switching tabs"
            right={<AnimatedToggle value={haptic} onChange={handleHapticChange} />}
          />
        </Section>

        {/* Seed */}
        <Section title="REPRODUCIBILITY">
          <SettingRow
            label="SEED"
            desc="Same seed + prompt = same image every time"
          />
          <View style={styles.seedRow}>
            <TextInput
              style={styles.seedInput}
              placeholder="Leave empty for random"
              placeholderTextColor={colors.textMuted}
              value={seed}
              onChangeText={(t) => setSeed(t.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              selectionColor={colors.primary}
            />
            <TouchableOpacity style={styles.seedClear} onPress={() => setSeed("")} activeOpacity={0.7}>
              <Text style={styles.seedClearText}>RANDOM</Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* Resolutions */}
        <Section title="RESOLUTION REFERENCE">
          <Text style={styles.resoNote}>
            Resolution is driven by your Aspect Ratio selection. All sizes are clamped to safe multiples of 8 by the backend.
          </Text>
          <View style={styles.resoGrid}>
            {ASPECT_RATIOS.map((a) => (
              <View key={a.label} style={styles.resoItem}>
                <Text style={styles.resoLabel}>{a.label}</Text>
                <Text style={styles.resoDim}>{a.desc}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Session stats */}
        <Section title="SESSION">
          <SettingRow
            label="IMAGES GENERATED"
            right={
              <View style={styles.statBadge}>
                <Text style={styles.statVal}>{history.length}</Text>
              </View>
            }
          />
          <View style={styles.divider} />
          <SettingRow
            label="MODELS AVAILABLE"
            right={
              <View style={styles.statBadge}>
                <Text style={styles.statVal}>{Object.keys(MODEL_INFO).length}</Text>
              </View>
            }
          />
        </Section>

        {/* About */}
        <Section title="ABOUT">
          {[
            ["APP",       "WAGRAPH"],
            ["BACKEND",   "Cloudflare Workers AI"],
            ["FRAMEWORK", "Expo + expo-router"],
            ["VERSION",   "2.0.0"],
          ].map(([label, val], i, arr) => (
            <React.Fragment key={label}>
              <SettingRow
                label={label}
                right={<Text style={styles.aboutVal}>{val}</Text>}
              />
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: screen.paddingH, paddingTop: spacing.md },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: screen.paddingH, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title:     { ...typography.h2, color: colors.textPrimary },
  resetBtn:  { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  resetText: { ...typography.micro, color: colors.textMuted, letterSpacing: 2 },

  banner: {
    flexDirection: "row", alignItems: "center", gap: spacing.sm,
    borderWidth: 1, borderColor: `${colors.primary}30`,
    borderRadius: radius.md, padding: spacing.md, marginVertical: spacing.md,
  },
  bannerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, alignSelf: "flex-start", marginTop: 3,
               shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6 },
  bannerText:{ flex: 1, ...typography.bodySm, color: colors.textSecondary, lineHeight: 18 },

  bigVal:   { ...typography.h2, color: colors.primary },

  divider:  { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },

  seedRow:      { flexDirection: "row", gap: spacing.sm },
  seedInput:    { flex: 1, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 11, color: colors.textPrimary, fontSize: 14 },
  seedClear:    { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, justifyContent: "center", backgroundColor: colors.bgCard },
  seedClearText:{ ...typography.micro, letterSpacing: 2.5, color: colors.textMuted },

  resoNote: { ...typography.bodySm, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.md },
  resoGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  resoItem: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.bgInput },
  resoLabel:{ ...typography.caption, color: colors.textSecondary, fontWeight: "700" },
  resoDim:  { ...typography.micro, color: colors.textMuted, marginTop: 2 },

  statBadge:{ backgroundColor: `${colors.primary}18`, borderWidth: 1, borderColor: `${colors.primary}30`, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 4 },
  statVal:  { ...typography.h3, color: colors.primary },
  aboutVal: { ...typography.caption, color: colors.textSecondary },
});