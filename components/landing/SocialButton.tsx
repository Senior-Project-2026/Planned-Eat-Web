import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Platform, Pressable, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface SocialButtonProps {
  type: 'linkedin' | 'github';
  url: string;
}

export function SocialButton({ type, url }: SocialButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const handlePress = () => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleHoverIn = () => {
    scale.value = withSpring(1.15, { damping: 12, stiffness: 300 });
    rotate.value = withSpring(10, { damping: 12, stiffness: 200 });
  };

  const handleHoverOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
    rotate.value = withSpring(0, { damping: 12, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const isLinkedIn = type === 'linkedin';
  const bgColor = isLinkedIn ? '#0A66C2' : (colorScheme === 'dark' ? '#FFFFFF' : '#24292F');
  const iconColor = isLinkedIn ? '#FFFFFF' : (colorScheme === 'dark' ? '#24292F' : '#FFFFFF');

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
          { backgroundColor: bgColor },
          animatedStyle,
        ]}
      >
        {isLinkedIn ? (
           <MaterialCommunityIcons name="linkedin" size={24} color={iconColor} />
        ) : (
           <MaterialCommunityIcons name="github" size={24} color={iconColor} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },

});
