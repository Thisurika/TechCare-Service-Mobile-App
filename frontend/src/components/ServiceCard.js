import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SHADOWS, CATEGORY_INFO } from '../theme/colors';

const ServiceCard = ({ service, onPress }) => {
  const catInfo = CATEGORY_INFO[service.category] || {};
  const categoryEmojis = {
    smartphone: '📱',
    laptop: '💻',
    television: '📺',
    'air-conditioner': '❄️',
    refrigerator: '🧊',
    'washing-machine': '🫧',
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: (catInfo.color || COLORS.primary) + '15' }]}>
          <Text style={styles.emoji}>{categoryEmojis[service.category] || '🔧'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{service.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {service.description}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.categoryBadge, { backgroundColor: (catInfo.color || COLORS.primary) + '20' }]}>
              <Text style={[styles.categoryText, { color: catInfo.color || COLORS.primary }]}>
                {catInfo.label || service.category}
              </Text>
            </View>
            <Text style={styles.duration}>⏱️ {service.estimatedDuration}</Text>
          </View>
        </View>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Estimated Price</Text>
        <Text style={styles.price}>
          LKR {service.estimatedPrice?.min?.toLocaleString()} - {service.estimatedPrice?.max?.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: SIZES.padding,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  description: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 10,
  },
  categoryText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  duration: {
    fontSize: SIZES.xs,
    color: COLORS.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    backgroundColor: COLORS.glass,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  priceLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
  },
  price: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.secondary,
  },
});

export default ServiceCard;
