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

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), phone.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join TechCare Services</Text>
        </View>

        {/* Register Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>👤 Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

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
            <Text style={styles.label}>📱 Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Create a password (min 6 chars)"
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor={COLORS.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Sign In</Text>
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.paddingLg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.medium,
  },
  inputGroup: {
    marginBottom: 16,
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
  registerButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.small,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
  },
  loginTextBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;
