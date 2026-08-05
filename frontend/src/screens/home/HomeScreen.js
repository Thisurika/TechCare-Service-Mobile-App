import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { servicesAPI, bookingsAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS, CATEGORY_INFO, getStatusColor } from '../../theme/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const categories = Object.entries(CATEGORY_INFO);

  const categoryEmojis = {
    smartphone: '📱',
    laptop: '💻',
    television: '📺',
    'air-conditioner': '❄️',
    refrigerator: '🧊',
    'washing-machine': '🫧',
  };

  const fetchActiveBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      const active = response.data.data.filter(
        (b) => !['completed', 'cancelled'].includes(b.status)
      );
      setActiveBookings(active.slice(0, 3)); // Show only 3 latest
    } catch (error) {
      console.log('Error fetching bookings:', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActiveBookings();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActiveBookings();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatStatus = (status) => {
    return status
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.notifButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>TechCare Services</Text>
            <Text style={styles.bannerSubtitle}>
              Expert repair for smartphones, laptops, TVs & home appliances
            </Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => navigation.navigate('Services')}
            >
              <Text style={styles.bannerButtonText}>Browse Services →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>🔧</Text>
        </View>
      </View>

      {/* Device Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select a Device</Text>
        <Text style={styles.sectionSubtitle}>What needs fixing?</Text>

        <View style={styles.categoryGrid}>
          {categories.map(([key, info]) => (
            <TouchableOpacity
              key={key}
              style={[styles.categoryCard, { borderColor: info.color + '30' }]}
              onPress={() =>
                navigation.navigate('Services', {
                  screen: 'ServicesMain',
                  params: { category: key },
                })
              }
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIconBg, { backgroundColor: info.color + '20' }]}>
                <Text style={styles.categoryEmoji}>{categoryEmojis[key]}</Text>
              </View>
              <Text style={styles.categoryLabel}>{info.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Active Bookings */}
      {activeBookings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Bookings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          {activeBookings.map((booking) => (
            <TouchableOpacity
              key={booking._id}
              style={styles.bookingCard}
              onPress={() =>
                navigation.navigate('Bookings', {
                  screen: 'BookingDetail',
                  params: { bookingId: booking._id },
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.bookingHeader}>
                <View>
                  <Text style={styles.bookingDevice}>
                    {booking.deviceBrand} {booking.deviceModel}
                  </Text>
                  <Text style={styles.bookingService}>
                    {booking.service?.name || 'Repair Service'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) + '20' },
                  ]}
                >
                  <Text
                    style={[styles.statusText, { color: getStatusColor(booking.status) }]}
                  >
                    {formatStatus(booking.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.bookingFooter}>
                <Text style={styles.bookingDate}>
                  📅 {new Date(booking.scheduledDate).toLocaleDateString()}
                </Text>
                <Text style={styles.bookingMethod}>
                  {booking.serviceMethod === 'pickup' ? '🚚 Pickup' : '📍 Drop-off'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Services')}
          >
            <Text style={styles.quickActionEmoji}>🛠️</Text>
            <Text style={styles.quickActionText}>Book Repair</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => navigation.navigate('Bookings')}
          >
            <Text style={styles.quickActionEmoji}>📋</Text>
            <Text style={styles.quickActionText}>My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() =>
              navigation.navigate('Profile', {
                screen: 'Support',
              })
            }
          >
            <Text style={styles.quickActionEmoji}>💡</Text>
            <Text style={styles.quickActionText}>Tips & FAQs</Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 55,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 2,
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  notifIcon: {
    fontSize: 20,
  },
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.paddingLg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: SIZES.xl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginBottom: 12,
  },
  bannerButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.sm,
  },
  bannerEmoji: {
    fontSize: 60,
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: SIZES.paddingLg,
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 64) / 3,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    ...SHADOWS.small,
  },
  categoryIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryLabel: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: SIZES.xs,
    fontWeight: '700',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingDate: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  bookingMethod: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.small,
  },
  quickActionEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
