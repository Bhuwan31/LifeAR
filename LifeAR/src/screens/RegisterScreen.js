import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
    emergencyContact: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = useCallback(() => {
    const errors = {};
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Enter a valid phone number (10-15 digits)';
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleRegister = useCallback(async () => {
    clearError();
    if (!validateForm()) return;

    try {
      await register({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        password: formData.password,
        bloodType: formData.bloodType.trim() || null,
        emergencyContact: formData.emergencyContact.trim() || null,
      });
    } catch (err) {
      // Error handled by auth context
    }
  }, [formData, register, validateForm, clearError]);

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join LifeAR to be emergency-ready</Text>
          </View>

          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, formErrors.fullName && styles.inputError]}
                placeholder="John Doe"
                placeholderTextColor="#666"
                value={formData.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                autoCapitalize="words"
                editable={!isLoading}
              />
              {formErrors.fullName && <Text style={styles.fieldError}>{formErrors.fullName}</Text>}
            </View>

            {/* Phone */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, formErrors.phone && styles.inputError]}
                placeholder="+82 10-1234-5678"
                placeholderTextColor="#666"
                value={formData.phone}
                onChangeText={(v) => updateField('phone', v)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              {formErrors.phone && <Text style={styles.fieldError}>{formErrors.phone}</Text>}
            </View>

            {/* Email (Optional) */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={[styles.input, formErrors.email && styles.inputError]}
                placeholder="you@example.com"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={(v) => updateField('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {formErrors.email && <Text style={styles.fieldError}>{formErrors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, formErrors.password && styles.inputError]}
                  placeholder="Min 6 characters"
                  placeholderTextColor="#666"
                  value={formData.password}
                  onChangeText={(v) => updateField('password', v)}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.showPasswordBtn} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.showPasswordText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              {formErrors.password && <Text style={styles.fieldError}>{formErrors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Confirm Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.passwordInput, formErrors.confirmPassword && styles.inputError]}
                  placeholder="Re-enter password"
                  placeholderTextColor="#666"
                  value={formData.confirmPassword}
                  onChangeText={(v) => updateField('confirmPassword', v)}
                  secureTextEntry={!showConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.showPasswordBtn} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Text style={styles.showPasswordText}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              {formErrors.confirmPassword && <Text style={styles.fieldError}>{formErrors.confirmPassword}</Text>}
            </View>

            {/* Blood Type */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Blood Type <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="A+, B-, O+, AB+, etc."
                placeholderTextColor="#666"
                value={formData.bloodType}
                onChangeText={(v) => updateField('bloodType', v)}
                autoCapitalize="characters"
                editable={!isLoading}
              />
            </View>

            {/* Emergency Contact */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Emergency Contact <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Family member phone number"
                placeholderTextColor="#666"
                value={formData.emergencyContact}
                onChangeText={(v) => updateField('emergencyContact', v)}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#888' },
  errorBanner: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  errorBannerText: { color: '#EF4444', fontSize: 14, textAlign: 'center', fontWeight: '500' },
  form: { marginBottom: 16 },
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#ccc', marginBottom: 8 },
  optional: { color: '#666', fontWeight: '400' },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  inputError: { borderColor: '#DC2626' },
  passwordContainer: { position: 'relative' },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#1a1a1a',
    paddingRight: 70,
  },
  showPasswordBtn: { position: 'absolute', right: 18, top: 15 },
  showPasswordText: { color: '#DC2626', fontSize: 14, fontWeight: '600' },
  fieldError: { color: '#EF4444', fontSize: 12, marginTop: 6, marginLeft: 4 },
  registerBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  registerBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  footerText: { color: '#888', fontSize: 15 },
  loginLink: { color: '#DC2626', fontSize: 15, fontWeight: '700' },
});