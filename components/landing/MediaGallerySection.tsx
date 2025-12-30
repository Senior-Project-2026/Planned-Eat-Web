import { mediaGallery } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { ScrollReveal } from './ScrollReveal';

export function MediaGallerySection() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View
      id="media"
      style={[styles.section, { backgroundColor: colors.surface }]}
    >
      <View style={styles.container}>
        {/* Section Header */}
        <ScrollReveal delay={0} translateY={30}>
          <View style={styles.header}>
            <Text style={[styles.badge, { backgroundColor: colors.cardBg, color: colors.primary }]}>
              📱 The App
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {mediaGallery.sectionTitle}
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Explore the features Planned-Eat offers up close.
            </Text>
          </View>
        </ScrollReveal>

        {/* Video Section */}
        <ScrollReveal delay={100} translateY={50}>
          <View style={[styles.videoWrapper, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {Platform.OS === 'web' ? (
              <iframe
                src={mediaGallery.promoVideoUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: 16,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
              />
            ) : (
              <View style={[styles.videoPlaceholder, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={{ color: colors.muted, fontSize: 48 }}>▶️</Text>
                <Text style={{ color: colors.muted, marginTop: 12 }}>Promo Video</Text>
              </View>
            )}
          </View>
        </ScrollReveal>

        {/* Screenshots Gallery */}
        <ScrollReveal delay={200} translateY={40}>
          <View style={styles.gallerySection}>
            <Text style={[styles.galleryTitle, { color: colors.text }]}>
              Screenshots
            </Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryScroll}
            >
              {mediaGallery.screenshots.map((screenshot, index) => (
                <ScreenshotCard
                  key={screenshot.id}
                  url={screenshot.url}
                  alt={screenshot.alt}
                  colors={colors}
                  delay={index * 100}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollReveal>
      </View>
    </View>
  );
}

// Screenshot card with hover effect
function ScreenshotCard({ url, alt, colors, delay }: { url: string; alt: string; colors: any; delay: number }) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);

  const handleHoverIn = () => {
    translateY.value = withTiming(-4, { duration: 250, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1.01, { duration: 250, easing: Easing.out(Easing.ease) });
    shadowOpacity.value = withTiming(0.2, { duration: 250 });
  };

  const handleHoverOut = () => {
    translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) });
    shadowOpacity.value = withTiming(0.08, { duration: 250 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    shadowOpacity: shadowOpacity.value,
  }));

  return (
    <Pressable
      {...(Platform.OS === 'web' && {
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
      })}
    >
      <Animated.View
        style={[
          styles.screenshotContainer,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 20,
            elevation: 8,
          },
          animatedStyle,
        ]}
      >
        <Image
          source={{ uri: url }}
          style={styles.screenshot}
          contentFit="cover"
        />
        <Text style={[styles.screenshotLabel, { color: colors.muted }]}>
          {alt}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 100,
    paddingHorizontal: 24,
  },
  container: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    alignItems: 'center',
    marginBottom: 56,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    maxWidth: 600,
  },
  videoWrapper: {
    width: '100%',
    maxWidth: 900,
    aspectRatio: 16 / 9,
    alignSelf: 'center', // Ensure centering
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 15,
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  gallerySection: {
    marginTop: 32,
    alignItems: 'center', // Center children
  },
  galleryTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 32,
    textAlign: 'center',
  },
  galleryScroll: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 24,
    flexGrow: 1,
    justifyContent: 'center', // Center items if they don't overflow
  },
  screenshotContainer: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 12,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  screenshot: {
    width: 220,
    height: 440,
    borderRadius: 16,
  },
  screenshotLabel: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
  },
});
