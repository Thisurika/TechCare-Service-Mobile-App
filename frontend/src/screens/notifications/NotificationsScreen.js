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
import { notificationsAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS } from '../../theme/colors';
import NotificationItem from '../../components/NotificationItem';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.log('Error fetching notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchNotifications();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.log('Error marking as read:', error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.log('Error marking all as read:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllText}>Read All</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleMarkAsRead(item._id)}
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
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              You'll receive updates about your bookings here
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  markAllButton: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  markAllText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 10,
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
    paddingTop: 80,
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
    textAlign: 'center',
  },
});

export default NotificationsScreen;
