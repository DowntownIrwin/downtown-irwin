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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../lib/theme';
import { apiPost } from '../lib/api';
import { IBPA_INFO } from '../lib/constants';
import { Card } from '../components/Card';

export function ContactScreen() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || form.message.length < 10) {
      Alert.alert('Missing Fields', 'Please fill in all fields. Message must be at least 10 characters.');
      return;
    }
    setLoading(true);
    try {
      await apiPost('/api/contact', form);
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
        <Text style={styles.pageTitle}>Contact Us</Text>
        <Text style={styles.subtitle}>
          Have a question about events, sponsorship, or the community? We'd love to hear from you.
        </Text>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Linking.openURL(`tel:${IBPA_INFO.phone.replace(/[^\d]/g, '')}`)}
          >
            <View style={[styles.quickIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="call" size={22} color={colors.success} />
            </View>
            <Text style={styles.quickLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Linking.openURL(`mailto:${IBPA_INFO.email}`)}
          >
            <View style={[styles.quickIcon, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="mail" size={22} color={colors.accent} />
            </View>
            <Text style={styles.quickLabel}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => Linking.openURL('https://maps.apple.com/?q=424+Main+St+Irwin+PA')}
          >
            <View style={[styles.quickIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="location" size={22} color={colors.primary} />
            </View>
            <Text style={styles.quickLabel}>Directions</Text>
          </TouchableOpacity>
        </View>

        {submitted ? (
          <Card style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={56} color={colors.success} />
            <Text style={styles.successTitle}>Message Sent!</Text>
            <Text style={styles.successDesc}>
              Thank you for reaching out. We'll get back to you as soon as possible.
            </Text>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => {
                setSubmitted(false);
                setForm({ name: '', email: '', subject: '', message: '' });
              }}
            >
              <Text style={styles.outlineBtnText}>Send Another Message</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Send a Message</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Name *</Text>
                <TextInput style={styles.input} value={form.name} onChangeText={(v) => update('name', v)} placeholder="Your name" placeholderTextColor={colors.textTertiary} />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Email *</Text>
                <TextInput style={styles.input} value={form.email} onChangeText={(v) => update('email', v)} placeholder="you@email.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textTertiary} />
              </View>
            </View>

            <Text style={styles.label}>Subject *</Text>
            <TextInput style={[styles.input, { marginBottom: spacing.md }]} value={form.subject} onChangeText={(v) => update('subject', v)} placeholder="What's this about?" placeholderTextColor={colors.textTertiary} />

            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={form.message}
              onChangeText={(v) => update('message', v)}
              placeholder="Tell us more..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={colors.textTertiary}
            />

            <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color={colors.white} />
                  <Text style={styles.submitBtnText}>Send Message</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        <Card style={styles.meetingCard}>
          <Text style={styles.meetingTitle}>Weekly Meetings</Text>
          <View style={{ gap: spacing.sm }}>
            <View style={styles.meetingRow}>
              <Ionicons name="calendar" size={16} color={colors.primary} />
              <Text style={styles.meetingText}>{IBPA_INFO.meetingDay}</Text>
            </View>
            <View style={styles.meetingRow}>
              <Ionicons name="time" size={16} color={colors.primary} />
              <Text style={styles.meetingText}>{IBPA_INFO.meetingTime}</Text>
            </View>
            <View style={styles.meetingRow}>
              <Ionicons name="location" size={16} color={colors.primary} />
              <Text style={styles.meetingText}>{IBPA_INFO.meetingLocation}</Text>
            </View>
          </View>
        </Card>

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
  quickActions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xxl },
  quickAction: { flex: 1, alignItems: 'center', gap: spacing.sm },
  quickIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: { fontSize: fontSize.xs, fontWeight: '600', color: colors.textSecondary },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
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
  textarea: { height: 120, paddingTop: spacing.md },
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
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  outlineBtnText: { color: colors.text, fontWeight: '600', fontSize: fontSize.md },
  meetingCard: { marginTop: spacing.xxl },
  meetingTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  meetingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  meetingText: { fontSize: fontSize.sm, color: colors.textSecondary },
});
