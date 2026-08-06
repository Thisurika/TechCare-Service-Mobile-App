import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS } from '../../theme/colors';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, refreshProfile } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });

  const fetchStats = async () => {
    try {
      const response = await bookingsAPI.getAll();
      const bookings = response.data.data;
      setStats({
        total: bookings.length,
        active: bookings.filter((b) => !['completed', 'cancelled'].includes(b.status)).length,
        completed: bookings.filter((b) => b.status === 'completed').length,
      });
    } catch (error) {
      console.log('Error fetching stats:', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
      if (refreshProfile) refreshProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const menuItems = [
    {
      emoji: '📋',
      label: 'My Bookings',
      subtitle: `${stats.total} total bookings`,
      onPress: () => navigation.navigate('Bookings'),
    },
    {
      emoji: '🔔',
      label: 'Notifications',
      subtitle: 'View all notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      emoji: '💡',
      label: 'Help & Support',
      subtitle: 'FAQs and device tips',
      onPress: () => navigation.navigate('Support'),
    },
    {
      emoji: 'ℹ️',
      label: 'About TechCare',
      subtitle: 'Version 1.0.0',
      onPress: () => Alert.alert('TechCare Service', 'Version 1.0.0\nExpert repair for all your devices.'),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        <Text style={styles.userPhone}>📱 {user?.phone || ''}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.primary + '15', borderColor: COLORS.primary + '30' }]}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.success + '15', borderColor: COLORS.success + '30' }]}>
          <Text style={[styles.statValue, { color: COLORS.success }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      {/* Saved Devices */}
      {user?.savedDevices && user.savedDevices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Devices</Text>
          {user.savedDevices.map((device, index) => (
            <View key={index} style={styles.deviceItem}>
              <Text style={styles.deviceEmoji}>📱</Text>
              <View>
                <Text style={styles.deviceName}>
                  {device.brand} {device.model}
                </Text>
                <Text style={styles.deviceType}>{device.deviceType}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Menu Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SIZES.paddingLg,
  },
  avatarContainer: {
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
  },
  userName: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  userEmail: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  userPhone: {
    fontSize: SIZES.md,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.paddingLg,
    gap: 10,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: SIZES.paddingLg,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 12,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  deviceEmoji: {
    fontSize: 24,
    marginRight: 14,
  },
  deviceName: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  deviceType: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  menuEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
  menuSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: COLORS.error + '10',
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '25',
  },
  logoutText: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.error,
  },
});

export default ProfileScreen;
