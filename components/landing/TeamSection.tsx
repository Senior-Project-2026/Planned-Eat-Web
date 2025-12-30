import { teamMembers } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ScrollReveal } from './ScrollReveal';
import { TeamMemberCard } from './TeamMemberCard';

export function TeamSection() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 768;

  return (
    <View
      id="team"
      style={[styles.section, { backgroundColor: 'transparent' }]}
    >
      <View style={styles.container}>
        {/* Section Header */}
        <ScrollReveal delay={0} translateY={30}>
          <View style={styles.header}>
            <Text style={[styles.badge, { backgroundColor: colors.surface, color: colors.primary }]}>
              👥 The Team
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Meet the Crew
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              The passionate development team bringing this project to life.
            </Text>
          </View>
        </ScrollReveal>

        {/* Team Grid */}
        <View style={[
          styles.grid,
          isDesktop && styles.gridDesktop,
          isTablet && !isDesktop && styles.gridTablet,
        ]}>
          {teamMembers.map((member, index) => (
            <ScrollReveal 
              key={member.id} 
              delay={100 + index * 150}
              translateY={50}
            >
              <TeamMemberCard
                name={member.name}
                role={member.role}
                avatar={member.avatar}
                linkedIn={member.linkedIn}
                github={member.github}
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
    gap: 28,
    alignItems: 'center',
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridDesktop: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
