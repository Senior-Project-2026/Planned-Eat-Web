import { features } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FeatureCard } from './FeatureCard';
import { ScrollReveal } from './ScrollReveal';

export function FeaturesSection() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  return (
    <View
      id="features"
      style={[styles.section, { backgroundColor: 'transparent' }]}
    >
      <View style={styles.container}>
        {/* Section Header */}
        <ScrollReveal delay={0} translateY={30}>
          <View style={styles.header}>
            <Text style={[styles.badge, { backgroundColor: colors.surface, color: colors.primary }]}>
              ⚡ Features
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Key to Healthy Living
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Transform your eating habits and reach your goals with Planned-Eat.
            </Text>
          </View>
        </ScrollReveal>

        {/* Bento Grid */}
        <View style={[
          styles.grid,
          isDesktop && styles.gridDesktop,
          isTablet && !isDesktop && styles.gridTablet,
        ]}>
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.id} 
              delay={100 + index * 100}
              translateY={40}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            </ScrollReveal>
          ))}
        </View>
      </View>
    </View>
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
  grid: {
    flexDirection: 'column',
    gap: 24, // Increased gap slightly
    alignItems: 'center', // Center cards on mobile
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center cards on tablet
  },
  gridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center cards on desktop
  },
});
