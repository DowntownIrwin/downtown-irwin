import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../lib/theme';
import { apiFetch } from '../lib/api';
import { IBPA_INFO, CAR_CRUISE_INFO } from '../lib/constants';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { InfoRow } from '../components/InfoRow';
import { LoadingScreen } from '../components/LoadingScreen';
import type { Event, Business } from '../lib/types';

export function HomeScreen({ navigation }: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [evts, bizs] = await Promise.all([
        apiFetch<Event[]>('/api/events'),
        apiFetch<Business[]>('/api/businesses'),
      ]);
      setEvents(evts);
      setBusinesses(bizs);
    } catch (e) {
      console.error('Failed to fetch data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingScreen />;

  const featured = events.filter((e) => e.featured).slice(0, 3);
  const topBusinesses = businesses.slice(0, 4);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.hero}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTag}>Community Driven</Text>
          <Text style={styles.heroTitle}>Downtown{'\n'}Irwin</Text>
          <Text style={styles.heroLocation}>Pennsylvania</Text>
          <Text style={styles.heroDesc}>
            {IBPA_INFO.tagline}. Enjoy 15+ free community events annually.
          </Text>
          <View style={styles.heroBtns}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Events')}>
              <Text style={styles.primaryBtnText}>Explore Events</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate('CarCruise')}>
              <Ionicons name="car-sport" size={16} color={colors.white} />
              <Text style={styles.outlineBtnText}>Car Cruise 2026</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cruiseBanner}
        onPress={() => navigation.navigate('CarCruise')}
        activeOpacity={0.8}
      >
        <View style={styles.cruiseBannerInner}>
          <View style={styles.cruiseBannerIcon}>
            <Ionicons name="car-sport" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cruiseBannerTitle}>{CAR_CRUISE_INFO.name}</Text>
            <Text style={styles.cruiseBannerDate}>{CAR_CRUISE_INFO.date}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </View>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        {[
          { icon: 'calendar' as const, value: '15+', label: 'Events' },
          { icon: 'people' as const, value: '1K+', label: 'Attendees' },
          { icon: 'storefront' as const, value: '50+', label: 'Businesses' },
          { icon: 'heart' as const, value: '100%', label: 'Volunteer' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statItem}>
            <Ionicons name={stat.icon} size={20} color={colors.primary} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {featured.map((event) => (
          <Card key={event.id} style={styles.eventCard}>
            <Badge text={event.category} />
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
              <InfoRow icon="calendar-outline" text={event.date} />
              <InfoRow icon="time-outline" text={event.time} />
              <InfoRow icon="location-outline" text={event.location} />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Local Businesses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Directory')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {topBusinesses.map((biz) => (
          <Card key={biz.id} style={styles.bizCard}>
            <View style={styles.bizHeader}>
              <View style={{ flex: 1 }}>
                <Badge text={biz.category} style={{ marginBottom: spacing.xs }} />
                <Text style={styles.bizName}>{biz.name}</Text>
              </View>
              <Ionicons name="storefront-outline" size={20} color={colors.textTertiary} />
            </View>
            <Text style={styles.bizDesc} numberOfLines={2}>{biz.description}</Text>
            <InfoRow icon="location-outline" text={biz.address} />
          </Card>
        ))}
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
    minHeight: 280,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl + spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroTag: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: fontSize.hero,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 40,
    marginBottom: spacing.xs,
  },
  heroLocation: {
    fontSize: fontSize.lg,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  heroDesc: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  cruiseBanner: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cruiseBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  cruiseBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cruiseBannerTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  cruiseBannerDate: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  seeAll: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  eventCard: {
    marginBottom: spacing.md,
  },
  eventTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.sm,
  },
  bizCard: {
    marginBottom: spacing.md,
  },
  bizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bizName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  bizDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginVertical: spacing.sm,
    lineHeight: 20,
  },
});
