import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { servicesAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS, CATEGORY_INFO } from '../../theme/colors';
import ServiceCard from '../../components/ServiceCard';

const ServicesScreen = ({ navigation, route }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: null, label: 'All', emoji: '📱' },
    ...Object.entries(CATEGORY_INFO).map(([key, info]) => ({
      key,
      label: info.label,
      emoji: getCategoryEmoji(key),
    })),
  ];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await servicesAPI.getAll(params);
      setServices(response.data.data);
    } catch (error) {
      console.log('Error fetching services:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Repair Services</Text>
        <Text style={styles.subtitle}>Find the right fix for your device</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key || 'all'}
            style={[
              styles.categoryChip,
              selectedCategory === cat.key && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text style={styles.categoryChipEmoji}>{cat.emoji}</Text>
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat.key && styles.categoryChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onPress={() => navigation.navigate('ServiceDetail', { service: item })}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>No services found</Text>
              <Text style={styles.emptySubtext}>
                Try a different category or search term
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

function getCategoryEmoji(key) {
  const emojis = {
    smartphone: '📱',
    laptop: '💻',
    television: '📺',
    'air-conditioner': '❄️',
    refrigerator: '🧊',
    'washing-machine': '🫧',
  };
  return emojis[key] || '📱';
}

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
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: SIZES.base,
    color: COLORS.white,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textMuted,
    padding: 4,
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 10,
  },
  categoryContent: {
    paddingHorizontal: SIZES.paddingLg,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  categoryChipEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
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
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: SIZES.md,
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
  },
});

export default ServicesScreen;
