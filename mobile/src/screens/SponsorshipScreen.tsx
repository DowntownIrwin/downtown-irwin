import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../lib/theme';
import { apiPost } from '../lib/api';
import { SPONSORSHIP_LEVELS, IBPA_INFO } from '../lib/constants';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

const levelIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Presenting Sponsor': 'ribbon',
  'Gold Sponsor': 'medal',
  'Silver Sponsor': 'shield',
  'Supporting Sponsor': 'heart',
  'Custom Trophy Recognition Partner': 'trophy',
};

export function SponsorshipScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    level: '',
    message: '',
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!form.businessName || !form.contactName || !form.email || !form.phone || !form.level) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await apiPost('/api/sponsorship-inquiries', form);
      setSubmitted(true);
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Sponsorship</Text>
        <Text style={styles.subtitle}>
          Support the community and gain visibility with thousands of attendees.
        </Text>

        <Text style={styles.sectionTitle}>Sponsorship Levels</Text>
        {SPONSORSHIP_LEVELS.map((level) => {
          const iconName = levelIcons[level.name] || 'star';
          return (
            <Card key={level.name} style={[styles.levelCard, level.tag === 'Best Value' && styles.levelCardHighlight]}>
              {level.tag ? <Badge text={level.tag} variant="primary" style={{ marginBottom: spacing.sm }} /> : null}
              <View style={styles.levelHeader}>
                <Ionicons name={iconName} size={22} color={colors.primary} />
                <Text style={styles.levelName}>{level.name}</Text>
              </View>
              <Text style={styles.levelPrice}>
                ${level.price}
                <Text style={styles.levelPriceSub}> per event</Text>
              </Text>
              {level.perks.map((perk, i) => (
                <View key={i} style={styles.perkRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </Card>
          );
        })}

        <View style={styles.divider} />

        {submitted ? (
          <Card style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
            <Text style={styles.successTitle}>Thank You!</Text>
            <Text style={styles.successDesc}>
              Your sponsorship inquiry has been submitted. Our team will contact you soon.
            </Text>
            <Text style={styles.successEmail}>
              Questions? Email {IBPA_INFO.eventsEmail}
            </Text>
          </Card>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Interested in Sponsoring?</Text>
            <Text style={styles.formSubtitle}>Fill out the form and our team will be in touch.</Text>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Business Name *</Text>
                <TextInput style={styles.input} value={form.businessName} onChangeText={(v) => update('businessName', v)} placeholder="Your Business" placeholderTextColor={colors.textTertiary} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Contact Name *</Text>
                <TextInput style={styles.input} value={form.contactName} onChangeText={(v) => update('contactName', v)} placeholder="Jane Smith" placeholderTextColor={colors.textTertiary} />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Email *</Text>
                <TextInput style={styles.input} value={form.email} onChangeText={(v) => update('email', v)} placeholder="email@biz.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textTertiary} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput style={styles.input} value={form.phone} onChangeText={(v) => update('phone', v)} placeholder="(724) 555-0123" keyboardType="phone-pad" placeholderTextColor={colors.textTertiary} />
              </View>
            </View>

            <Text style={styles.label}>Sponsorship Level *</Text>
            <TouchableOpacity style={styles.select} onPress={() => setShowLevelPicker(!showLevelPicker)}>
              <Text style={form.level ? styles.selectText : styles.selectPlaceholder}>
                {form.level || 'Select a level'}
              </Text>
              <Ionicons name={showLevelPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
            </TouchableOpacity>
            {showLevelPicker && (
              <Card style={styles.pickerCard}>
                {SPONSORSHIP_LEVELS.map((l) => (
                  <TouchableOpacity
                    key={l.name}
                    style={[styles.pickerItem, form.level === l.name && styles.pickerItemActive]}
                    onPress={() => { update('level', l.name); setShowLevelPicker(false); }}
                  >
                    <Text style={[styles.pickerItemText, form.level === l.name && styles.pickerItemTextActive]}>
                      {l.name} — ${l.price}
                    </Text>
                    {form.level === l.name && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                  </TouchableOpacity>
                ))}
              </Card>
            )}

            <Text style={styles.label}>Message (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={form.message}
              onChangeText={(v) => update('message', v)}
              placeholder="Questions or requests..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={colors.textTertiary}
            />

            <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Ionicons name="mail" size={18} color={colors.white} />
                  <Text style={styles.submitBtnText}>Submit Inquiry</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  pageTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  formSubtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.xl },
  levelCard: { marginBottom: spacing.md },
  levelCardHighlight: { borderColor: colors.primary },
  levelHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  levelName: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  levelPrice: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  levelPriceSub: { fontSize: fontSize.sm, fontWeight: '400', color: colors.textSecondary },
  perkRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginBottom: spacing.xs },
  perkText: { fontSize: fontSize.sm, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xxl },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  halfField: { flex: 1 },
  label: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  textarea: { height: 100, paddingTop: spacing.md },
  select: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  selectText: { fontSize: fontSize.md, color: colors.text },
  selectPlaceholder: { fontSize: fontSize.md, color: colors.textTertiary },
  pickerCard: { padding: 0, marginBottom: spacing.md },
  pickerItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerItemActive: { backgroundColor: colors.surfaceAlt },
  pickerItemText: { fontSize: fontSize.sm, color: colors.text },
  pickerItemTextActive: { fontWeight: '600', color: colors.primary },
  submitBtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: colors.white, fontWeight: '700', fontSize: fontSize.md },
  successCard: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  successTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  successDesc: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  successEmail: { fontSize: fontSize.xs, color: colors.textTertiary },
});
