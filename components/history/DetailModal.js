import React from "react";
import { View, TouchableOpacity, Modal, ScrollView, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  ZoomIn, ZoomOut,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../styles/theme";
import { historyStyles } from "../../styles/historyStyles";
import { SaveBtn } from "./SaveBtn";
import { StatBox } from "./StatBox";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

export function DetailModal({ item, visible, onClose, onDelete }) {
  if (!item) return null;

  const imgH = Math.min(
    SCREEN_W * ((item.height || 1) / (item.width || 1)),
    SCREEN_H * 0.48
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={historyStyles.modalBg}>
        {/* Tap outside to close */}
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View
          entering={ZoomIn.duration(260).springify()}
          exiting={ZoomOut.duration(180)}
          style={historyStyles.modalCard}
        >
          {/* Full image */}
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: item.url }}
              style={{ width: "100%", height: imgH }}
              contentFit="cover"
              transition={200}
            />
            {/* Top-left corner accent */}
            <View style={[historyStyles.cornerTL, { borderColor: `${colors.primary}80`, top: 10, left: 10 }]} />
            <View style={[historyStyles.cornerBR, { borderColor: `${colors.primary}80`, bottom: 10, right: 10 }]} />

            {/* Close pill */}
            <TouchableOpacity style={historyStyles.modalClosePill} onPress={onClose}>
              <Ionicons name="close" size={14} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={historyStyles.modalBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 14 }}
          >
            {/* Prompt */}
            <Text style={historyStyles.modalPrompt}>"{item.prompt}"</Text>

            {/* Stat grid */}
            <View style={historyStyles.statGrid}>
              <StatBox icon="cube-outline"          label="MODEL"  value={item.model || "—"}        />
              <StatBox icon="crop-outline"          label="RATIO"  value={item.aspectRatio || "—"}   />
              <StatBox icon="timer-outline"         label="TIME"   value={`${item.elapsed || 0}s`}   />
              <StatBox icon="color-palette-outline" label="STYLE"  value={item.style || "None"}      />
              <StatBox icon="calendar-outline"      label="DATE"   value={formatDate(item.createdAt) }/>
              <StatBox icon="time-outline"          label="AT"     value={formatTime(item.createdAt) }/>
            </View>

            {/* Action row */}
            <View style={historyStyles.modalActionRow}>
              {/* Save to device */}
              <SaveBtn url={item.url} />

              {/* Delete */}
              <TouchableOpacity
                style={historyStyles.modalDeleteBtn}
                onPress={() => { onClose(); onDelete(item); }}
              >
                <Ionicons name="trash-outline" size={15} color="#FF6B6B" />
                <Text style={historyStyles.modalDeleteTxt}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
