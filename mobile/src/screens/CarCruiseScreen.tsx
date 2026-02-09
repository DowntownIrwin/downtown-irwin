import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../lib/theme';
import { apiFetch } from '../lib/api';
import { CAR_CRUISE_INFO } from '../lib/constants';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import type { Sponsor } from '../lib/types';

const features = [
  { icon: 'car-sport' as const, title: 'Vehicle Display', desc: 'Classic, custom, and modern vehicles along Main Street' },
  { icon: 'trophy' as const, title: 'Awards & Trophies', desc: 'Custom awards in multiple categories' },
  { icon: 'musical-notes' as const, title: 'Live Music', desc: 'Entertainment throughout the afternoon' },
  { icon: 'restaurant' as const, title: 'Food & Vendors', desc: 'Local food vendors and restaurants' },
  { icon: 'people' as const, title: 'Community', desc: 'Thousands of enthusiasts and families' },
  { icon: 'location' as const, title: 'Downtown', desc: 'Main Street in the heart of Irwin' },
];

const schedule = [
  { time: '10:00 AM', event: 'Vehicle Check-In Opens', desc: 'Registered vehicles arrive' },
  { time: '11:30 AM', event: 'Final Setup', desc: 'All vehicles in position' },
  { time: '12:00 PM', event: 'Cruise Opens to Public', desc: 'Main Street opens for viewing' },
  { time: '12:30 PM', event: 'Live Music Begins', desc: 'Entertainment starts' },
  { time: '2:00 PM', event: 'Judging Begins', desc: 'Awards committee reviews' },
  { time: '3:30 PM', event: 'Awards Ceremony', desc: 'Trophies presented' },
  { time: '4:00 PM', event: 'Event Concludes', desc: 'Thank you for attending!' },
];

export function CarCruiseScreen({ navigation }: any) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSponsors = useCallback(async () => {
    try {
      const data = await apiFetch<Sponsor[]>('/api/sponsors');
      setSponsors(data);
    } catch (e) {
      console.error('Failed to fetch sponsors', e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchSponsors(); }, [fetchSponsors]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchSponsors(); }} tintColor={colors.primary} />}
    >
      <View style={styles.hero}>
        <Badge text="Spring 2026" variant="primary" style={{ marginBottom: spacing.md }} />
        <Text style={styles.heroTitle}>{CAR_CRUISE_INFO.name}</Text>
        <Text style={styles.heroDate}>{CAR_CRUISE_INFO.date}</Text>
        <Text style={styles.heroTime}>{CAR_CRUISE_INFO.time}</Text>
        <Text style={styles.heroLoc}>{CAR_CRUISE_INFO.location}</Text>
        <View style={styles.heroBtns}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.primaryBtnText}>Register Vehicle</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('Sponsorship')}>
            <Text style={styles.outlineBtnText}>Become a Sponsor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Event Highlights</Text>
        <Text style={styles.sectionSubtitle}>{CAR_CRUISE_INFO.description}</Text>
        <View style={styles.featureGrid}>
          {features.map((f) => (
            <Card key={f.title} style={styles.featureCard}>
              <Ionicons name={f.icon} size={22} color={colors.primary} />
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </Card>
          ))}
        </View>
      </View>

      <View style={[styles.section, styles.scheduleSection]}>
        <Text style={styles.sectionTitle}>Event Schedule</Text>
        <Text style={styles.sectionSubtitle}>{CAR_CRUISE_INFO.date}</Text>
        {schedule.map((item, i) => (
          <View key={i} style={styles.scheduleRow}>
            <View style={styles.scheduleDot}>
              <View style={styles.dot} />
              {i < schedule.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <Text style={styles.scheduleEvent}>{item.event}</Text>
              <Text style={styles.scheduleDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {sponsors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Sponsors</Text>
          <View style={styles.sponsorGrid}>
            {sponsors.map((s) => (
              <Card key={s.id} style={styles.sponsorCard}>
                <Badge text={s.level} style={{ marginBottom: spacing.xs }} />
                <Text style={styles.sponsorName}>{s.name}</Text>
              </Card>
            ))}
          </View>
        </View>
      )}

      <View style={styles.ctaBanner}>
        <Ionicons name="car-sport" size={32} color={colors.white} />
        <Text style={styles.ctaTitle}>Ready to Show Your Ride?</Text>
        <Text style={styles.ctaDesc}>
          Register your vehicle for free. All vehicle types welcome.
        </Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.white }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.primaryBtnText, { color: colors.primary }]}>Register Now</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    backgroundColor: colors.primaryDark,
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  heroDate: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  heroTime: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  heroLoc: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: spacing.xl,
  },
  heroBtns: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  outlineBtnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
  section: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  scheduleSection: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureCard: {
    width: '47%' as any,
    flexGrow: 1,
    gap: spacing.xs,
  },
  featureTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  featureDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  scheduleDot: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
  },
  scheduleContent: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  scheduleTime: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
  },
  scheduleEvent: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  scheduleDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sponsorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  sponsorCard: {
    width: '47%' as any,
    flexGrow: 1,
    alignItems: 'center',
  },
  sponsorName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  ctaBanner: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  ctaTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  ctaDesc: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
