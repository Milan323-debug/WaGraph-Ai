import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, interpolate, Easing,
} from "react-native-reanimated";

/**
 * Corner accent borders - animated diagonal corner elements
 */
export default function CornerAccent({ position, color, size = 18 }) {
  const anim = useSharedValue(0);
  
  useEffect(() => {
    anim.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, []);
  
  const style = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [{ scale: interpolate(anim.value, [0, 1], [0.4, 1]) }],
  }));
  
  const pos = {
    TL: { top: 8,    left: 8,   borderTopWidth: 2,    borderLeftWidth: 2   },
    TR: { top: 8,    right: 8,  borderTopWidth: 2,    borderRightWidth: 2  },
    BL: { bottom: 8, left: 8,   borderBottomWidth: 2, borderLeftWidth: 2   },
    BR: { bottom: 8, right: 8,  borderBottomWidth: 2, borderRightWidth: 2  },
  }[position];
  
  return (
    <Animated.View
      style={[
        { 
          position: "absolute", 
          width: size, 
          height: size, 
          borderColor: color, 
          zIndex: 10 
        },
        pos,
        style,
      ]}
    />
  );
}
