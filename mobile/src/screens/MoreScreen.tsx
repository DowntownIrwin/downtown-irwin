import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../lib/theme';
import { IBPA_INFO, PARTNERS } from '../lib/constants';
import { Card } from '../components/Card';
import { InfoRow } from '../components/InfoRow';

export function MoreScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>More</Text>

      <View style={styles.navSection}>
        {[
          { icon: 'hand-left' as const, label: 'Sponsorship', screen: 'Sponsorship', color: colors.primary },
          { icon: 'mail' as const, label: 'Contact Us', screen: 'Contact', color: colors.accent },
          { icon: 'information-circle' as const, label: 'About IBPA', screen: 'About', color: colors.textSecondary },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.navIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={styles.navLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Contact Information</Text>
      <Card>
        <View style={{ gap: spacing.lg }}>
          <TouchableOpacity onPress={() => Linking.openURL('https://maps.apple.com/?q=424+Main+St+Irwin+PA')}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="location" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>{IBPA_INFO.address}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${IBPA_INFO.phone.replace(/[^\d]/g, '')}`)}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="call" size={18} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{IBPA_INFO.phone}</Text>
                <Text style={styles.contactSub}>{IBPA_INFO.altPhone}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${IBPA_INFO.email}`)}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: colors.accent + '15' }]}>
                <Ionicons name="mail" size={18} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{IBPA_INFO.email}</Text>
                <Text style={styles.contactSub}>Events: {IBPA_INFO.eventsEmail}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Weekly Meetings</Text>
      <Card>
        <View style={{ gap: spacing.sm }}>
          <InfoRow icon="calendar" text={IBPA_INFO.meetingDay} color={colors.primary} />
          <InfoRow icon="time" text={IBPA_INFO.meetingTime} color={colors.primary} />
          <InfoRow icon="location" text={IBPA_INFO.meetingLocation} color={colors.primary} />
        </View>
        <Text style={styles.meetingNote}>
          Meetings are occasionally on Zoom. New members should RSVP to confirm the format.
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

      <Text style={styles.footer}>
        {IBPA_INFO.tagline}. An all-volunteer organization — 100% community funded.
      </Text>

      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  pageTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.xl },
  navSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xxl,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLabel: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  contactRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: { fontSize: fontSize.xs, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  contactValue: { fontSize: fontSize.md, fontWeight: '500', color: colors.text, marginTop: 2 },
  contactSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  meetingNote: {
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
  footer: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xxl,
    lineHeight: 18,
  },
});
