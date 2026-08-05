import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, getStatusColor } from '../theme/colors';

const StatusBadge = ({ status, large = false }) => {
  const color = getStatusColor(status);

  const formatStatus = (s) => {
    return s
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const statusEmojis = {
    received: '📨',
    confirmed: '✅',
    assigned: '👨‍🔧',
    'picked-up': '🚚',
    'under-repair': '🔧',
    ready: '✨',
    completed: '🎉',
    cancelled: '❌',
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + '20' },
        large && styles.badgeLarge,
      ]}
    >
      <Text style={[styles.emoji, large && styles.emojiLarge]}>
        {statusEmojis[status] || '📋'}
      </Text>
      <Text
        style={[
          styles.text,
          { color },
          large && styles.textLarge,
        ]}
      >
        {formatStatus(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeLarge: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
  },
  emoji: {
    fontSize: 12,
    marginRight: 5,
  },
  emojiLarge: {
    fontSize: 18,
    marginRight: 8,
  },
  text: {
    fontSize: SIZES.xs,
    fontWeight: '700',
  },
  textLarge: {
    fontSize: SIZES.base,
  },
});

export default StatusBadge;
