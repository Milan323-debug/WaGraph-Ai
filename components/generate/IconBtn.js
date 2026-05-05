import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "../../styles/theme";

/**
 * Icon action button - animated touch feedback
 */
export default function IconBtn({ icon, label, onPress, danger }) {
  const scale = useSharedValue(1);
  
  const press = () => {
    scale.value = withSpring(0.88, { damping: 10, stiffness: 400 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    });
    onPress?.();
  };
  
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  
  return (
    <Animated.View style={anim}>
      <TouchableOpacity
        style={[styles.iconBtn, danger && styles.iconBtnDanger]}
        onPress={press}
        activeOpacity={1}
      >
        <Ionicons
          name={icon}
          size={17}
          color={danger ? "#FF6B6B" : colors.textMuted}
        />
        {label && (
          <Text style={[styles.iconBtnLabel, danger && { color: "#FF6B6B" }]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    height: 48,
    flex: 1.3,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  iconBtnDanger: {
    borderColor: "#FF6B6B33",
    backgroundColor: "#FF6B6B08",
  },
  iconBtnLabel: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: colors.textMuted,
  },
});
