import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES, SHADOWS } from '../../theme/colors';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🔧</Text>
          <Text style={styles.title}>TechCare</Text>
          <Text style={styles.subtitle}>Service Center</Text>
          <Text style={styles.tagline}>Expert repair for all your devices</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📧 Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Don't have an account?{' '}
              <Text style={styles.registerTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.paddingLg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4,
  },
  tagline: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.paddingLg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.medium,
  },
  formTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: SIZES.base,
    color: COLORS.white,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: SIZES.radius,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: SIZES.base,
    color: COLORS.white,
  },
  eyeButton: {
    padding: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.small,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  dividerText: {
    color: COLORS.textMuted,
    paddingHorizontal: 16,
    fontSize: SIZES.sm,
  },
  registerLink: {
    alignItems: 'center',
  },
  registerText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  registerTextBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default LoginScreen;
