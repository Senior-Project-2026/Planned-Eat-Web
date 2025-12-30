/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Inspired by Priot.io design with deep charcoal backgrounds and vibrant accents.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FAFAFA',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Landing page colors
    primary: '#22C55E',
    primaryDark: '#16A34A',
    secondary: '#10B981',
    accent: '#059669',
    surface: '#F0FDF4',
    surfaceAlt: '#ECFDF5',
    muted: '#6B7280',
    mutedLight: '#9CA3AF',
    border: '#E5E7EB',
    cardBg: '#FFFFFF',
    heroGradientStart: '#F0FDF4',
    heroGradientEnd: '#FFFFFF',
    // Glow colors
    glowPrimary: 'rgba(34, 197, 94, 0.15)',
    glowSecondary: 'rgba(16, 185, 129, 0.12)',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0D0D0D', // Deeper charcoal like Priot
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Landing page colors (dark mode) - Priot inspired
    primary: '#4ADE80', // Brighter, more vibrant green
    primaryDark: '#22C55E',
    secondary: '#34D399',
    accent: '#10B981',
    surface: '#171717', // Slightly lighter than bg
    surfaceAlt: '#1A1A1A',
    muted: '#A1A1AA',
    mutedLight: '#71717A',
    border: '#27272A',
    cardBg: '#171717',
    heroGradientStart: '#0D0D0D',
    heroGradientEnd: '#0D0D0D',
    // Glow colors - Priot style blue/teal lateral glows
    glowLeft: 'rgba(59, 130, 246, 0.25)', // Blue glow
    glowRight: 'rgba(20, 184, 166, 0.20)', // Teal glow
    glowPrimary: 'rgba(74, 222, 128, 0.15)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    // Adding Poppins as primary font like Priot.io
    sans: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

