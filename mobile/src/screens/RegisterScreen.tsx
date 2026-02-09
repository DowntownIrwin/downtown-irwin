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
import { CAR_CRUISE_INFO, VEHICLE_CLASSES } from '../lib/constants';
import { Card } from '../components/Card';
import { InfoRow } from '../components/InfoRow';

export function RegisterScreen({ navigation }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showClassPicker, setShowClassPicker] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    vehicleClass: '',
    specialRequests: '',
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone ||
        !form.vehicleYear || !form.vehicleMake || !form.vehicleModel ||
        !form.vehicleColor || !form.vehicleClass) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await apiPost('/api/vehicle-registrations', form);
      setSubmitted(true);
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <Card style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.successTitle}>You're Registered!</Text>
          <Text style={styles.successDesc}>
            Your vehicle has been registered for the {CAR_CRUISE_INFO.name}.
          </Text>
          <Text style={styles.successDate}>{CAR_CRUISE_INFO.date}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('CarCruise')}>
            <Text style={styles.primaryBtnText}>Back to Car Cruise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => {
              setSubmitted(false);
              setForm({
                firstName: '', lastName: '', email: '', phone: '',
                vehicleYear: '', vehicleMake: '', vehicleModel: '',
                vehicleColor: '', vehicleClass: '', specialRequests: '',
              });
            }}
          >
            <Text style={styles.outlineBtnText}>Register Another</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Ionicons name="car-sport" size={18} color={colors.primary} />
            <Text style={styles.headerBadge}>Free Registration</Text>
          </View>
          <View style={{ gap: spacing.xs, marginTop: spacing.md }}>
            <InfoRow icon="calendar-outline" text={CAR_CRUISE_INFO.date} color={colors.primary} />
            <InfoRow icon="time-outline" text={CAR_CRUISE_INFO.time} color={colors.primary} />
            <InfoRow icon="location-outline" text={CAR_CRUISE_INFO.location} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.formSectionTitle}>Owner Information</Text>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput style={styles.input} value={form.firstName} onChangeText={(v) => update('firstName', v)} placeholder="John" placeholderTextColor={colors.textTertiary} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput style={styles.input} value={form.lastName} onChangeText={(v) => update('lastName', v)} placeholder="Smith" placeholderTextColor={colors.textTertiary} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Email *</Text>
            <TextInput style={styles.input} value={form.email} onChangeText={(v) => update('email', v)} placeholder="john@email.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textTertiary} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Phone *</Text>
            <TextInput style={styles.input} value={form.phone} onChangeText={(v) => update('phone', v)} placeholder="(724) 555-0123" keyboardType="phone-pad" placeholderTextColor={colors.textTertiary} />
          </View>
        </View>

        <View style={styles.divider} />
        <Text style={styles.formSectionTitle}>Vehicle Information</Text>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Year *</Text>
            <TextInput style={styles.input} value={form.vehicleYear} onChangeText={(v) => update('vehicleYear', v)} placeholder="1969" keyboardType="number-pad" placeholderTextColor={colors.textTertiary} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Make *</Text>
            <TextInput style={styles.input} value={form.vehicleMake} onChangeText={(v) => update('vehicleMake', v)} placeholder="Chevrolet" placeholderTextColor={colors.textTertiary} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Model *</Text>
            <TextInput style={styles.input} value={form.vehicleModel} onChangeText={(v) => update('vehicleModel', v)} placeholder="Camaro" placeholderTextColor={colors.textTertiary} />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Color *</Text>
            <TextInput style={styles.input} value={form.vehicleColor} onChangeText={(v) => update('vehicleColor', v)} placeholder="Red" placeholderTextColor={colors.textTertiary} />
          </View>
        </View>

        <Text style={styles.label}>Vehicle Class *</Text>
        <TouchableOpacity style={styles.select} onPress={() => setShowClassPicker(!showClassPicker)}>
          <Text style={form.vehicleClass ? styles.selectText : styles.selectPlaceholder}>
            {form.vehicleClass || 'Select a class'}
          </Text>
          <Ionicons name={showClassPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textTertiary} />
        </TouchableOpacity>
        {showClassPicker && (
          <Card style={styles.pickerCard}>
            {VEHICLE_CLASSES.map((vc) => (
              <TouchableOpacity
                key={vc}
                style={[styles.pickerItem, form.vehicleClass === vc && styles.pickerItemActive]}
                onPress={() => { update('vehicleClass', vc); setShowClassPicker(false); }}
              >
                <Text style={[styles.pickerItemText, form.vehicleClass === vc && styles.pickerItemTextActive]}>
                  {vc}
                </Text>
                {form.vehicleClass === vc && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </Card>
        )}

        <View style={styles.divider} />
        <Text style={styles.label}>Special Requests (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={form.specialRequests}
          onChangeText={(v) => update('specialRequests', v)}
          placeholder="Any special requirements..."
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
              <Ionicons name="car-sport" size={18} color={colors.white} />
              <Text style={styles.submitBtnText}>Register Vehicle</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  header: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerBadge: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primary },
  formSectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
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
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },
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
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg, backgroundColor: colors.background },
  successCard: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxxl },
  successTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  successDesc: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' },
  successDate: { fontSize: fontSize.sm, color: colors.textTertiary },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.white, fontWeight: '600', fontSize: fontSize.md },
  outlineBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  outlineBtnText: { color: colors.text, fontWeight: '600', fontSize: fontSize.md },
});
