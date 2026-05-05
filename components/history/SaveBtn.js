import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../styles/theme";
import { historyStyles } from "../../styles/historyStyles";
import { downloadAndSave } from "../../utils/cloudinary";

export function SaveBtn({ url, compact = false }) {
  const [saving, setSaving] = useState(false);
  const scale = useSharedValue(1);

  const handleSave = async () => {
    if (saving) return;
    scale.value = withSpring(0.88, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    await downloadAndSave(url, () => setSaving(true), () => setSaving(false));
  };

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (compact) {
    return (
      <Animated.View style={anim}>
        <TouchableOpacity
          style={historyStyles.cardSaveBtn}
          onPress={handleSave}
          disabled={saving}
          hitSlop={{ top: 6, left: 6, bottom: 6, right: 6 }}
        >
          {saving
            ? <Ionicons name="ellipsis-horizontal" size={11} color="#fff" />
            : <Ionicons name="download-outline"    size={11} color="#fff" />
          }
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[historyStyles.modalSaveBtnWrap, anim]}>
      <LinearGradient
        colors={[colors.primary, `${colors.primary}BB`]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={historyStyles.modalSaveBtn}
      >
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={1}
        >
          {saving ? (
            <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
          ) : (
            <View style={historyStyles.modalSaveBtnInner}>
              <Ionicons name="download" size={16} color="#fff" />
              <Text style={historyStyles.modalSaveBtnTxt}>SAVE IMAGE</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}
