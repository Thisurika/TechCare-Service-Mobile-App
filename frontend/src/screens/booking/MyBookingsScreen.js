import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { bookingsAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS, getStatusColor } from '../../theme/colors';
import BookingCard from '../../components/BookingCard';

const MyBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data.data);
    } catch (error) {
      console.log('Error fetching bookings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const getFilteredBookings = () => {
    switch (activeFilter) {
      case 'active':
        return bookings.filter(
          (b) => !['completed', 'cancelled'].includes(b.status)
        );
      case 'completed':
        return bookings.filter((b) => b.status === 'completed');
      case 'cancelled':
        return bookings.filter((b) => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

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
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Track your repair requests</Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              activeFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.key && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={getFilteredBookings()}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              navigation.navigate('BookingDetail', { bookingId: item._id })
            }
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>No bookings found</Text>
            <Text style={styles.emptySubtext}>
              {activeFilter === 'all'
                ? "You haven't made any bookings yet"
                : `No ${activeFilter} bookings`}
            </Text>
            {activeFilter === 'all' && (
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Services')}
              >
                <Text style={styles.browseButtonText}>Browse Services</Text>
              </TouchableOpacity>
            )}
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
  header: {
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 55,
    paddingBottom: 10,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.paddingLg,
    marginBottom: 16,
    marginTop: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: SIZES.paddingLg,
    paddingBottom: 20,
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
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  emptySubtext: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  browseButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: SIZES.base,
  },
});

export default MyBookingsScreen;
