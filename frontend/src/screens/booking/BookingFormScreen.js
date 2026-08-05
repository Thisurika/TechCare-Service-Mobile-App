import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { bookingsAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS } from '../../theme/colors';

const BookingFormScreen = ({ navigation, route }) => {
  const { service } = route.params;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [serviceMethod, setServiceMethod] = useState('pickup');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM',
  ];

  const getDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      });
    }
    return dates;
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!deviceBrand.trim() || !deviceModel.trim()) {
          Alert.alert('Error', 'Please enter device brand and model');
          return false;
        }
        return true;
      case 2:
        if (!issueDescription.trim() || issueDescription.length < 10) {
          Alert.alert('Error', 'Please describe the issue (at least 10 characters)');
          return false;
        }
        return true;
      case 3:
        if (serviceMethod === 'pickup' && (!street.trim() || !city.trim())) {
          Alert.alert('Error', 'Please enter your pickup address');
          return false;
        }
        return true;
      case 4:
        if (!scheduledDate || !scheduledTime) {
          Alert.alert('Error', 'Please select a date and time slot');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const bookingData = {
        service: service._id,
        deviceBrand,
        deviceModel,
        issueDescription,
        serviceMethod,
        address: serviceMethod === 'pickup' ? { street, city, state, zipCode } : {},
        scheduledDate: new Date(scheduledDate).toISOString(),
        scheduledTime,
      };

      await bookingsAPI.create(bookingData);

      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your repair request for ${deviceBrand} ${deviceModel} has been submitted successfully!`,
        [
          {
            text: 'View Bookings',
            onPress: () => {
              navigation.popToTop();
              navigation.navigate('Bookings');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((s) => (
        <View key={s} style={styles.stepRow}>
          <View
            style={[
              styles.stepDot,
              s <= step ? styles.stepDotActive : {},
              s < step ? styles.stepDotCompleted : {},
            ]}
          >
            <Text style={styles.stepDotText}>
              {s < step ? '✓' : s}
            </Text>
          </View>
          {s < 4 && (
            <View style={[styles.stepLine, s < step ? styles.stepLineActive : {}]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>📱 Device Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your device</Text>

      <View style={styles.serviceInfo}>
        <Text style={styles.serviceInfoLabel}>Selected Service</Text>
        <Text style={styles.serviceInfoValue}>{service.name}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Device Brand *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Samsung, Apple, LG"
          placeholderTextColor={COLORS.textMuted}
          value={deviceBrand}
          onChangeText={setDeviceBrand}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Device Model *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Galaxy S24, MacBook Pro"
          placeholderTextColor={COLORS.textMuted}
          value={deviceModel}
          onChangeText={setDeviceModel}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>🔍 Issue Details</Text>
      <Text style={styles.stepSubtitle}>Describe the problem</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Describe the Issue *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Please describe the issue you're experiencing in detail..."
          placeholderTextColor={COLORS.textMuted}
          value={issueDescription}
          onChangeText={setIssueDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{issueDescription.length} / 500</Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>🚚 Service Method</Text>
      <Text style={styles.stepSubtitle}>How would you like to proceed?</Text>

      <View style={styles.methodOptions}>
        <TouchableOpacity
          style={[
            styles.methodOption,
            serviceMethod === 'pickup' && styles.methodOptionActive,
          ]}
          onPress={() => setServiceMethod('pickup')}
        >
          <Text style={styles.methodEmoji}>🚚</Text>
          <Text
            style={[
              styles.methodLabel,
              serviceMethod === 'pickup' && styles.methodLabelActive,
            ]}
          >
            Home Pickup
          </Text>
          <Text style={styles.methodDesc}>We pick up from your doorstep</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodOption,
            serviceMethod === 'drop-off' && styles.methodOptionActive,
          ]}
          onPress={() => setServiceMethod('drop-off')}
        >
          <Text style={styles.methodEmoji}>📍</Text>
          <Text
            style={[
              styles.methodLabel,
              serviceMethod === 'drop-off' && styles.methodLabelActive,
            ]}
          >
            Drop-off
          </Text>
          <Text style={styles.methodDesc}>Visit our service center</Text>
        </TouchableOpacity>
      </View>

      {serviceMethod === 'pickup' && (
        <View style={styles.addressSection}>
          <Text style={styles.addressTitle}>📍 Pickup Address</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter street address"
              placeholderTextColor={COLORS.textMuted}
              value={street}
              onChangeText={setStreet}
            />
          </View>
          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor={COLORS.textMuted}
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Zip Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Zip"
                placeholderTextColor={COLORS.textMuted}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>📅 Schedule</Text>
      <Text style={styles.stepSubtitle}>Pick a convenient date and time</Text>

      <Text style={styles.sectionLabel}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {getDateOptions().map((date) => (
          <TouchableOpacity
            key={date.value}
            style={[
              styles.dateCard,
              scheduledDate === date.value && styles.dateCardActive,
            ]}
            onPress={() => setScheduledDate(date.value)}
          >
            <Text
              style={[
                styles.dateText,
                scheduledDate === date.value && styles.dateTextActive,
              ]}
            >
              {date.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Select Time Slot</Text>
      {timeSlots.map((slot) => (
        <TouchableOpacity
          key={slot}
          style={[
            styles.timeSlot,
            scheduledTime === slot && styles.timeSlotActive,
          ]}
          onPress={() => setScheduledTime(slot)}
        >
          <Text style={styles.timeSlotEmoji}>🕐</Text>
          <Text
            style={[
              styles.timeSlotText,
              scheduledTime === slot && styles.timeSlotTextActive,
            ]}
          >
            {slot}
          </Text>
          {scheduledTime === slot && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
      ))}

      {/* Booking Summary */}
      {scheduledDate && scheduledTime && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>📋 Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{service.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Device</Text>
            <Text style={styles.summaryValue}>{deviceBrand} {deviceModel}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Method</Text>
            <Text style={styles.summaryValue}>
              {serviceMethod === 'pickup' ? '🚚 Home Pickup' : '📍 Drop-off'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{scheduledDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{scheduledTime}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryLabel}>Est. Price</Text>
            <Text style={[styles.summaryValue, { color: COLORS.secondary }]}>
              LKR {service.estimatedPrice?.min?.toLocaleString()} - {service.estimatedPrice?.max?.toLocaleString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderStepIndicator()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, step === 1 && { flex: 1 }, loading && { opacity: 0.7 }]}
          onPress={step === 4 ? handleSubmit : handleNext}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.nextButtonText}>
              {step === 4 ? 'Confirm Booking ✓' : 'Next →'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: SIZES.paddingLg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
  },
  stepDotActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  stepDotCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.glassBorder,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  stepContent: {
    paddingHorizontal: SIZES.paddingLg,
  },
  stepTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  serviceInfo: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  serviceInfoLabel: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  serviceInfoValue: {
    fontSize: SIZES.base,
    color: COLORS.white,
    fontWeight: '700',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: SIZES.base,
    color: COLORS.white,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
  },
  methodOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  methodOption: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
  },
  methodOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  methodEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  methodLabel: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  methodLabelActive: {
    color: COLORS.white,
  },
  methodDesc: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  addressSection: {
    marginTop: 10,
  },
  addressTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 12,
  },
  dateScroll: {
    marginBottom: 10,
  },
  dateCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  dateCardActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  dateText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dateTextActive: {
    color: COLORS.primary,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  timeSlotActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  timeSlotEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  timeSlotText: {
    flex: 1,
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  timeSlotTextActive: {
    color: COLORS.white,
  },
  checkMark: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '700',
  },
  summary: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  summaryTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  summaryTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: SIZES.md,
    color: COLORS.textMuted,
  },
  summaryValue: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
    maxWidth: '60%',
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: 12,
    ...SHADOWS.large,
  },
  backButton: {
    flex: 0.4,
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.radius,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  backButtonText: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  nextButton: {
    flex: 0.6,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 14,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  nextButtonText: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default BookingFormScreen;
