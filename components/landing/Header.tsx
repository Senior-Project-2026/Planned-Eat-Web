import { siteInfo } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
    Extrapolation,
    SharedValue,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface HeaderProps {
  scrollY?: SharedValue<number>;
}

export function Header({ scrollY }: HeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  
  const localScrollY = useSharedValue(0);
  const activeScrollY = scrollY ?? localScrollY;

  const scrollToSection = (sectionId: string) => {
    if (Platform.OS === 'web') {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Discover', id: 'media' },
    { label: 'Team', id: 'team' },
  ];

  const animatedContainerStyle = useAnimatedStyle(() => {
    const scrollValue = activeScrollY.value;
    
    // Width interpolation: 100% (Top) to Compact Pill (Scrolled)
    const widthPercentage = interpolate(scrollValue, [0, 100], [100, isDesktop ? 60 : 80], Extrapolation.CLAMP);
    
    // Border Radius: 0 to 100
    const borderRadius = interpolate(scrollValue, [0, 100], [0, 100], Extrapolation.CLAMP);
    
    // Background Color: Transparent -> Light Green (#86EFAC)
    const backgroundColor = interpolateColor(
      scrollValue,
      [0, 100],
      ['rgba(23, 23, 23, 0)', '#86EFAC'] // Green-300
    );

    const borderColor = interpolateColor(
        scrollValue,
        [0, 100],
        ['transparent', 'rgba(255,255,255,0.4)']
    );

    return {
      width: `${widthPercentage}%`,
      borderRadius,
      backgroundColor,
      borderColor,
      borderWidth: 1,
      // Strong Glow Effect when Green
      shadowColor: '#86EFAC',
      shadowOpacity: interpolate(scrollValue, [0, 100], [0, 0.6], Extrapolation.CLAMP),
      shadowRadius: interpolate(scrollValue, [0, 100], [0, 30], Extrapolation.CLAMP),
    };
  });

  // Row Animation (Vertical Position)
  const animatedRowStyle = useAnimatedStyle(() => {
    // Top position: 0 to 24px (margin top or transform translateY)
    const translateY = interpolate(activeScrollY.value, [0, 100], [0, 24], Extrapolation.CLAMP);
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.headerWrapper} pointerEvents="box-none">
      <Animated.View style={[styles.floatingRow, animatedRowStyle]}>
        <Animated.View style={[styles.pillContainerBase, animatedContainerStyle, { overflow: 'hidden', marginRight: 12 }]}>
          
          {/* Bubble Decorations */}
          <BubbleDecoration scrollY={activeScrollY} />

          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Logo Section */}
            <Pressable onPress={() => scrollToSection('hero')} style={styles.logoBtn}>
              <Text style={styles.logoIcon}>🥗</Text>
              {isDesktop && (
                <AnimatedNavItemText 
                  scrollY={activeScrollY} 
                  label={siteInfo.name} 
                  startColor={colors.text} 
                  endColor="#000000" // Black text on Light Green background
                  fontSize={16}
                  fontWeight="700"
                />
              )}
            </Pressable>
            
            {/* Navigation - Centered */}
            {isDesktop && (
              <View style={styles.nav}>
                {navItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => scrollToSection(item.id)}
                    style={({ pressed, hovered }) => [
                      styles.navItem,
                      Platform.OS === 'web' && hovered && {
                        backgroundColor: 'rgba(0,0,0,0.05)',
                      },
                    ]}
                  >
                  <AnimatedNavItemText 
                      scrollY={activeScrollY} 
                      label={item.label} 
                      startColor={colors.text} 
                      endColor="#000000"
                    />
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </Animated.View>

        {/* Separated Button */}
        {/* Always Visible, Black Pill "Download" */}
        <AnimatedButton
            onPress={() => scrollToSection('hero')} 
            label="Download"
        />
      </Animated.View>
    </View>
  );
}

// Bubble Decoration Component
function BubbleDecoration({ scrollY }: { scrollY: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [50, 100], [0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <View style={[styles.bubble, { 
        width: 100, height: 100, borderRadius: 50, 
        backgroundColor: 'rgba(255,255,255,0.2)', 
        top: -30, left: -20 
      }]} />
      <View style={[styles.bubble, { 
        width: 60, height: 60, borderRadius: 30, 
        backgroundColor: 'rgba(255,255,255,0.15)', 
        bottom: -20, right: 40 
      }]} />
      <View style={[styles.bubble, { 
        width: 150, height: 150, borderRadius: 75, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        top: '50%', left: '50%', transform: [{ translateX: -75 }, { translateY: -75 }]
      }]} />
    </Animated.View>
  );
}

// Text color animator
function AnimatedNavItemText({ 
  scrollY, 
  label, 
  startColor, 
  endColor, 
  fontSize = 14, 
  fontWeight = '500' 
}: { 
  scrollY: SharedValue<number>, 
  label: string, 
  startColor: string, 
  endColor: string,
  fontSize?: number,
  fontWeight?: string | number
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        scrollY.value,
        [0, 100],
        [startColor, endColor]
      ),
    };
  });

  return (
    <Animated.Text style={[styles.navText, { fontSize, fontWeight: fontWeight as any }, animatedStyle]}>
      {label}
    </Animated.Text>
  );
}

// Animated CTA Button
function AnimatedButton({ onPress, label }: { onPress: () => void; label: string }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => { scale.value = withTiming(0.95, { duration: 100 }); };
  const handlePressOut = () => { scale.value = withTiming(1, { duration: 150 }); };
  const handleHoverIn = () => { scale.value = withTiming(1.05, { duration: 200 }); };
  const handleHoverOut = () => { scale.value = withTiming(1, { duration: 200 }); };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...(Platform.OS === 'web' && {
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
      })}
    >
      <Animated.View
        style={[
          styles.ctaButton,
          { 
            backgroundColor: '#000000', // Always Black
          }, 
          animatedStyle,
        ]}
      >
        <Text style={styles.ctaText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  floatingRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     marginTop: 24,
     width: '100%',
     maxWidth: 1200,
     marginHorizontal: 'auto',
  },
  pillContainerBase: {
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 0,
    // Base minWidth for when it's compact
    minWidth: 200, 
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  bubble: {
    position: 'absolute',
  },
  logoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
  },
  nav: {
    flexDirection: 'row',
    gap: 8,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    ...(Platform.OS === 'web' && {
      transition: 'all 0.2s ease',
    } as any),
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  ctaButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
