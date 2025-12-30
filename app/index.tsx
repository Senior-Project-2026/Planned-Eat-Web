import {
    AnimatedBackground,
    FeaturesSection,
    Footer,
    Header,
    HeroSection,
    MediaGallerySection,
    SectionTransition,
    TeamSection,
} from '@/components/landing';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';

export default function LandingPage() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  // Shared scroll value for header animation
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Background Blobs */}
      <AnimatedBackground scrollY={scrollY} />
      
      {/* Fixed Header with scroll-aware glassmorphism */}
      <Header scrollY={scrollY} />
      
      {/* Main Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <HeroSection scrollY={scrollY} />
        
        <SectionTransition variant="fade-scale">
          <FeaturesSection />
        </SectionTransition>
        
        <SectionTransition variant="fade-up">
          <MediaGallerySection />
        </SectionTransition>
        
        <SectionTransition variant="zoom-fade">
          <TeamSection />
        </SectionTransition>
        
        <SectionTransition variant="fade-up">
          <Footer />
        </SectionTransition>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
