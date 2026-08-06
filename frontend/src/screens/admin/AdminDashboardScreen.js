import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS, getStatusColor } from '../../theme/colors';
import { adminAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const formatCurrency = (amount) => {
    return `Rs. ${(amount || 0).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: COLORS.primary,
      bgColor: 'rgba(30, 136, 229, 0.15)',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: '📋',
      color: COLORS.secondary,
      bgColor: 'rgba(0, 191, 165, 0.15)',
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats?.totalRevenue),
      icon: '💰',
      color: COLORS.success,
      bgColor: 'rgba(76, 175, 80, 0.15)',
    },
    {
      title: 'Active Repairs',
      value: stats?.activeRepairs || 0,
      icon: '🔧',
      color: COLORS.warning,
      bgColor: 'rgba(255, 179, 0, 0.15)',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.adminName}>{user?.name || 'Admin'} 👑</Text>
        </View>
        <View style={styles.todayBadge}>
          <Text style={styles.todayCount}>{stats?.bookingsToday || 0}</Text>
          <Text style={styles.todayLabel}>Today</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <View key={index} style={[styles.statCard, { borderLeftColor: card.color }]}>
            <View style={[styles.statIconWrap, { backgroundColor: card.bgColor }]}>
              <Text style={styles.statIcon}>{card.icon}</Text>
            </View>
            <Text style={styles.statValue}>{card.value}</Text>
            <Text style={styles.statTitle}>{card.title}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: 'rgba(30, 136, 229, 0.12)' }]}
          onPress={() => navigation.navigate('AdminUsers')}
        >
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionLabel}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: 'rgba(0, 191, 165, 0.12)' }]}
          onPress={() => navigation.navigate('AdminBookings')}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionLabel}>Manage Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: 'rgba(255, 179, 0, 0.12)' }]}
          onPress={() => navigation.navigate('AdminServices')}
        >
          <Text style={styles.actionIcon}>🔧</Text>
          <Text style={styles.actionLabel}>Manage Services</Text>
        </TouchableOpacity>
      </View>

      {/* Bookings by Status */}
      {stats?.bookingsByStatus?.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Bookings by Status</Text>
          <View style={styles.statusGrid}>
            {stats.bookingsByStatus.map((item, index) => (
              <View
                key={index}
                style={[styles.statusChip, { borderColor: getStatusColor(item._id) }]}
              >
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item._id) }]} />
                <Text style={styles.statusLabel}>
                  {item._id?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
                <Text style={[styles.statusCount, { color: getStatusColor(item._id) }]}>
                  {item.count}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Recent Bookings */}
      <Text style={styles.sectionTitle}>Recent Bookings</Text>
      {stats?.recentBookings?.length > 0 ? (
        stats.recentBookings.map((booking) => (
          <TouchableOpacity
            key={booking._id}
            style={styles.bookingCard}
            onPress={() => navigation.navigate('AdminBookings')}
          >
            <View style={styles.bookingHeader}>
              <View>
                <Text style={styles.bookingDevice}>
                  {booking.deviceBrand} {booking.deviceModel}
                </Text>
                <Text style={styles.bookingService}>
                  {booking.service?.name || 'Service'} • {booking.user?.name || 'User'}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) + '20' },
                ]}
              >
                <Text style={[styles.statusBadgeText, { color: getStatusColor(booking.status) }]}>
                  {booking.status?.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Text>
              </View>
            </View>
            <Text style={styles.bookingDate}>
              {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No bookings yet</Text>
        </View>
      )}

      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 Platform Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Services</Text>
          <Text style={styles.summaryValue}>{stats?.totalServices || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Active Services</Text>
          <Text style={styles.summaryValue}>{stats?.activeServices || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Completed Repairs</Text>
          <Text style={styles.summaryValue}>{stats?.completedBookings || 0}</Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
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
    paddingTop: 50,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  adminName: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 4,
  },
  todayBadge: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  todayCount: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  todayLabel: {
    fontSize: SIZES.xs,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    ...SHADOWS.small,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 12,
    marginTop: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    flex: 1,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginRight: 8,
  },
  statusCount: {
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  bookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bookingDevice: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  bookingService: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
  },
  bookingDate: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.md,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  summaryTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  summaryLabel: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default AdminDashboardScreen;
