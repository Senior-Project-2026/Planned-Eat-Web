import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface StoreButtonProps {
  type: 'apple' | 'google';
  url: string;
}

export function StoreButton({ type, url }: StoreButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Animation values
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.15);

  const handlePress = () => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleHoverIn = () => {
    scale.value = withSpring(1.03, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(-3, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.25, { duration: 200 });
  };

  const handleHoverOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
    shadowOpacity.value = withTiming(0.15, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    shadowOpacity: shadowOpacity.value,
  }));

  const isApple = type === 'apple';
  const bgColor = colorScheme === 'dark' ? '#FFFFFF' : '#171717';
  const textColor = colorScheme === 'dark' ? '#000000' : '#FFFFFF';

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...(Platform.OS === 'web' && {
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
      })}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
            shadowColor: bgColor,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 20,
            elevation: 8,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.content}>
          <MaterialCommunityIcons 
            name={isApple ? "apple" : "google-play"} 
            size={30} 
            color={textColor} 
          />
          <View style={styles.textContainer}>
            <Text style={[styles.subtitle, { color: textColor }]}>
              {isApple ? "Download on the" : "GET IT ON"}
            </Text>
            <Text style={[styles.title, { color: textColor }]}>
              {isApple ? "App Store" : "Google Play"}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: 190,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Reduced slightly
  },
  icon: {
    // fontSize removed, controlled via props
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500', // Slightly bolder for visibility
    opacity: 0.9,
    lineHeight: 12, // Tight line height
    marginBottom: 2, // Small gap
    textTransform: 'uppercase', // Maybe unify casing? No, keep standard. "GET IT ON" is usually caps.
    // Actually, App Store "Download on the" is usually Mixed Case. Google "GET IT ON" is Caps.
    // Let's keep content logic, just fix spacing.
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700', // Bolder
    marginTop: 0,
    lineHeight: 22,
  },
});
