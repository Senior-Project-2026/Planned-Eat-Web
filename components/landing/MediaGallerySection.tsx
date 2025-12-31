import { mediaGallery } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut
} from 'react-native-reanimated';
import { ScrollReveal } from './ScrollReveal';

export function MediaGallerySection() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [selectedScreen, setSelectedScreen] = useState<{ image: any; alt: string; description?: string } | null>(null);

  const closeModal = () => setSelectedScreen(null);

  return (
    <View
      id="media"
      style={[
        styles.section, 
        { 
          backgroundColor: 'transparent',
          paddingVertical: isDesktop ? 100 : 60, // Reduce padding on mobile
        }
      ]}
    >
      <View style={styles.container}>
        {/* Section Header */}
        <ScrollReveal delay={0} translateY={30}>
          <View style={styles.header}>
            <Text style={[styles.badge, { backgroundColor: colors.cardBg, color: colors.primary }]}>
              📱 The App
            </Text>
            <Text style={[styles.title, { color: colors.text, fontSize: isDesktop ? 44 : 32 }]}>
              {mediaGallery.sectionTitle}
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted, fontSize: isDesktop ? 18 : 16 }]}>
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
              horizontal={isDesktop}
              showsHorizontalScrollIndicator={isDesktop}
              showsVerticalScrollIndicator={!isDesktop}
              contentContainerStyle={[
                styles.galleryScroll,
                !isDesktop && { flexDirection: 'column', alignItems: 'center', gap: 60 }
              ]}
            >
              {mediaGallery.screenshots.map((screenshot, index) => (
                <ScreenshotCard
                  key={screenshot.id}
                  image={screenshot.image}
                  alt={screenshot.alt}
                  description={screenshot.description}
                  colors={colors}
                  delay={index * 100}
                  onPress={() => setSelectedScreen(screenshot)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollReveal>

    {/* Detail Modal */}
        <Modal
          visible={!!selectedScreen}
          transparent
          animationType="none"
          onRequestClose={closeModal}
        >
          {selectedScreen && (
            <Pressable style={styles.modalOverlay} onPress={closeModal}>
                <Animated.View 
                    entering={FadeIn.duration(300)} 
                    exiting={FadeOut.duration(200)}
                    style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' } as any]} 
                />
                
                <Animated.View 
                    entering={ZoomIn.duration(400).easing(Easing.out(Easing.back(1.5)))}
                    exiting={ZoomOut.duration(200)}
                    style={[
                        styles.modalContent, 
                        isDesktop ? styles.modalContentDesktop : styles.modalContentMobile,
                    ]}
                >
                    <Pressable style={styles.modalInner} onPress={(e) => e.stopPropagation()}>
                         {isDesktop ? (
                            <View style={styles.modalContentWrapper}>
                                <View style={styles.modalImageWrapperDesktop}>
                                    <PhoneFrame>
                                        <Image
                                            source={selectedScreen.image}
                                            style={{ width: '100%', height: '100%' }}
                                            contentFit="cover"
                                        />
                                    </PhoneFrame>
                                </View>
                                
                                <View style={styles.modalTextContainer}>
                                    <Text style={[styles.modalTitle, { color: '#fff' }]}>{selectedScreen.alt}</Text>
                                    <Text style={[styles.modalDescription, { color: 'rgba(255,255,255,0.8)' }]}>
                                        {selectedScreen.description}
                                    </Text>
                                    <Pressable 
                                        onPress={closeModal}
                                        style={({pressed}) => [
                                            styles.closeButton, 
                                            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
                                        ]}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </Pressable>
                                </View>
                            </View>
                         ) : (
                            <ScrollView 
                                style={{ flex: 1, width: '100%' }}
                                contentContainerStyle={{ paddingVertical: 40, alignItems: 'center' }}
                            >
                                <View style={[styles.modalImageWrapperMobile, { height: 480 * Math.min(width * 0.85 / 230, 0.9) + 40 }]}>
                                    <PhoneFrame style={{ transform: [{ scale: Math.min(width * 0.85 / 230, 0.9) }] }}>
                                        <Image
                                            source={selectedScreen.image}
                                            style={{ width: '100%', height: '100%' }}
                                            contentFit="cover"
                                        />
                                    </PhoneFrame>
                                </View>
                                
                                <View style={styles.modalTextContainerMobile}>
                                    <Text style={[styles.modalTitleMobile, { color: '#fff' }]}>{selectedScreen.alt}</Text>
                                    <Text style={[styles.modalDescriptionMobile, { color: 'rgba(255,255,255,0.8)' }]}>
                                        {selectedScreen.description}
                                    </Text>
                                    <Pressable 
                                        onPress={closeModal}
                                        style={({pressed}) => [
                                            styles.closeButton, 
                                            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1, alignSelf: 'center' }
                                        ]}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </Pressable>
                                </View>
                            </ScrollView>
                         )}
                    </Pressable>
                </Animated.View>
            </Pressable>
          )}
        </Modal>
      </View>
    </View>
  );
}

// Screenshot card with hover effect
// Reusable Phone Frame Component
function PhoneFrame({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.phoneFrame, style]}>
      {/* Side Buttons */}
      <View style={[styles.sideButton, styles.silentSwitch]} />
      <View style={[styles.sideButton, styles.volumeUp]} />
      <View style={[styles.sideButton, styles.volumeDown]} />
      <View style={[styles.sideButton, styles.powerButton]} />
      
      <View style={styles.phoneScreen}>
        {children}
      </View>
    </View>
  );
}

// Screenshot card with hover effect
function ScreenshotCard({ image, alt, description, colors, delay, onPress }: { image: any; alt: string; description?: string; colors: any; delay: number; onPress: () => void }) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.08);

  const handleHoverIn = () => {
    translateY.value = withTiming(-12, { duration: 300, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1.05, { duration: 300, easing: Easing.out(Easing.ease) });
    shadowOpacity.value = withTiming(0.25, { duration: 300 });
  };

  const handleHoverOut = () => {
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
    shadowOpacity.value = withTiming(0.08, { duration: 300 });
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
      onPress={onPress}
      {...(Platform.OS === 'web' && {
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
      })}
    >
      <Animated.View
        style={[
          styles.screenshotWrapper, // Renamed from screenshotContainer to avoid confusion
          animatedStyle,
        ]}
      >
        <PhoneFrame>
            <Image
            source={image}
            style={styles.screenshot}
            contentFit="cover"
            />
             <View style={styles.cardOverlay}>
                 <View style={styles.tapBadge}>
                     <Text style={styles.overlayText}>Tap</Text>
                 </View>
            </View>
        </PhoneFrame>
        
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
    paddingVertical: 40, // Increased to Prevent clipping on hover (scale + translate)
    paddingHorizontal: 16,
    gap: 48,
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
    overflow: 'visible', // Ensure shadows/transforms don't get clipped
  },
  screenshotWrapper: {
    alignItems: 'center',
  },
  // Phone Frame Styles
  phoneFrame: {
    width: 230,
    height: 480,
    backgroundColor: '#1a1a1a', // Dark bezel
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#4a4a4a', // Metallic frame border
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 }, // Reduced offset
    shadowOpacity: 0.15, // Much softer shadow
    shadowRadius: 30,
    elevation: 15,
    overflow: 'visible', // Allow buttons to stick out
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 38,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  sideButton: {
    position: 'absolute',
    backgroundColor: '#3a3a3a',
    width: 3,
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  silentSwitch: { top: 70, left: -7, height: 20 },
  volumeUp: { top: 110, left: -7, height: 40 },
  volumeDown: { top: 160, left: -7, height: 40 },
  powerButton: { top: 130, right: -7, height: 65, width: 3, borderTopRightRadius: 2, borderBottomRightRadius: 2, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
  
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle tint
  },
  tapBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    opacity: 0, // Hidden by default
    transform: [{ scale: 0.8 }],
  },
  overlayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  screenshot: {
    width: '100%',
    height: '100%',
  },
  screenshotLabel: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 32,
    overflow: 'hidden',
    // Removed native shadow/border in favor of clean look
  },
  modalContentDesktop: {
    flexDirection: 'row',
    width: '85%',
    maxWidth: 1100,
    height: '85%',
    backgroundColor: 'transparent', // Transparent to let phone stand out
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    boxShadow: 'none',
  },
  modalContentMobile: {
    width: '95%',
    height: '90%',
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalInner: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalContentWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  modalImageWrapperDesktop: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    transform: [{ scale: 0.9 }], 
  },
  modalImageWrapperMobile: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // Dynamic height handled inline
  },
  modalTextContainer: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    maxWidth: 500,
  },
  modalTextContainerMobile: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 24,
  },
  modalTitleMobile: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 20,
    lineHeight: 32,
    marginBottom: 40,
  },
  modalDescriptionMobile: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
