import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { bookingsAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS, getStatusColor, CATEGORY_INFO } from '../../theme/colors';
import StatusBadge from '../../components/StatusBadge';

const BookingDetailScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const response = await bookingsAPI.getById(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      console.log('Error fetching booking:', error.message);
      Alert.alert('Error', 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookingsAPI.cancel(bookingId);
              Alert.alert('Cancelled', 'Your booking has been cancelled');
              fetchBooking();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to cancel');
            }
          },
        },
      ]
    );
  };

  const statusOrder = ['received', 'confirmed', 'assigned', 'picked-up', 'under-repair', 'ready', 'completed'];

  const getStatusIndex = (status) => statusOrder.indexOf(status);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const canCancel = !['under-repair', 'ready', 'completed', 'cancelled'].includes(booking.status);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Header */}
      <View style={[styles.statusHeader, { backgroundColor: getStatusColor(booking.status) + '15' }]}>
        <StatusBadge status={booking.status} large />
        <Text style={styles.statusMessage}>
          {booking.status === 'received' && 'Your request has been received'}
          {booking.status === 'confirmed' && 'Booking confirmed by our team'}
          {booking.status === 'assigned' && `Technician ${booking.technicianName || ''} assigned`}
          {booking.status === 'picked-up' && 'Device has been picked up'}
          {booking.status === 'under-repair' && 'Your device is being repaired'}
          {booking.status === 'ready' && 'Repair complete! Ready for pickup'}
          {booking.status === 'completed' && 'Service completed successfully'}
          {booking.status === 'cancelled' && 'This booking has been cancelled'}
        </Text>
      </View>

      {/* Progress Tracker */}
      {booking.status !== 'cancelled' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repair Progress</Text>
          <View style={styles.timeline}>
            {statusOrder.map((status, index) => {
              const isActive = getStatusIndex(booking.status) >= index;
              const isCurrent = booking.status === status;
              return (
                <View key={status} style={styles.timelineItem}>
                  <View style={styles.timelineDotContainer}>
                    <View
                      style={[
                        styles.timelineDot,
                        isActive && { backgroundColor: getStatusColor(status) },
                        isCurrent && styles.timelineDotCurrent,
                      ]}
                    >
                      {isActive && <Text style={styles.timelineCheck}>✓</Text>}
                    </View>
                    {index < statusOrder.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isActive && { backgroundColor: getStatusColor(status) },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineStatus,
                        isActive && { color: COLORS.white },
                        isCurrent && { fontWeight: '700' },
                      ]}
                    >
                      {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Device Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📱 Device</Text>
            <Text style={styles.infoValue}>
              {booking.deviceBrand} {booking.deviceModel}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🔧 Service</Text>
            <Text style={styles.infoValue}>{booking.service?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📝 Issue</Text>
            <Text style={[styles.infoValue, { maxWidth: '65%' }]}>
              {booking.issueDescription}
            </Text>
          </View>
        </View>
      </View>

      {/* Booking Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Date</Text>
            <Text style={styles.infoValue}>{formatDate(booking.scheduledDate)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🕐 Time</Text>
            <Text style={styles.infoValue}>{booking.scheduledTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {booking.serviceMethod === 'pickup' ? '🚚' : '📍'} Method
            </Text>
            <Text style={styles.infoValue}>
              {booking.serviceMethod === 'pickup' ? 'Home Pickup' : 'Drop-off'}
            </Text>
          </View>
          {booking.technicianName && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👨‍🔧 Technician</Text>
              <Text style={styles.infoValue}>{booking.technicianName}</Text>
            </View>
          )}
          {booking.estimatedCompletion && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>⏰ Est. Completion</Text>
              <Text style={styles.infoValue}>{formatDate(booking.estimatedCompletion)}</Text>
            </View>
          )}
          {booking.totalCost > 0 && (
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>💰 Total Cost</Text>
              <Text style={[styles.infoValue, { color: COLORS.secondary, fontWeight: '700' }]}>
                LKR {booking.totalCost.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Tracking History */}
      {booking.trackingHistory && booking.trackingHistory.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Log</Text>
          {booking.trackingHistory
            .slice()
            .reverse()
            .map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View
                  style={[
                    styles.historyDot,
                    { backgroundColor: getStatusColor(entry.status) },
                  ]}
                />
                <View style={styles.historyContent}>
                  <Text style={styles.historyMessage}>{entry.message}</Text>
                  <Text style={styles.historyTime}>
                    {formatDateTime(entry.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      )}

      {/* Cancel Button */}
      {canCancel && (
        <View style={styles.section}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.base,
  },
  statusHeader: {
    padding: SIZES.paddingLg,
    alignItems: 'center',
    borderBottomLeftRadius: SIZES.radiusXl,
    borderBottomRightRadius: SIZES.radiusXl,
  },
  statusMessage: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SIZES.paddingLg,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 14,
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 44,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 28,
    marginRight: 14,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
  },
  timelineDotCurrent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  timelineCheck: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '700',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.glassBorder,
    marginVertical: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineStatus: {
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: {
    fontSize: SIZES.md,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyMessage: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  historyTime: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: COLORS.error + '15',
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  cancelButtonText: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.error,
  },
});

export default BookingDetailScreen;
