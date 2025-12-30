import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
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
          <Ionicons 
            name={isApple ? "logo-apple" : "logo-google-playstore"} 
            size={28} 
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
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    minWidth: 170,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    fontSize: 30,
  },
  textContainer: {
    flexDirection: 'column',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 2,
  },
});
