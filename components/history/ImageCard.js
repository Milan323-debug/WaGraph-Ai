import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing } from "../../styles/theme";
import { historyStyles } from "../../styles/historyStyles";
import { getCloudinaryThumb } from "../../utils/cloudinary";
import { SaveBtn } from "./SaveBtn";

const { width: SCREEN_W } = Dimensions.get("window");
const H_PAD = spacing.md;
const GAP = 10;
const COL_W = (SCREEN_W - H_PAD * 2 - GAP) / 2;

function modelShort(model = "") {
  if (model.includes("lightning")) return "⚡ LIGHTNING";
  if (model.includes("dream"))     return "✦ DREAM";
  return "❄ SDXL";
}

export function ImageCard({ item, index, onPress, onDelete }) {
  const scale  = useSharedValue(1);
  const cardH  = Math.round(COL_W * ((item.height || 1) / (item.width || 1)));
  const thumb  = getCloudinaryThumb(item.url, Math.round(COL_W * 2.5));

  const press = () => {
    scale.value = withSpring(0.94, { damping: 12, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 14, stiffness: 260 });
    });
    onPress(item);
  };

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(index * 55).springify()}
      style={anim}
    >
      <TouchableOpacity
        onPress={press}
        activeOpacity={1}
        style={[historyStyles.card, { height: Math.max(cardH, 120) }]}
      >
        {/* Thumbnail */}
        <Image
          source={{ uri: thumb }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={280}
          placeholder={{ blurhash: "LGFFaXYk^6#M@-5c,1J5@[or[Q6." }}
        />

        {/* Bottom info gradient */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.88)"]}
          style={historyStyles.cardGrad}
        >
          <Text style={historyStyles.cardPrompt} numberOfLines={2}>{item.prompt}</Text>
          <View style={historyStyles.cardTagRow}>
            <View style={historyStyles.cardTag}>
              <Text style={historyStyles.cardTagTxt}>{modelShort(item.model)}</Text>
            </View>
            <View style={historyStyles.cardTag}>
              <Text style={historyStyles.cardTagTxt}>{item.aspectRatio}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Top-right action cluster */}
        <View style={historyStyles.cardTopRight}>
          {/* Save */}
          <SaveBtn url={item.url} compact />
          {/* Delete */}
          <TouchableOpacity
            style={historyStyles.cardDeleteBtn}
            onPress={() => onDelete(item)}
            hitSlop={{ top: 6, left: 6, bottom: 6, right: 6 }}
          >
            <Ionicons name="trash-outline" size={11} color="rgba(255,100,100,0.9)" />
          </TouchableOpacity>
        </View>

        {/* Corner accent TL */}
        <View style={[historyStyles.cornerTL, { borderColor: `${colors.primary}55` }]} />
      </TouchableOpacity>
    </Animated.View>
  );
}
