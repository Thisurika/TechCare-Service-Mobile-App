import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { supportAPI } from '../../api/api';
import { COLORS, SIZES, SHADOWS } from '../../theme/colors';
import FAQItem from '../../components/FAQItem';

const SupportScreen = () => {
  const [faqs, setFaqs] = useState([]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('faqs');
  const [activeTipCategory, setActiveTipCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [faqRes, tipsRes] = await Promise.all([
        supportAPI.getFAQs(),
        supportAPI.getTips(),
      ]);
      setFaqs(faqRes.data.data);
      setTips(tipsRes.data.data);
    } catch (error) {
      console.log('Error fetching support data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'faqs' && styles.tabActive]}
          onPress={() => setActiveTab('faqs')}
        >
          <Text style={[styles.tabText, activeTab === 'faqs' && styles.tabTextActive]}>
            ❓ FAQs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tips' && styles.tabActive]}
          onPress={() => setActiveTab('tips')}
        >
          <Text style={[styles.tabText, activeTab === 'tips' && styles.tabTextActive]}>
            💡 Device Tips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.tabActive]}
          onPress={() => setActiveTab('contact')}
        >
          <Text style={[styles.tabText, activeTab === 'contact' && styles.tabTextActive]}>
            📞 Contact
          </Text>
        </TouchableOpacity>
      </View>

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <View style={styles.content}>
          <Text style={styles.contentTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <FAQItem key={faq._id} faq={faq} />
          ))}
          {faqs.length === 0 && (
            <Text style={styles.emptyText}>No FAQs available</Text>
          )}
        </View>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <View style={styles.content}>
          <Text style={styles.contentTitle}>Device Maintenance Tips</Text>
          <Text style={styles.contentSubtitle}>
            Keep your devices running smoothly
          </Text>
          {tips.map((tipCategory) => (
            <View key={tipCategory.id} style={styles.tipCategoryCard}>
              <TouchableOpacity
                style={styles.tipCategoryHeader}
                onPress={() =>
                  setActiveTipCategory(
                    activeTipCategory === tipCategory.id ? null : tipCategory.id
                  )
                }
              >
                <View style={styles.tipCategoryInfo}>
                  <Text style={styles.tipCategoryEmoji}>
                    {getCategoryEmoji(tipCategory.category)}
                  </Text>
                  <Text style={styles.tipCategoryTitle}>{tipCategory.title}</Text>
                </View>
                <Text style={styles.expandIcon}>
                  {activeTipCategory === tipCategory.id ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              {activeTipCategory === tipCategory.id && (
                <View style={styles.tipsList}>
                  {tipCategory.tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                      <Text style={styles.tipBullet}>•</Text>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <View style={styles.content}>
          <Text style={styles.contentTitle}>Contact Us</Text>
          <Text style={styles.contentSubtitle}>
            We're here to help you with any queries
          </Text>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL('tel:+94771234567')}
          >
            <Text style={styles.contactEmoji}>📞</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+94 77 123 4567</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => Linking.openURL('mailto:support@techcare.com')}
          >
            <Text style={styles.contactEmoji}>📧</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email Us</Text>
              <Text style={styles.contactValue}>support@techcare.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard}>
            <Text style={styles.contactEmoji}>💬</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Live Chat</Text>
              <Text style={styles.contactValue}>Available 9 AM - 9 PM</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.hoursCard}>
            <Text style={styles.hoursTitle}>🕐 Working Hours</Text>
            <Text style={styles.hoursText}>Monday - Friday: 9:00 AM - 7:00 PM</Text>
            <Text style={styles.hoursText}>Saturday: 9:00 AM - 5:00 PM</Text>
            <Text style={styles.hoursText}>Sunday: Closed</Text>
          </View>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

function getCategoryEmoji(category) {
  const emojis = {
    smartphone: '📱',
    laptop: '💻',
    television: '📺',
    'air-conditioner': '❄️',
    refrigerator: '🧊',
    'washing-machine': '🫧',
  };
  return emojis[category] || '📱';
}

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
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.paddingLg,
    marginTop: 10,
    marginBottom: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  content: {
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 10,
  },
  contentTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  contentSubtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
  tipCategoryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    overflow: 'hidden',
  },
  tipCategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  tipCategoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipCategoryEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tipCategoryTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  expandIcon: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  tipsList: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipBullet: {
    fontSize: SIZES.md,
    color: COLORS.secondary,
    marginRight: 10,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  contactEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  contactValue: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  hoursCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  hoursTitle: {
    fontSize: SIZES.base,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 12,
  },
  hoursText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
});

export default SupportScreen;
