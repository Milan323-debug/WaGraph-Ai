import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SUGGESTIONS } from "../../utils/api";
import { colors, spacing, radius, typography } from "../../styles/theme";

export default function SuggestionPicker({ onSelect }) {
  const categories = Object.keys(SUGGESTIONS);
  const [active, setActive] = useState(categories[0]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>QUICK IDEAS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, active === cat && styles.tabOn]}
            onPress={() => setActive(cat)}
          >
            <Text style={[styles.tabText, active === cat && styles.tabTextOn]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContent}
      >
        {SUGGESTIONS[active].map((sg) => (
          <TouchableOpacity
            key={sg}
            style={styles.chip}
            onPress={() => onSelect(sg)}
            activeOpacity={0.7}
          >
            <Text style={styles.chipText} numberOfLines={2}>{sg}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { marginBottom: 0 },
  heading: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  tabs:         { marginBottom: 5 },
  tabsContent:  { paddingRight: 8 },
  chipsContent: { paddingRight: 8 },
  tab: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    elevation: 2,
  },
  tabOn:      { borderColor: colors.primary, backgroundColor: `${colors.primary}18` },
  tabText:    { fontSize: 10, fontWeight: "600", color: colors.textMuted },
  tabTextOn:  { color: colors.primary, fontWeight: "700" },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 5,
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    elevation: 2,
    maxWidth: 150,
  },
  chipText: { fontSize: 10, color: colors.textMuted, lineHeight: 14, opacity: 0.7 },
});