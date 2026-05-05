import React from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { historyStyles } from "../../styles/historyStyles";
import { SaveBtn } from "./SaveBtn";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export function FullscreenViewer({ item, visible, onClose, onInfo, onDelete }) {
  const [chromeVisible, setChromeVisible] = React.useState(true);
  const chromeOpa  = useSharedValue(0);
  const bgOpa      = useSharedValue(0);
  const imgScale   = useSharedValue(0.88);

  const imgW  = item?.width  || 1024;
  const imgH  = item?.height || 1024;
  const ratio = imgW / imgH;

  // Fit image to screen — fill width, cap at screen height
  let displayW = SCREEN_W;
  let displayH = SCREEN_W / ratio;
  if (displayH > SCREEN_H) {
    displayH = SCREEN_H;
    displayW = SCREEN_H * ratio;
  }

  React.useEffect(() => {
    if (visible) {
      setChromeVisible(true);
      chromeOpa.value = withTiming(1, { duration: 220 });
      bgOpa.value     = withTiming(1, { duration: 280 });
      imgScale.value  = withSpring(1, { damping: 18, stiffness: 200 });
    } else {
      bgOpa.value    = withTiming(0, { duration: 180 });
      imgScale.value = withTiming(0.92, { duration: 180 });
      chromeOpa.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const toggleChrome = () => {
    const next = !chromeVisible;
    setChromeVisible(next);
    chromeOpa.value = withTiming(next ? 1 : 0, { duration: 200 });
  };

  const chromeStyle    = useAnimatedStyle(() => ({ opacity: chromeOpa.value }));
  const bgStyle        = useAnimatedStyle(() => ({ opacity: bgOpa.value }));
  const imgStyle       = useAnimatedStyle(() => ({ transform: [{ scale: imgScale.value }] }));

  if (!item || !visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[historyStyles.fsBg, bgStyle]}>

        {/* ── Image — tap to toggle chrome ── */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View style={[historyStyles.fsImgWrap, imgStyle]}>
          <TouchableOpacity activeOpacity={1} onPress={toggleChrome}>
            <Image
              source={{ uri: item.url }}
              style={{ width: displayW, height: displayH }}
              contentFit="contain"
              transition={200}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Top chrome: close + info ── */}
        <Animated.View style={[historyStyles.fsTopBar, chromeStyle]} pointerEvents="box-none">
          <TouchableOpacity style={historyStyles.fsBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={historyStyles.fsBtn} onPress={onInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Bottom chrome: prompt + save + delete ── */}
        <Animated.View style={[historyStyles.fsBottomBar, chromeStyle]} pointerEvents="box-none">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.92)"]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={historyStyles.fsPrompt} numberOfLines={3}>"{item.prompt}"</Text>
          <View style={historyStyles.fsActions}>
            <SaveBtn url={item.url} compact={false} />
            <TouchableOpacity
              style={historyStyles.fsDeleteBtn}
              onPress={() => { onClose(); onDelete(item); }}
            >
              <Ionicons name="trash-outline" size={15} color="#FF6B6B" />
              <Text style={historyStyles.fsDeleteTxt}>DELETE</Text>
            </TouchableOpacity>
          </View>
          <Text style={historyStyles.fsTapHint}>TAP IMAGE TO TOGGLE CONTROLS</Text>
        </Animated.View>

      </Animated.View>
    </Modal>
  );
}
