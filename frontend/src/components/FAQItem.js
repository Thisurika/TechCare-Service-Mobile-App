import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { COLORS, SIZES } from '../theme/colors';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({ faq }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const categoryColors = {
    general: COLORS.primary,
    booking: COLORS.secondary,
    payment: COLORS.warning,
    repair: COLORS.info,
    tips: COLORS.success,
  };

  return (
    <TouchableOpacity
      style={[styles.container, expanded && styles.containerExpanded]}
      onPress={toggleExpand}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.questionRow}>
          <View
            style={[
              styles.categoryDot,
              { backgroundColor: categoryColors[faq.category] || COLORS.primary },
            ]}
          />
          <Text style={styles.question}>{faq.question}</Text>
        </View>
        <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
      </View>

      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{faq.answer}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: (categoryColors[faq.category] || COLORS.primary) + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColors[faq.category] || COLORS.primary }]}>
              {faq.category}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: 'hidden',
  },
  containerExpanded: {
    borderColor: COLORS.primary + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 10,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 10,
  },
  question: {
    flex: 1,
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
    lineHeight: 22,
  },
  expandIcon: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  answerContainer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
  },
  answer: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default FAQItem;
