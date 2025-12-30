import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SocialButton } from './SocialButton';

interface TeamMemberCardProps {
  name: string;
  role: string;
  avatar: any; // Allow string or require
  linkedIn: string;
  github: string;
}

export function TeamMemberCard({ name, role, avatar, linkedIn, github }: TeamMemberCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  // Animation values
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);
  const avatarScale = useSharedValue(1);
  const lineWidth = useSharedValue(0);

  const handleHoverIn = () => {
    translateY.value = withTiming(-3, { duration: 250, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 250 });
    shadowOpacity.value = withTiming(0.15, { duration: 250 });
    avatarScale.value = withTiming(1.02, { duration: 250, easing: Easing.out(Easing.ease) });
    lineWidth.value = withTiming(100, { duration: 300, easing: Easing.out(Easing.ease) });
  };

  const handleHoverOut = () => {
    translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 250 });
    shadowOpacity.value = withTiming(0.08, { duration: 250 });
    avatarScale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
    lineWidth.value = withTiming(0, { duration: 250 });
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    shadowOpacity: shadowOpacity.value,
  }));

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const animatedLineStyle = useAnimatedStyle(() => ({
    width: `${lineWidth.value}%`,
  }));

  const imageSource = typeof avatar === 'string' ? { uri: avatar } : avatar;

  return (
    <Pressable
      {...(Platform.OS === 'web' && {
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
      })}
      style={{ flex: 1, minWidth: 280, maxWidth: 340 }}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 24,
            elevation: 8,
          },
          animatedCardStyle,
        ]}
      >
        {/* Animated Top Line */}
        <View style={styles.topLineContainer}>
          <Animated.View
            style={[
              styles.decorLine,
              { backgroundColor: colors.primary },
              animatedLineStyle,
            ]}
          />
        </View>

        {/* Avatar */}
        <Animated.View
          style={[
            styles.avatarContainer,
            { borderColor: colors.primary },
            animatedAvatarStyle,
          ]}
        >
          <Image
            source={imageSource}
            style={styles.avatar}
            contentFit="cover"
          />
        </Animated.View>

        {/* Info */}
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.role, { color: colors.muted }]}>{role}</Text>

        {/* Social Links */}
        <View style={styles.socialRow}>
          <SocialButton type="linkedin" url={linkedIn} />
          <SocialButton type="github" url={github} />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 32,
    paddingTop: 40,
    borderRadius: 32, // Priot.io style
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  topLineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    alignItems: 'center',
  },
  decorLine: {
    height: 4,
    borderRadius: 2,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  role: {
    fontSize: 15,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
