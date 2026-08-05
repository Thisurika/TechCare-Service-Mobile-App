import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS, getStatusColor } from '../theme/colors';
import StatusBadge from './StatusBadge';

const BookingCard = ({ booking, onPress }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>
            {booking.deviceBrand} {booking.deviceModel}
          </Text>
          <Text style={styles.serviceName}>
            {booking.service?.name || 'Repair Service'}
          </Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>📅</Text>
          <Text style={styles.detailText}>{formatDate(booking.scheduledDate)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>🕐</Text>
          <Text style={styles.detailText}>{booking.scheduledTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>
            {booking.serviceMethod === 'pickup' ? '🚚' : '📍'}
          </Text>
          <Text style={styles.detailText}>
            {booking.serviceMethod === 'pickup' ? 'Pickup' : 'Drop-off'}
          </Text>
        </View>
      </View>

      {booking.technicianName && (
        <View style={styles.technicianRow}>
          <Text style={styles.technicianLabel}>👨‍🔧 Technician:</Text>
          <Text style={styles.technicianName}>{booking.technicianName}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  deviceName: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  serviceName: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.glass,
    borderRadius: SIZES.radiusSm,
    padding: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  detailText: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  technicianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  technicianLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginRight: 6,
  },
  technicianName: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default BookingCard;
