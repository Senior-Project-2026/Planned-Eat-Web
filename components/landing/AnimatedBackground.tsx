import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface AnimatedBackgroundProps {
  scrollY?: SharedValue<number>;
}

export function AnimatedBackground({ scrollY }: AnimatedBackgroundProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width, height } = useWindowDimensions();
  
  // Use a local shared value if not provided
  const localScrollY = useSharedValue(0);
  const activeScrollY = scrollY ?? localScrollY;

  // Blob animation values
  const blob1X = useSharedValue(0);
  const blob1Y = useSharedValue(0);
  const blob2X = useSharedValue(0);
  const blob2Y = useSharedValue(0);
  const blob3X = useSharedValue(0);
  const blob3Y = useSharedValue(0);

  useEffect(() => {
    // Slow, floating animations for each blob
    blob1X.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    blob1Y.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
        withTiming(15, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 7000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    blob2X.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(20, { duration: 9000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(35, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-15, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 9000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    blob3X.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-35, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    blob3Y.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 13000, easing: Easing.inOut(Easing.ease) }),
        withTiming(30, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 11000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const blob1Style = useAnimatedStyle(() => {
    const parallaxY = interpolate(activeScrollY.value, [0, height], [0, height * 0.2]);
    return {
      transform: [
        { translateX: blob1X.value },
        { translateY: blob1Y.value + parallaxY },
      ],
    };
  });

  const blob2Style = useAnimatedStyle(() => {
    const parallaxY = interpolate(activeScrollY.value, [0, height], [0, -height * 0.1]);
    return {
      transform: [
        { translateX: blob2X.value },
        { translateY: blob2Y.value + parallaxY },
      ],
    };
  });

  const blob3Style = useAnimatedStyle(() => {
    const parallaxY = interpolate(activeScrollY.value, [0, height], [0, height * 0.15]);
    return {
      transform: [
        { translateX: blob3X.value },
        { translateY: blob3Y.value + parallaxY },
      ],
    };
  });

  const primaryColor = colorScheme === 'dark' ? 'rgba(74, 222, 128, 0.08)' : 'rgba(34, 197, 94, 0.15)';
  const secondaryColor = colorScheme === 'dark' ? 'rgba(52, 211, 153, 0.06)' : 'rgba(16, 185, 129, 0.12)';
  const accentColor = colorScheme === 'dark' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(5, 150, 105, 0.10)';

  // Priot.io style lateral glow colors
  const leftGlow = colorScheme === 'dark' ? 'rgba(59, 130, 246, 0.20)' : 'rgba(59, 130, 246, 0.08)';
  const rightGlow = colorScheme === 'dark' ? 'rgba(20, 184, 166, 0.18)' : 'rgba(20, 184, 166, 0.06)';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Lateral Glows - Priot.io style */}
      <View 
        style={[
          styles.lateralGlow, 
          styles.leftGlow,
          { backgroundColor: leftGlow }
        ]} 
      />
      <View 
        style={[
          styles.lateralGlow, 
          styles.rightGlow,
          { backgroundColor: rightGlow }
        ]} 
      />

      {/* Blob 1 - Top Right */}
      <Animated.View
        style={[
          styles.blob,
          blob1Style,
          {
            width: width * 0.6,
            height: width * 0.6,
            top: -width * 0.2,
            right: -width * 0.2,
            backgroundColor: primaryColor,
          },
        ]}
      />
      
      {/* Blob 2 - Middle Left */}
      <Animated.View
        style={[
          styles.blob,
          blob2Style,
          {
            width: width * 0.7,
            height: width * 0.7,
            top: height * 0.4,
            left: -width * 0.3,
            backgroundColor: secondaryColor,
          },
        ]}
      />
      
      {/* Blob 3 - Bottom Right */}
      <Animated.View
        style={[
          styles.blob,
          blob3Style,
          {
            width: width * 0.5,
            height: width * 0.5,
            bottom: height * 0.1,
            right: -width * 0.15,
            backgroundColor: accentColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1,
  },
  lateralGlow: {
    position: 'absolute',
    width: '40%',
    height: '100%',
    ...(Platform.OS === 'web' && {
      filter: 'blur(150px)',
    }),
  },
  leftGlow: {
    left: '-15%',
    top: 0,
  },
  rightGlow: {
    right: '-15%',
    top: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    ...(Platform.OS === 'web' && {
      filter: 'blur(80px)',
    }),
  },
});
