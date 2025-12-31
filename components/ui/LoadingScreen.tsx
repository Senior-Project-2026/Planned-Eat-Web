import { siteInfo } from "@/constants/data";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, useWindowDimensions } from "react-native";

export interface ProfessionalLoadingScreenProps {
  title?: string;
  subtitle?: string;
}

/**
 * Professional Loading Screen Component with smooth animations
 * Responsive and adapted to use app theme and logo
 */
export function LoadingScreen({
  title = "Loading Your Experience",
  subtitle = "Preparing delicious content...",
}: ProfessionalLoadingScreenProps) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const themeColors = Colors[colorScheme];

  // Responsive dimensions
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const logoSize = isMobile ? 80 : 120;
  const logoIconSize = isMobile ? 50 : 70;
  const titleSize = isMobile ? 18 : 24;
  const subtitleSize = isMobile ? 13 : 16;
  const padding = isMobile ? 24 : 48;

  useEffect(() => {
    // Spinning animation for the container/background effect
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [spinValue, pulseValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.professionalLoadingContainer, { backgroundColor: isDark ? '#000000' : Colors.light.background }]}> 
      <View style={[styles.loadingContent, { padding }]}>
        <Animated.View
          style={[
            styles.loadingIconContainer,
            {
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize / 2,
              transform: [{ scale: pulseValue }],
              backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
              shadowColor: themeColors.primary,
              shadowOpacity: 0.3,
            },
          ]}
        >
          <Image
            source={siteInfo.logo}
            style={{ width: logoIconSize, height: logoIconSize }}
            contentFit="contain"
          />
        </Animated.View>
        
        <Text style={[styles.loadingTitle, { color: themeColors.text, fontSize: titleSize }]}>{title}</Text>
        <Text style={[styles.loadingSubtitle, { color: isDark ? '#A1A1AA' : '#6B7280', fontSize: subtitleSize }]}>{subtitle}</Text>
        
        <View style={styles.loadingDotsContainer}>
          <Animated.View
            style={[
              styles.loadingDot,
              {
                opacity: pulseValue,
                backgroundColor: themeColors.primary,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: themeColors.primary,
                opacity: pulseValue.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.3, 1],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              {
                backgroundColor: themeColors.primary,
                opacity: pulseValue.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.6, 0.3],
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  professionalLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  loadingTitle: {
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSubtitle: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  loadingDotsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
