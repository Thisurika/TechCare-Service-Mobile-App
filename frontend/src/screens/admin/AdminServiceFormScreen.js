import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../theme/colors';
import { adminAPI } from '../../api/api';

const CATEGORIES = [
  { value: 'smartphone', label: 'Smartphones', emoji: '📱' },
  { value: 'laptop', label: 'Laptops', emoji: '💻' },
  { value: 'television', label: 'Televisions', emoji: '📺' },
  { value: 'air-conditioner', label: 'Air Conditioners', emoji: '❄️' },
  { value: 'refrigerator', label: 'Refrigerators', emoji: '🧊' },
  { value: 'washing-machine', label: 'Washing Machines', emoji: '🫧' },
];

const AdminServiceFormScreen = ({ route, navigation }) => {
  const existingService = route.params?.service;
  const isEdit = !!existingService;

  const [name, setName] = useState(existingService?.name || '');
  const [category, setCategory] = useState(existingService?.category || 'smartphone');
  const [description, setDescription] = useState(existingService?.description || '');
  const [priceMin, setPriceMin] = useState(
    existingService?.estimatedPrice?.min ? String(existingService.estimatedPrice.min) : ''
  );
  const [priceMax, setPriceMax] = useState(
    existingService?.estimatedPrice?.max ? String(existingService.estimatedPrice.max) : ''
  );
  const [duration, setDuration] = useState(existingService?.estimatedDuration || '');
  const [icon, setIcon] = useState(existingService?.icon || 'build');
  const [image, setImage] = useState(existingService?.image || '');
  const [isActive, setIsActive] = useState(
    existingService?.isActive !== undefined ? existingService.isActive : true
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation', 'Service name is required');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Validation', 'Description is required');
      return;
    }
    if (!priceMin || !priceMax) {
      Alert.alert('Validation', 'Price range is required');
      return;
    }
    if (!duration.trim()) {
      Alert.alert('Validation', 'Estimated duration is required');
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        category,
        description: description.trim(),
        estimatedPrice: {
          min: parseFloat(priceMin),
          max: parseFloat(priceMax),
        },
        estimatedDuration: duration.trim(),
        icon: icon.trim() || 'build',
        image: image.trim(),
        isActive,
      };

      if (isEdit) {
        await adminAPI.updateService(existingService._id, data);
        Alert.alert('Success', 'Service updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await adminAPI.createService(data);
        Alert.alert('Success', 'Service created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>
        {isEdit ? '✏️ Edit Service' : '➕ New Service'}
      </Text>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Screen Replacement"
          placeholderTextColor={COLORS.textMuted}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Category */}
      <View style={styles.field}>
        <Text style={styles.label}>Category *</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryOption,
                category === cat.value && styles.categorySelected,
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  category === cat.value && styles.categoryLabelSelected,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the service..."
          placeholderTextColor={COLORS.textMuted}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Price Range */}
      <View style={styles.field}>
        <Text style={styles.label}>Price Range (Rs.) *</Text>
        <View style={styles.priceRow}>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="Min"
            placeholderTextColor={COLORS.textMuted}
            value={priceMin}
            onChangeText={setPriceMin}
            keyboardType="numeric"
          />
          <Text style={styles.priceSeparator}>—</Text>
          <TextInput
            style={[styles.input, styles.priceInput]}
            placeholder="Max"
            placeholderTextColor={COLORS.textMuted}
            value={priceMax}
            onChangeText={setPriceMax}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Duration */}
      <View style={styles.field}>
        <Text style={styles.label}>Estimated Duration *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 1-2 hours"
          placeholderTextColor={COLORS.textMuted}
          value={duration}
          onChangeText={setDuration}
        />
      </View>

      {/* Icon */}
      <View style={styles.field}>
        <Text style={styles.label}>Icon Name (MaterialIcons)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. phone-android, laptop, build"
          placeholderTextColor={COLORS.textMuted}
          value={icon}
          onChangeText={setIcon}
        />
      </View>

      {/* Image URL */}
      <View style={styles.field}>
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.jpg"
          placeholderTextColor={COLORS.textMuted}
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />
      </View>

      {/* Active Toggle */}
      <View style={styles.field}>
        <Text style={styles.label}>Status</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleOption, isActive && styles.toggleActive]}
            onPress={() => setIsActive(true)}
          >
            <Text style={[styles.toggleText, isActive && styles.toggleTextActive]}>
              🟢 Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption, !isActive && styles.toggleInactive]}
            onPress={() => setIsActive(false)}
          >
            <Text style={[styles.toggleText, !isActive && styles.toggleTextInactive]}>
              🔴 Inactive
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <Text style={styles.saveBtnText}>
            {isEdit ? '💾 Update Service' : '✅ Create Service'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.padding,
  },
  pageTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 24,
    marginTop: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  categorySelected: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryLabelSelected: {
    color: COLORS.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    color: COLORS.textMuted,
    marginHorizontal: 12,
    fontSize: SIZES.lg,
  },
  toggleRow: {
    flexDirection: 'row',
  },
  toggleOption: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSm,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  toggleActive: {
    backgroundColor: COLORS.success + '15',
    borderColor: COLORS.success + '40',
  },
  toggleInactive: {
    backgroundColor: COLORS.error + '15',
    borderColor: COLORS.error + '40',
  },
  toggleText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: COLORS.success,
  },
  toggleTextInactive: {
    color: COLORS.error,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.medium,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: SIZES.base,
    fontWeight: '700',
  },
});

export default AdminServiceFormScreen;
