import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { NEGATIVE_PRESETS } from "../../utils/api";
import { colors, spacing, radius, typography } from "../../styles/theme";

export default function PromptInput({
  prompt, onChangePrompt,
  negPrompt, onChangeNeg,
  showNeg, onToggleNeg,
  disabled, stylePreset,
  compact = false,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.heading}>PROMPT</Text>
        {stylePreset && stylePreset.label !== "None" ? (
          <View style={styles.presetBadge}>
            <Text style={styles.presetBadgeText}>+ {stylePreset.label}</Text>
          </View>
        ) : null}
      </View>

      <View style={[
        styles.card,
        focused && styles.cardFocused,
        disabled && styles.cardDisabled,
      ]}>
        <TextInput
          style={[styles.input, compact && styles.inputCompact]}
          placeholder="Describe the image you want to create..."
          placeholderTextColor={colors.textDim}
          value={prompt}
          onChangeText={onChangePrompt}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          maxLength={1000}
          textAlignVertical="top"
          selectionColor={colors.primary}
          editable={!disabled}
        />
        <View style={styles.footer}>
          <Text style={styles.count}>{prompt.length}/1000</Text>
          <View style={styles.footerRight}>
            <TouchableOpacity onPress={onToggleNeg}>
              <Text style={[styles.negToggle, showNeg && styles.negToggleOn]}>
                {showNeg ? "− NEG" : "+ NEG"}
              </Text>
            </TouchableOpacity>
            {prompt.length > 0 && !disabled && (
              <TouchableOpacity onPress={() => onChangePrompt("")}>
                <Text style={styles.clear}>CLEAR</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {showNeg && (
        <View style={[styles.card, { marginTop: 6 }]}>
          <Text style={styles.negLabel}>NEGATIVE PROMPT</Text>
          <TextInput
            style={[styles.input, { minHeight: 48 }]}
            placeholder="What to avoid..."
            placeholderTextColor={colors.textDim}
            value={negPrompt}
            onChangeText={onChangeNeg}
            multiline
            selectionColor="#F87171"
            editable={!disabled}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.negChips}>
            {NEGATIVE_PRESETS.map((np) => (
              <TouchableOpacity
                key={np}
                style={styles.negChip}
                onPress={() => onChangeNeg((v) => (v ? `${v}, ${np}` : np))}
              >
                <Text style={styles.negChipText}>+ {np}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { marginBottom: 0 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 2,
  },
  card:          { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: "hidden", elevation: 2 },
  cardFocused:   { borderColor: colors.borderFocus },
  cardDisabled:  { opacity: 0.45 },
  input: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    padding: spacing.sm + 4,
    minHeight: 110,
    backgroundColor: "transparent",
  },
  inputCompact: {
    minHeight: 68,
    fontSize: 14,
    padding: spacing.sm + 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerRight:    { flexDirection: "row", gap: spacing.md },
  count:          { ...typography.caption, color: colors.textMuted, fontSize: 10 },
  clear:          { ...typography.micro, color: colors.primaryDim, letterSpacing: 2 },
  negToggle:      { ...typography.micro, color: colors.textDim, letterSpacing: 2 },
  negToggleOn:    { color: "#F87171" },
  negLabel:       { fontSize: 8, fontWeight: "800", letterSpacing: 3, color: "#F8717155", paddingHorizontal: spacing.sm + 4, paddingTop: spacing.sm },
  negChips:       { paddingHorizontal: spacing.sm + 4, paddingBottom: spacing.sm },
  negChip:        { borderWidth: 1, borderColor: "#F8717144", borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 5, marginRight: 6, backgroundColor: "transparent" },
  negChipText:    { fontSize: 10, color: "#F87171", opacity: 0.85 },
  presetBadge:    { backgroundColor: `${colors.primary}18`, borderWidth: 1, borderColor: `${colors.primary}44`, borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  presetBadgeText:{ ...typography.micro, color: colors.primary, letterSpacing: 1 },
});