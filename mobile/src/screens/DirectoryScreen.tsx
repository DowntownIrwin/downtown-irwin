import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../lib/theme';
import { apiFetch } from '../lib/api';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { InfoRow } from '../components/InfoRow';
import { LoadingScreen } from '../components/LoadingScreen';
import type { Business } from '../lib/types';

const categories = ['All', 'Restaurant', 'Retail', 'Entertainment', 'Services', 'Health & Wellness'];

export function DirectoryScreen() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchBusinesses = useCallback(async () => {
    try {
      const data = await apiFetch<Business[]>('/api/businesses');
      setBusinesses(data);
    } catch (e) {
      console.error('Failed to fetch businesses', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBusinesses();
  }, [fetchBusinesses]);

  if (loading) return <LoadingScreen />;

  const filtered = businesses.filter((b) => {
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
    const matchesSearch = search === '' ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search businesses..."
          placeholderTextColor={colors.textTertiary}
        />
        {search !== '' && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabs}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, activeCategory === cat && styles.tabActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {filtered.length > 0 ? (
          filtered.map((biz) => (
            <Card key={biz.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Badge text={biz.category} style={{ marginBottom: spacing.xs }} />
                  <Text style={styles.bizName}>{biz.name}</Text>
                </View>
                <Ionicons name="storefront-outline" size={20} color={colors.textTertiary} />
              </View>
              <Text style={styles.bizDesc} numberOfLines={2}>{biz.description}</Text>
              <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
                <InfoRow icon="location-outline" text={biz.address} />
                {biz.phone && (
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${biz.phone}`)}>
                    <InfoRow icon="call-outline" text={biz.phone} color={colors.primary} />
                  </TouchableOpacity>
                )}
                {biz.website && (
                  <TouchableOpacity onPress={() => Linking.openURL(biz.website!)}>
                    <InfoRow icon="globe-outline" text="Visit Website" color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={40} color={colors.textTertiary} />
            <Text style={styles.emptyTitle}>No Businesses Found</Text>
            <Text style={styles.emptyText}>
              {search ? `No results for "${search}".` : `No ${activeCategory} businesses listed yet.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    margin: spacing.lg,
    marginBottom: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  tabs: {
    maxHeight: 48,
    marginTop: spacing.md,
  },
  tabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceAlt,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.white },
  list: { padding: spacing.lg, gap: spacing.md },
  card: { marginBottom: 0 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bizName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  bizDesc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginVertical: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl * 2, gap: spacing.sm },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  emptyText: { fontSize: fontSize.sm, color: colors.textSecondary },
});
