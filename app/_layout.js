import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { colors } from "../styles/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <Stack
          screenOptions={{
            headerShown: false,
            // Smooth fade+slide transition for all stack screens
            animation: "fade_from_bottom",
            animationDuration: 260,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}