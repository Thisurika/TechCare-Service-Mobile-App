import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES, SHADOWS, CATEGORY_INFO } from '../../theme/colors';

const ServiceDetailScreen = ({ navigation, route }) => {
  const { service } = route.params;
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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: (catInfo.color || COLORS.primary) + '15' }]}>
          <Text style={styles.heroEmoji}>{categoryEmojis[service.category] || '🔧'}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: (catInfo.color || COLORS.primary) + '30' }]}>
            <Text style={[styles.categoryText, { color: catInfo.color || COLORS.primary }]}>
              {catInfo.label || service.category}
            </Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.infoSection}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
        </View>

        {/* Details Cards */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.detailEmoji}>💰</Text>
            <Text style={styles.detailLabel}>Estimated Price</Text>
            <Text style={styles.detailValue}>
              LKR {service.estimatedPrice?.min?.toLocaleString()} - {service.estimatedPrice?.max?.toLocaleString()}
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailEmoji}>⏱️</Text>
            <Text style={styles.detailLabel}>Estimated Time</Text>
            <Text style={styles.detailValue}>{service.estimatedDuration}</Text>
          </View>
        </View>

        {/* Service Methods */}
        <View style={styles.methodSection}>
          <Text style={styles.methodTitle}>Service Options</Text>

          <View style={styles.methodCard}>
            <Text style={styles.methodEmoji}>🚚</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Home Pickup</Text>
              <Text style={styles.methodDesc}>
                Our technician picks up your device from your doorstep
              </Text>
            </View>
          </View>

          <View style={styles.methodCard}>
            <Text style={styles.methodEmoji}>📍</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Service Center Drop-off</Text>
              <Text style={styles.methodDesc}>
                Drop your device at our nearest service center
              </Text>
            </View>
          </View>
        </View>

        {/* What's Included */}
        <View style={styles.includedSection}>
          <Text style={styles.includedTitle}>What's Included</Text>
          {[
            '✅ Professional diagnosis & repair',
            '✅ OEM-quality replacement parts',
            '✅ 30-day warranty on repairs',
            '✅ Real-time repair tracking',
            '✅ No hidden charges',
          ].map((item, index) => (
            <Text key={index} style={styles.includedItem}>
              {item}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>
            From LKR {service.estimatedPrice?.min?.toLocaleString()}
          </Text>
          <Text style={styles.bottomDuration}>{service.estimatedDuration}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookingForm', { service })}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Book Now 🛠️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: SIZES.radiusXl,
    borderBottomRightRadius: SIZES.radiusXl,
  },
  heroEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: SIZES.sm,
    fontWeight: '700',
  },
  infoSection: {
    padding: SIZES.paddingLg,
  },
  serviceName: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 10,
  },
  serviceDescription: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.paddingLg,
    gap: 12,
  },
  detailCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.small,
  },
  detailEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  methodSection: {
    padding: SIZES.paddingLg,
    marginTop: 8,
  },
  methodTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 14,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  methodEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  includedSection: {
    paddingHorizontal: SIZES.paddingLg,
    marginTop: 8,
  },
  includedTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 14,
  },
  includedItem: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 10,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.paddingLg,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    ...SHADOWS.large,
  },
  bottomPrice: {
    fontSize: SIZES.lg,
    fontWeight: '800',
    color: COLORS.white,
  },
  bottomDuration: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  bookButtonText: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default ServiceDetailScreen;
