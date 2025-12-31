import { siteInfo } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { MdExplore, MdFileDownload, MdGroup, MdHome, MdOutlineExplore, MdOutlineGroup, MdOutlineHome, MdOutlineStarBorder, MdStar } from 'react-icons/md';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

interface HeaderProps {
  scrollY?: SharedValue<number>;
}

const NAV_ITEMS = [
  { label: 'Home', id: 'hero', icon: MdOutlineHome, activeIcon: MdHome },
  { label: 'Features', id: 'features', icon: MdOutlineStarBorder, activeIcon: MdStar },
  { label: 'Discover', id: 'media', icon: MdOutlineExplore, activeIcon: MdExplore },
  { label: 'Team', id: 'team', icon: MdOutlineGroup, activeIcon: MdGroup },
];

function MobileNavItem({ item, isActive, onPress }: { item: any; isActive: boolean; onPress: () => void }) {
  const IconComponent = isActive ? item.activeIcon : item.icon;
  // ... (keep hooks the same) ...
  const progress = useDerivedValue(() => {
    return withTiming(isActive ? 1 : 0, { duration: 300 });
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', '#86EFAC']), // Transparent -> Green
      flexGrow: interpolate(progress.value, [0, 1], [0, 1]), // Expand width
      paddingHorizontal: interpolate(progress.value, [0, 1], [16, 28]), // Wider sections for icons
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [10, 0]) }, // Slide in
        { scale: progress.value } 
      ],
      // Hide completely when inactive to prevent layout shift artifacts
      width: isActive ? 'auto' : 0,
      height: isActive ? 'auto' : 0,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.mobileNavItem, animatedContainerStyle]}>
        <IconComponent 
          size={22} 
          color={isActive ? '#000000' : '#888888'} 
        />
        {isActive && (
           <Animated.Text style={[styles.mobileNavText, animatedTextStyle]} numberOfLines={1}>
             {item.label}
           </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

export function Header({ scrollY }: HeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  
  const localScrollY = useSharedValue(0);
  const activeScrollY = scrollY ?? localScrollY;
  const [activeTab, setActiveTab] = useState('hero');

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    if (Platform.OS === 'web') {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        root: null,
        // Trigger when the element is crossing the "visual center-top" area of the screen
        // -40% from top, -40% from bottom means we look at the middle 20%
        // Adjusting to -30% (top) and -50% (bottom) to favor "top-ish" elements
        rootMargin: '-30% 0px -50% 0px', 
        threshold: 0, 
      }
    );

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Header background animation
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const scrollValue = activeScrollY.value;
    const translateY = interpolate(scrollValue, [0, 100], [0, 24], Extrapolation.CLAMP);
    
    return {
      transform: [{ translateY }],
    };
  });

  // Desktop Pill Animation
  const animatedDesktopPillStyle = useAnimatedStyle(() => {
    const scrollValue = activeScrollY.value;
    const widthPercentage = interpolate(scrollValue, [0, 100], [100, 70], Extrapolation.CLAMP);
    const borderRadius = interpolate(scrollValue, [0, 100], [0, 100], Extrapolation.CLAMP);
    const backgroundColor = interpolateColor(scrollValue, [0, 100], ['rgba(23, 23, 23, 0)', '#86EFAC']);
    const shadowOpacity = interpolate(scrollValue, [0, 100], [0, 0.4], Extrapolation.CLAMP);

    return {
      width: `${widthPercentage}%`,
      borderRadius,
      backgroundColor,
      shadowOpacity,
      shadowRadius: 20,
      shadowColor: '#86EFAC',
    };
  });

  // Mobile Header Transition
  const mobileTransition = useDerivedValue(() => {
    return interpolate(activeScrollY.value, [0, 50], [0, 1], Extrapolation.CLAMP);
  });

  const mobileLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(mobileTransition.value, [0, 0.5], [1, 0]),
      transform: [
        { translateY: interpolate(mobileTransition.value, [0, 1], [0, -20]) },
        { scale: interpolate(mobileTransition.value, [0, 1], [1, 0.9]) }
      ],
      zIndex: mobileTransition.value < 0.5 ? 10 : 0, // Ensure clickable when visible
    };
  });

  const mobileNavPillStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(mobileTransition.value, [0.5, 1], [0, 1]),
      transform: [
        { translateY: interpolate(mobileTransition.value, [0, 1], [20, 0]) },
        { scale: interpolate(mobileTransition.value, [0, 1], [0.9, 1]) }
      ],
      zIndex: mobileTransition.value > 0.5 ? 10 : 0,
    };
  });

  return (
    <View style={styles.headerWrapper} pointerEvents="box-none">
      <Animated.View style={[styles.floatingRow, animatedHeaderStyle]}>
        
        {isDesktop ? (
          /* ================= DESKTOP LAYOUT ================= */
          <Animated.View style={[styles.pillContainerBase, animatedDesktopPillStyle, { marginRight: 12 }]}>
            <View style={styles.contentContainer}>
              {/* Logo */}
              <Pressable onPress={() => scrollToSection('hero')} style={styles.logoBtn}>
                <ExpoImage source={siteInfo.logo} style={styles.logoImage} contentFit="contain" />
                <AnimatedNavItemText scrollY={activeScrollY} label={siteInfo.name} fontSize={18} fontWeight="800" isDark={colorScheme === 'dark'} />
              </Pressable>
              
              {/* Nav */}
              <View style={styles.nav}>
                {NAV_ITEMS.map((item) => (
                   item.id !== 'hero' && ( // Skip Home in desktop nav list if desired, or keep it
                    <Pressable key={item.id} onPress={() => scrollToSection(item.id)} style={styles.navItem}>
                       <AnimatedNavItemText scrollY={activeScrollY} label={item.label} isDark={colorScheme === 'dark'} />
                    </Pressable>
                   )
                ))}
              </View>
            </View>
          </Animated.View>
        ) : (
          /* ================= MOBILE LAYOUT (Hybrid) ================= */
          <View style={{ marginRight: 8, height: 56, justifyContent: 'center' }}>
             {/* 1. Top State: Logo + Name (Absolute to overlap) */}
             <Animated.View style={[styles.mobileLogoContainer, mobileLogoStyle, { position: 'absolute', left: 0 }]}>
                <Pressable onPress={() => scrollToSection('hero')} style={styles.logoBtn}>
                  <ExpoImage source={siteInfo.logo} style={styles.logoImage} contentFit="contain" />
                  <Text style={[styles.navText, { fontSize: 18, fontWeight: '800', color: colorScheme === 'dark' ? '#FFF' : '#000' }]}>
                    {siteInfo.name}
                  </Text>
                </Pressable>

                 {/* Section Icons for Mobile Top View */}
                 <View style={{ flexDirection: 'row', gap: 12, marginLeft: 16, alignItems: 'center' }}>
                    {NAV_ITEMS.map((item) => {
                       const Icon = item.icon;
                       return (
                         <Pressable key={item.id} onPress={() => scrollToSection(item.id)}>
                            <Icon size={20} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                         </Pressable>
                       );
                    })}
                </View>
             </Animated.View>

             {/* 2. Scroll State: Nav Pill */}
             <Animated.View style={[styles.mobilePillContainer, mobileNavPillStyle]}>
                {NAV_ITEMS.map((item) => (
                  <MobileNavItem 
                    key={item.id}
                    item={item}
                    isActive={activeTab === item.id}
                    onPress={() => scrollToSection(item.id)}
                  />
                ))}
             </Animated.View>
          </View>
        )}

        {/* Download Button (Always Visible) */}
        <AnimatedButton 
          onPress={() => scrollToSection('hero')} 
          label="Get App" 
          showLabel={isDesktop}
        />

      </Animated.View>
    </View>
  );
}

// ------------------------------------------------------------------
// Helper Components (Reused/Simplified)
// ------------------------------------------------------------------

function AnimatedNavItemText({ scrollY, label, fontSize = 14, fontWeight = '500', isDark = false }: any) {
  const style = useAnimatedStyle(() => ({
     color: interpolateColor(scrollY.value, [0, 100], [isDark ? '#FFFFFF' : '#000000', '#000000']),
  }));
  return <Animated.Text style={[styles.navText, { fontSize, fontWeight }, style]}>{label}</Animated.Text>;
}

function AnimatedButton({ onPress, label, showLabel = true }: { onPress: () => void; label: string; showLabel?: boolean }) {
  const scale = useSharedValue(1);
  return (
    <Pressable onPress={onPress} onPressIn={() => scale.value=0.95} onPressOut={() => scale.value=1}>
      <Animated.View style={[
        styles.ctaButton, 
        { 
          transform: [{scale}],
          paddingHorizontal: showLabel ? 20 : 0, 
          width: showLabel ? 'auto' : 56, 
          justifyContent: 'center',
          gap: showLabel ? 8 : 0
        }
      ]}>
         {showLabel && <Text style={styles.ctaText}>{label}</Text>}
         <MdFileDownload size={24} color="#FFF" />
      </Animated.View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  headerWrapper: {
    position: 'fixed' as any,
    top: 0, left: 0, right: 0, zIndex: 100,
  },
  floatingRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 24,
     width: '100%',
     maxWidth: 1200,
     marginHorizontal: 'auto',
     paddingHorizontal: 16,
  },
  
  // Desktop Pill
  pillContainerBase: {
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    ...(Platform.OS === 'web' && { backdropFilter: 'blur(20px)' }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    width: '100%',
  },
  nav: { flexDirection: 'row', gap: 16 },
  navItem: { paddingVertical: 8, paddingHorizontal: 12 },
  
  // Mobile Pill
  mobilePillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Dark pill background
    borderRadius: 100,
    padding: 6,
    height: 56, // Fixed height for mobile nav
    minWidth: 200, // Ensure it has some width for the icons
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  mobileLogoContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 28,
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    gap: 6,
    // overflow: 'hidden', // Mask text when expanding
  },
  mobileNavText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },

  // Common
  logoBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoImage: { width: 32, height: 32, borderRadius: 8 },
  navText: { fontSize: 14 },
  
  // CTA
  ctaButton: {
    height: 56, // Match mobile pill height for symmetry
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 100,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});
