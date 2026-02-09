import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../lib/theme';
import { IBPA_INFO, PARTNERS } from '../lib/constants';
import { Card } from '../components/Card';

export function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>{IBPA_INFO.name}</Text>
      <Text style={styles.subtitle}>
        An all-volunteer organization promoting the health and vitality of Downtown Irwin, Pennsylvania.
      </Text>

      <Text style={styles.sectionTitle}>Our Mission</Text>
      <Text style={styles.body}>
        The IBPA is dedicated to creating a vibrant Main Street experience for residents and visitors.
        We organize 15+ free community events annually, bringing food, entertainment, shopping, and
        togetherness to Downtown Irwin.
      </Text>
      <Text style={styles.body}>
        Downtown Irwin thrives on "entertailing" — combining retail shopping with entertainment to
        create an immersive experience. Our events drive foot traffic and create a vibrant, tight-knit
        business community.
      </Text>
      <Text style={styles.body}>
        We are a 100% volunteer-run organization with no government funding. Our events are supported
        entirely by sponsorships, business participation fees, and vendor fees.
      </Text>

      <Text style={styles.sectionTitle}>What We Do</Text>
      {[
        { icon: 'calendar' as const, title: 'Community Events', desc: '15+ free annual events including Ladies Night, Light Up Night, Cookie Tour, and more' },
        { icon: 'megaphone' as const, title: 'Business Promotion', desc: 'Marketing and promotion for downtown businesses' },
        { icon: 'people' as const, title: 'Networking', desc: 'Weekly Thursday meetings connecting business owners' },
        { icon: 'trending-up' as const, title: 'Revitalization', desc: 'Working to strengthen the Downtown Irwin corridor' },
      ].map((item) => (
        <Card key={item.title} style={styles.featureCard}>
          <View style={styles.featureRow}>
            <Ionicons name={item.icon} size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>
            </View>
          </View>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>How We're Funded</Text>
      <Card>
        {[
          { icon: 'heart' as const, label: 'Sponsorships', desc: 'Local business sponsors at various levels' },
          { icon: 'business' as const, label: 'Participation Fees', desc: 'From businesses joining events' },
          { icon: 'people' as const, label: 'Vendor Fees', desc: 'From event vendors and participants' },
        ].map((item, i) => (
          <View key={item.label} style={[styles.fundingRow, i > 0 && styles.fundingDivider]}>
            <Ionicons name={item.icon} size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.fundingLabel}>{item.label}</Text>
              <Text style={styles.fundingDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.fundingNote}>
          The IBPA receives no government funding and operates entirely through community support.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Community Partners</Text>
      {PARTNERS.map((p) => (
        <Card key={p.name} style={styles.partnerCard}>
          <View style={styles.partnerRow}>
            <Ionicons name="people" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.partnerName}>{p.name}</Text>
              <Text style={styles.partnerDesc}>{p.description}</Text>
            </View>
          </View>
        </Card>
      ))}

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  pageTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.xxl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginTop: spacing.xxl, marginBottom: spacing.md },
  body: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  featureCard: { marginBottom: spacing.sm },
  featureRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  featureTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginBottom: 2 },
  featureDesc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  fundingRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', paddingVertical: spacing.md },
  fundingDivider: { borderTopWidth: 1, borderTopColor: colors.border },
  fundingLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  fundingDesc: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  fundingNote: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    lineHeight: 16,
  },
  partnerCard: { marginBottom: spacing.sm },
  partnerRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  partnerName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  partnerDesc: { fontSize: fontSize.xs, color: colors.textSecondary },
});
