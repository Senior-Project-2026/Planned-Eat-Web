import { siteInfo } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image as ExpoImage } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
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

  const isManualScroll = useRef(false);
  const scrollTimeout = useRef<any>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    isManualScroll.current = true;
    
    // Clear existing timeout
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    // Reset lock after animation
    scrollTimeout.current = setTimeout(() => {
        isManualScroll.current = false;
    }, 1000);

    if (Platform.OS === 'web') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Section with id "${sectionId}" not found`);
      }
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return; // Skip updates if scrolling manually

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Tighter detection zone (middle 20% of screen)
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
    
    // Desktop: Move down (+24) - ONLY for Desktop
    const translateY = interpolate(
      scrollValue, 
      [0, 100], 
      [0, isDesktop ? 24 : 0], 
      Extrapolation.CLAMP
    );
    
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
    const isVisible = mobileTransition.value < 0.5;
    return {
      opacity: interpolate(mobileTransition.value, [0, 0.5], [1, 0]),
      transform: [
        { translateY: interpolate(mobileTransition.value, [0, 1], [0, -20]) },
        { scale: interpolate(mobileTransition.value, [0, 1], [1, 0.9]) }
      ],
      zIndex: isVisible ? 10 : 0,
      pointerEvents: isVisible ? 'auto' : 'none', // Fix for Android touch
    };
  });

  const mobileNavPillStyle = useAnimatedStyle(() => {
    const isVisible = mobileTransition.value > 0.5;
    return {
      opacity: interpolate(mobileTransition.value, [0.5, 1], [0, 1]),
      transform: [
        { translateY: interpolate(mobileTransition.value, [0, 1], [20, 0]) },
        { scale: interpolate(mobileTransition.value, [0, 1], [0.9, 1]) }
      ],
      zIndex: isVisible ? 10 : 0,
      pointerEvents: isVisible ? 'auto' : 'none', // Fix for Android touch
    };
  });

  return (
    <View 
      style={[
        styles.headerWrapper, 
        // Mobile: use 100dvh for Android Chrome compatibility
        !isDesktop && { 
          top: 0, 
          height: Platform.OS === 'web' ? '100dvh' as any : '100%',
        } 
      ]} 
      pointerEvents="box-none"
    >
        
        {isDesktop ? (
          /* ================= DESKTOP LAYOUT (Top Floating) ================= */
          <Animated.View style={[styles.floatingRow, { marginTop: 24 }, animatedHeaderStyle]}>
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
                    item.id !== 'hero' && (
                      <Pressable key={item.id} onPress={() => scrollToSection(item.id)} style={styles.navItem}>
                        <AnimatedNavItemText scrollY={activeScrollY} label={item.label} isDark={colorScheme === 'dark'} />
                      </Pressable>
                    )
                  ))}
                </View>
              </View>
            </Animated.View>

            {/* Desktop Download Button */}
            <AnimatedButton 
              onPress={() => scrollToSection('hero')} 
              label="Get App" 
              showLabel={true}
            />
          </Animated.View>
        ) : (
          /* ================= MOBILE LAYOUT (Split Top/Bottom) ================= */
          <>
            {/* 1. Top State: Logo + Name + Icons + Large Button */}
            <Animated.View 
              style={[
                styles.floatingRow, 
                mobileLogoStyle, 
                { 
                  position: 'absolute', 
                  top: 24, 
                  justifyContent: 'center',
                  paddingHorizontal: 16,
                  width: '100%',
                  alignItems: 'center',
                }
              ]}
            >
               {/* Content Container (Logo + Name + Icons + Download) - Centered */}
               <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'center',
               }}>
                  <Pressable onPress={() => scrollToSection('hero')} style={[styles.logoBtn, { height: 48, alignItems: 'center' }]}>
                    <ExpoImage source={siteInfo.logo} style={{ width: 40, height: 40 }} contentFit="contain" />
                    <Text 
                      style={[
                        styles.navText, 
                        { 
                          fontSize: 18, 
                          fontWeight: '800', 
                          color: colorScheme === 'dark' ? '#FFF' : '#000',
                          flexShrink: 0,
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {siteInfo.name}
                    </Text>
                  </Pressable>

                   {/* Section Icons for Mobile Top View */}
                   <View style={{ flexDirection: 'row', gap: 12, marginLeft: 12, alignItems: 'center', flexShrink: 0 }}>
                      {NAV_ITEMS.map((item) => {
                         const Icon = item.icon;
                         return (
                           <Pressable key={item.id} onPress={() => scrollToSection(item.id)} hitSlop={8}>
                              <Icon size={24} color={colorScheme === 'dark' ? '#FFF' : '#000'} />
                           </Pressable>
                         );
                      })}
                  </View>

                  {/* Download Button - Now inside the centered group */}
                  <View style={{ marginLeft: 12 }}>
                    <AnimatedButton 
                      onPress={() => scrollToSection('hero')} 
                      label="Get App" 
                      showLabel={false}
                      fixedSize={48}
                    />
                  </View>
               </View>
            </Animated.View>

            {/* 2. Bottom State: Nav Pill + Large Button */}
            <Animated.View 
              style={[
                styles.floatingRow, 
                mobileNavPillStyle,
                { 
                   position: 'absolute', 
                   bottom: 24,
                   gap: 8,
                   justifyContent: 'center'
                }
              ]}
            >
               <View style={styles.mobilePillContainer}>
                  {NAV_ITEMS.map((item) => (
                    <MobileNavItem 
                      key={item.id}
                      item={item}
                      isActive={activeTab === item.id}
                      onPress={() => scrollToSection(item.id)}
                    />
                  ))}
               </View>

               {/* Large Bottom Button */}
               <AnimatedButton 
                 onPress={() => scrollToSection('hero')} 
                 label="Get App" 
                 showLabel={false}
                 fixedSize={56}
               />
            </Animated.View>
          </>
        )}
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

interface AnimatedButtonProps {
  onPress: () => void;
  label: string;
  showLabel?: boolean;
  fixedSize?: number; // Optional fixed size for mobile buttons
}

function AnimatedButton({ onPress, label, showLabel = true, fixedSize }: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const buttonStyle: any = {
    height: fixedSize ?? 56,
    width: showLabel ? 'auto' : (fixedSize ?? 56),
    paddingHorizontal: showLabel ? 20 : 0,
    borderRadius: 100, // Ensure circle when square
  };

  const iconScale = fixedSize ? (fixedSize / 56) : 1;

  return (
    <Pressable onPress={onPress} onPressIn={() => scale.value=0.95} onPressOut={() => scale.value=1}>
      <Animated.View style={[
        styles.ctaButton, 
        buttonStyle,
        { 
          transform: [{scale}],
          justifyContent: 'center',
          gap: showLabel ? 8 : 0
        }
      ]}>
         {showLabel && <Text style={styles.ctaText}>{label}</Text>}
         <View style={{ transform: [{ scale: iconScale }] }}>
            <MdFileDownload size={24} color="#FFF" />
         </View>
      </Animated.View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  headerWrapper: {
    position: 'fixed' as any,
    left: 0, right: 0, zIndex: 100,
    // Android Chrome fix: prevents jumping when address bar hides/shows
    ...(Platform.OS === 'web' && {
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      willChange: 'transform',
    }),
  },
  floatingRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
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
