import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../theme/colors';

const NotificationItem = ({ notification, onPress }) => {
  const typeEmojis = {
    booking: '📋',
    status: '🔄',
    promo: '🎁',
    system: '⚙️',
  };

  const getTimeAgo = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.isRead && styles.unread,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>
          {typeEmojis[notification.type] || '📢'}
        </Text>
        {!notification.isRead && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.title, !notification.isRead && styles.titleUnread]}
          numberOfLines={1}
        >
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{getTimeAgo(notification.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  unread: {
    backgroundColor: COLORS.primary + '08',
    borderColor: COLORS.primary + '20',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  titleUnread: {
    color: COLORS.white,
    fontWeight: '700',
  },
  message: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
});

export default NotificationItem;
