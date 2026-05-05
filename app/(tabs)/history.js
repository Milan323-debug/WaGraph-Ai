// app/(tabs)/history.js
import React, { useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity,
  Dimensions, Alert, ScrollView,
  RefreshControl,
} from "react-native";
import { Image }            from "expo-image";
import Animated, {
  FadeIn, FadeInDown, FadeInUp, ZoomIn, ZoomOut,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect }    from "expo-router";
import { Ionicons }          from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "../../styles/theme";
import { historyStyles } from "../../styles/historyStyles";
import { fetchGallery, deleteImage }  from "../../utils/api";
// Import extracted components
import { SkeletonCard } from "../../components/history/SkeletonCard";
import { FullscreenViewer } from "../../components/history/FullscreenViewer";
import { ImageCard } from "../../components/history/ImageCard";
import { StatBox } from "../../components/history/StatBox";
import { DetailModal } from "../../components/history/DetailModal";
import { EmptyState } from "../../components/history/EmptyState";
import { ErrorState } from "../../components/history/ErrorState";
import { SortPill } from "../../components/history/SortPill";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const H_PAD  = spacing.md;
const GAP    = 10;
const COL_W  = (SCREEN_W - H_PAD * 2 - GAP) / 2;

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
function modelShort(model = "") {
  if (model.includes("lightning")) return "⚡ LIGHTNING";
  if (model.includes("dream"))     return "✦ DREAM";
  return "❄ SDXL";
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const styles = historyStyles; // Alias for compatibility

  const [images,     setImages]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [fsItem,     setFsItem]     = useState(null);
  const [fsOpen,     setFsOpen]     = useState(false);
  const [sort,       setSort]       = useState("newest"); // newest | oldest | model

  // ── Sorted images ─────────────────────────────────────────────────────────
  const sorted = [...images].sort((a, b) => {
    if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === "model")  return (a.model || "").localeCompare(b.model || "");
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  const leftCol  = sorted.filter((_, i) => i % 2 === 0);
  const rightCol = sorted.filter((_, i) => i % 2 !== 0);

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadImages = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else           setLoading(true);
    setError(null);
    try {
      const data = await fetchGallery(100);
      setImages(data.images || []);
    } catch (err) {
      setError(err.message || "Could not load gallery.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadImages(); }, [loadImages]));

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback((item) => {
    Alert.alert(
      "Delete Image",
      "This will permanently remove the image from your gallery.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              await deleteImage(item.id || item.publicId);
              setImages((prev) => prev.filter((i) => (i.id || i.publicId) !== (item.id || item.publicId)));
            } catch (e) {
              Alert.alert("Delete Failed", e.message);
            }
          },
        },
      ]
    );
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>GALLERY</Text>
          {images.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeTxt}>{images.length}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => loadImages(true)}
        >
          <Ionicons name="refresh-outline" size={17} color={colors.primary} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Sort bar ── */}
      {!loading && images.length > 0 && (
        <Animated.View entering={FadeIn.duration(300).delay(100)} style={styles.sortBar}>
          <SortPill label="NEWEST" active={sort === "newest"} onPress={() => setSort("newest")} />
          <SortPill label="OLDEST" active={sort === "oldest"} onPress={() => setSort("oldest")} />
          <SortPill label="MODEL"  active={sort === "model"}  onPress={() => setSort("model")}  />
        </Animated.View>
      )}

      {/* ── Body ── */}
      {loading ? (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          <View style={styles.col}>
            {[230, 155, 290, 185].map((h, i) => <SkeletonCard key={i} height={h} />)}
          </View>
          <View style={styles.col}>
            {[170, 260, 175, 240].map((h, i) => <SkeletonCard key={i} height={h} />)}
          </View>
        </ScrollView>

      ) : error ? (
        <ErrorState message={error} onRetry={() => loadImages()} />

      ) : images.length === 0 ? (
        <EmptyState />

      ) : (
        <ScrollView
          contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 110 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadImages(true)}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <View style={styles.col}>
            {leftCol.map((item, i) => (
              <ImageCard
                key={item.id || item.publicId || i}
                item={item}
                index={i * 2}
                onPress={(img) => { setFsItem(img); setFsOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </View>
          <View style={styles.col}>
            {rightCol.map((item, i) => (
              <ImageCard
                key={item.id || item.publicId || i}
                item={item}
                index={i * 2 + 1}
                onPress={(img) => { setFsItem(img); setFsOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── Fullscreen viewer ── */}
      <FullscreenViewer
        item={fsItem}
        visible={fsOpen}
        onClose={() => setFsOpen(false)}
        onInfo={() => { setSelected(fsItem); setModalOpen(true); }}
        onDelete={(img) => { setFsOpen(false); handleDelete(img); }}
      />

      {/* ── Detail modal (opened from fullscreen info btn) ── */}
      <DetailModal
        item={selected}
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={(img) => { setModalOpen(false); handleDelete(img); }}
      />
    </View>
  );
}