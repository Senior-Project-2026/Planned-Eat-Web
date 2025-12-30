import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index: number;
}

const iconMap: Record<string, string> = {
  'sparkles': '✨',
  'chart-bar': '📊',
  'shopping-cart': '🛒',
  'calendar': '📅',
  'heart': '❤️',
  'clock': '⏰',
  'star': '⭐',
  'bolt': '⚡',
};

export function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const isLarge = index === 0 || index === 3;

  // Animation values
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const iconScale = useSharedValue(1);

  const handleHoverIn = () => {
    translateY.value = withTiming(-4, { duration: 250, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1.01, { duration: 250, easing: Easing.out(Easing.ease) });
    shadowOpacity.value = withTiming(0.15, { duration: 250 });
    iconScale.value = withTiming(1.05, { duration: 250 });
  };

  const handleHoverOut = () => {
    translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
    shadowOpacity.value = withTiming(0.08, { duration: 250 });
    iconScale.value = withTiming(1, { duration: 250 });
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    shadowOpacity: shadowOpacity.value,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...(Platform.OS === 'web' && {
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
      })}
      style={{ flex: 1, minWidth: 280, maxWidth: 400 }} // Max width to prevent overly stretched cards on wide screens
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 4 }, // Softer shadow
            shadowRadius: 16,
            elevation: 4,
          },
          animatedCardStyle,
        ]}
      >
        <Animated.View style={[styles.iconContainer, { backgroundColor: colors.surface }, animatedIconStyle]}>
          <Text style={styles.icon}>{iconMap[icon] || '🍽️'}</Text>
        </Animated.View>
        
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        
        <Text style={[styles.description, { color: colors.muted }]}>
          {description}
        </Text>

        <View style={[styles.decorAccent, { backgroundColor: colors.primary, opacity: 0.05 }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 32,
    borderRadius: 24, // Slightly reduced from 32 for cleaner look
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center', // Center content horizontally
    height: '100%', // Match height in row
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'border-color 0.2s ease',
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20, // Squircle
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center', // Center text
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center', // Center text
    opacity: 0.8,
  },
  decorAccent: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -20,
    right: -20,
    zIndex: -1, // Behind content
  },
});
