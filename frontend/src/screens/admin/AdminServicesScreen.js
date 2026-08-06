import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS, CATEGORY_INFO } from '../../theme/colors';
import { adminAPI } from '../../api/api';

const AdminServicesScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await adminAPI.getServices();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  const handleDeleteService = (serviceId, serviceName) => {
    Alert.alert(
      'Deactivate Service',
      `Are you sure you want to deactivate "${serviceName}"? It will be hidden from users.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminAPI.deleteService(serviceId);
              Alert.alert('Success', 'Service deactivated');
              fetchServices();
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to deactivate');
            }
          },
        },
      ]
    );
  };

  const handleToggleActive = async (service) => {
    try {
      await adminAPI.updateService(service._id, { isActive: !service.isActive });
      fetchServices();
    } catch (error) {
      Alert.alert('Error', 'Failed to update service status');
    }
  };

  const renderService = ({ item }) => {
    const catInfo = CATEGORY_INFO[item.category] || {};

    return (
      <View style={[styles.serviceCard, !item.isActive && styles.inactiveCard]}>
        <View style={styles.serviceHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: (catInfo.color || COLORS.primary) + '20' }]}>
            <Text style={styles.categoryIcon}>{getCategoryEmoji(item.category)}</Text>
          </View>
          <View style={styles.serviceInfo}>
            <Text style={[styles.serviceName, !item.isActive && styles.inactiveText]}>
              {item.name}
            </Text>
            <Text style={styles.serviceCategory}>
              {catInfo.label || item.category}
            </Text>
          </View>
          {!item.isActive && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>Inactive</Text>
            </View>
          )}
        </View>

        <Text style={styles.serviceDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.serviceMetaRow}>
          <Text style={styles.servicePrice}>
            💰 ₹{item.estimatedPrice?.min?.toLocaleString('en-IN')} — ₹{item.estimatedPrice?.max?.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.serviceDuration}>⏱ {item.estimatedDuration}</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('AdminServiceForm', { service: item })}
          >
            <Text style={styles.editBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, item.isActive ? styles.deactivateBtn : styles.activateBtn]}
            onPress={() => handleToggleActive(item)}
          >
            <Text style={styles.toggleBtnText}>
              {item.isActive ? '🔴 Deactivate' : '🟢 Activate'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🔧 Services Management</Text>
          <Text style={styles.subtitle}>{services.length} total services</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AdminServiceForm', {})}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔧</Text>
            <Text style={styles.emptyText}>No services found</Text>
          </View>
        }
      />
    </View>
  );
};

const getCategoryEmoji = (category) => {
  const map = {
    smartphone: '📱',
    laptop: '💻',
    television: '📺',
    'air-conditioner': '❄️',
    refrigerator: '🧊',
    'washing-machine': '🫧',
  };
  return map[category] || '🔧';
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingHorizontal: 20,
    paddingVertical: 10,
    ...SHADOWS.small,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: SIZES.md,
    fontWeight: '700',
  },
  list: {
    padding: SIZES.padding,
    paddingTop: 4,
  },
  serviceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.small,
  },
  inactiveCard: {
    opacity: 0.6,
    borderColor: COLORS.error + '40',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 20,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  inactiveText: {
    textDecorationLine: 'line-through',
  },
  serviceCategory: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  inactiveBadge: {
    backgroundColor: COLORS.error + '20',
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  inactiveBadgeText: {
    fontSize: SIZES.xs,
    color: COLORS.error,
    fontWeight: '700',
  },
  serviceDescription: {
    fontSize: SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: 8,
    lineHeight: 18,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  serviceDuration: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 10,
  },
  editBtn: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  editBtnText: {
    fontSize: SIZES.sm,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  toggleBtn: {
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  deactivateBtn: {
    backgroundColor: COLORS.error + '10',
    borderColor: COLORS.error + '30',
  },
  activateBtn: {
    backgroundColor: COLORS.success + '10',
    borderColor: COLORS.success + '30',
  },
  toggleBtnText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
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

export default AdminServicesScreen;
