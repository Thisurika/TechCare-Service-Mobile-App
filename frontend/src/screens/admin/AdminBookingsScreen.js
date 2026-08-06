import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS, getStatusColor } from '../../theme/colors';
import { adminAPI } from '../../api/api';

const STATUS_TABS = [
  'all',
  'received',
  'confirmed',
  'assigned',
  'picked-up',
  'under-repair',
  'ready',
  'completed',
  'cancelled',
];

const AdminBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchBookings = async (status = 'all') => {
    try {
      const params = {};
      if (status !== 'all') params.status = status;
      const response = await adminAPI.getBookings(params);
      setBookings(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings(activeTab);
    }, [activeTab])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(activeTab);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoading(true);
    fetchBookings(tab);
  };

  const renderBooking = ({ item }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('AdminBookingDetail', { bookingId: item._id })}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.bookingLeft}>
          <Text style={styles.deviceName}>
            {item.deviceBrand} {item.deviceModel}
          </Text>
          <Text style={styles.serviceName}>{item.service?.name || 'Service'}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>👤</Text>
          <Text style={styles.detailText}>{item.user?.name || 'Unknown'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📧</Text>
          <Text style={styles.detailText}>{item.user?.email || ''}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {new Date(item.scheduledDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}{' '}
            at {item.scheduledTime}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🚚</Text>
          <Text style={styles.detailText}>
            {item.serviceMethod === 'pickup' ? 'Home Pickup' : 'Drop-off'}
          </Text>
        </View>
      </View>

      {item.technicianName ? (
        <View style={styles.techRow}>
          <Text style={styles.techLabel}>🔧 Technician:</Text>
          <Text style={styles.techName}>{item.technicianName}</Text>
        </View>
      ) : null}

      {item.totalCost > 0 && (
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>💰 Cost:</Text>
          <Text style={styles.costValue}>Rs. {item.totalCost.toLocaleString('en-IN')}</Text>
        </View>
      )}

      <Text style={styles.cardDate}>
        Created: {new Date(item.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Bookings Management</Text>
        <Text style={styles.subtitle}>{total} total bookings</Text>
      </View>

      {/* Status Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
              activeTab === tab && { borderColor: tab === 'all' ? COLORS.primary : getStatusColor(tab) },
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
                activeTab === tab && { color: tab === 'all' ? COLORS.primary : getStatusColor(tab) },
              ]}
            >
              {tab === 'all' ? 'All' : tab.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        }
      />
    </View>
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
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: SIZES.md,
  },
  header: {
    padding: SIZES.padding,
    paddingTop: 50,
    paddingBottom: 8,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tabsContainer: {
    maxHeight: 44,
    marginBottom: 8,
  },
  tabsContent: {
    paddingHorizontal: SIZES.padding,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: SIZES.radiusFull,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  tabActive: {
    backgroundColor: COLORS.surfaceLight,
  },
  tabText: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  list: {
    padding: SIZES.padding,
    paddingTop: 4,
  },
  bookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.small,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingLeft: {
    flex: 1,
    marginRight: 8,
  },
  deviceName: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  serviceName: {
    fontSize: SIZES.sm,
    color: COLORS.primaryLight,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  techLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  techName: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  costLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  costValue: {
    fontSize: SIZES.sm,
    fontWeight: '700',
    color: COLORS.success,
  },
  cardDate: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: SIZES.base,
    color: COLORS.textMuted,
  },
});

export default AdminBookingsScreen;
