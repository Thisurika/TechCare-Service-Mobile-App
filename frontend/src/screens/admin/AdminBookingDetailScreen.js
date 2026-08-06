import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SHADOWS, getStatusColor } from '../../theme/colors';
import { adminAPI } from '../../api/api';

const STATUSES = [
  'received',
  'confirmed',
  'assigned',
  'picked-up',
  'under-repair',
  'ready',
  'completed',
  'cancelled',
];

const AdminBookingDetailScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [selectedStatus, setSelectedStatus] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await adminAPI.getBookingById(bookingId);
      const data = response.data.data;
      setBooking(data);
      setSelectedStatus(data.status);
      setTechnicianName(data.technicianName || '');
      setTotalCost(data.totalCost ? String(data.totalCost) : '');
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Error fetching booking:', error);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {};

      if (selectedStatus !== booking.status) {
        updateData.status = selectedStatus;
      }
      if (technicianName !== (booking.technicianName || '')) {
        updateData.technicianName = technicianName;
      }
      if (totalCost !== String(booking.totalCost || '')) {
        updateData.totalCost = parseFloat(totalCost) || 0;
      }
      if (notes !== (booking.notes || '')) {
        updateData.notes = notes;
      }

      if (Object.keys(updateData).length === 0) {
        Alert.alert('No Changes', 'No changes to save.');
        setSaving(false);
        return;
      }

      // Include technician name when assigning
      if (updateData.status === 'assigned' && technicianName) {
        updateData.technicianName = technicianName;
      }

      await adminAPI.updateBooking(bookingId, updateData);
      Alert.alert('Success', 'Booking updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading booking...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Booking not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Device Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Device Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Device</Text>
            <Text style={styles.infoValue}>
              {booking.deviceBrand} {booking.deviceModel}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service</Text>
            <Text style={styles.infoValue}>{booking.service?.name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>
              {booking.service?.category?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Method</Text>
            <Text style={styles.infoValue}>
              {booking.serviceMethod === 'pickup' ? '🚚 Home Pickup' : '📦 Drop-off'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Scheduled</Text>
            <Text style={styles.infoValue}>
              {new Date(booking.scheduledDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              at {booking.scheduledTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Issue Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Issue Description</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>{booking.issueDescription}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Customer</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{booking.user?.name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{booking.user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{booking.user?.phone || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Address (if pickup) */}
      {booking.serviceMethod === 'pickup' && booking.address && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Pickup Address</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              {[booking.address.street, booking.address.city, booking.address.state, booking.address.zipCode]
                .filter(Boolean)
                .join(', ') || 'No address provided'}
            </Text>
          </View>
        </View>
      )}

      {/* Update Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔄 Update Status</Text>
        <View style={styles.statusGrid}>
          {STATUSES.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                selectedStatus === status && {
                  backgroundColor: getStatusColor(status) + '25',
                  borderColor: getStatusColor(status),
                },
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <View
                style={[
                  styles.statusRadio,
                  selectedStatus === status && {
                    backgroundColor: getStatusColor(status),
                    borderColor: getStatusColor(status),
                  },
                ]}
              />
              <Text
                style={[
                  styles.statusOptionText,
                  selectedStatus === status && { color: getStatusColor(status) },
                ]}
              >
                {status.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Technician Name */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Technician Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter technician name..."
          placeholderTextColor={COLORS.textMuted}
          value={technicianName}
          onChangeText={setTechnicianName}
        />
      </View>

      {/* Total Cost */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Total Cost (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter total cost..."
          placeholderTextColor={COLORS.textMuted}
          value={totalCost}
          onChangeText={setTotalCost}
          keyboardType="numeric"
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Admin Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add notes..."
          placeholderTextColor={COLORS.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Tracking History */}
      {booking.trackingHistory?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 Tracking History</Text>
          {booking.trackingHistory.map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={[styles.historyDot, { backgroundColor: getStatusColor(entry.status) }]} />
              <View style={styles.historyContent}>
                <Text style={styles.historyStatus}>
                  {entry.status?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
                <Text style={styles.historyMessage}>{entry.message}</Text>
                <Text style={styles.historyDate}>
                  {new Date(entry.timestamp).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={styles.saveBtnText}>💾 Save Changes</Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: SIZES.md,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: SIZES.sm,
    color: COLORS.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  descriptionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  descriptionText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  statusRadio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginRight: 8,
  },
  statusOptionText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  historyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
  historyMessage: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  historyDate: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.medium,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '700',
  },
});

export default AdminBookingDetailScreen;
