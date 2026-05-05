import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    bloodType: '',
    emergencyContact: '',
    photoUri: null,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        bloodType: user.bloodType || '',
        emergencyContact: user.emergencyContact || '',
        photoUri: user.photoUri || null,
      });
    }
  }, [user]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraStatus === 'granted' && libraryStatus === 'granted';
  };

  const pickImage = async (source) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please allow camera and photo access in settings.');
      return;
    }

    try {
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        updateField('photoUri', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: '📷 Take Photo', onPress: () => pickImage('camera') },
        { text: '🖼️ Choose from Gallery', onPress: () => pickImage('library') },
        {
          text: '🗑️ Remove Photo',
          onPress: () => updateField('photoUri', null),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validateForm = () => {
    const errors = {};
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Enter a valid phone number';
    }
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateProfile({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        bloodType: formData.bloodType.trim() || null,
        emergencyContact: formData.emergencyContact.trim() || null,
        photoUri: formData.photoUri,
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
          {/* Photo Section */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={showImagePickerOptions} activeOpacity={0.8}>
              {formData.photoUri ? (
                <Image source={{ uri: formData.photoUri }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>{getInitials(formData.fullName)}</Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                <Text style={styles.cameraBadgeText}>📷</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.photoHint}>Tap to change photo</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, formErrors.fullName && styles.inputError]}
                value={formData.fullName}
                onChangeText={(v) => updateField('fullName', v)}
                placeholder="Your full name"
                placeholderTextColor="#666"
                autoCapitalize="words"
                editable={!isLoading}
              />
              {formErrors.fullName && <Text style={styles.fieldError}>{formErrors.fullName}</Text>}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, formErrors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(v) => updateField('phone', v)}
                placeholder="+82 10-1234-5678"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                editable={!isLoading}
              />
              {formErrors.phone && <Text style={styles.fieldError}>{formErrors.phone}</Text>}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={[styles.input, formErrors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(v) => updateField('email', v)}
                placeholder="you@example.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              {formErrors.email && <Text style={styles.fieldError}>{formErrors.email}</Text>}
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Blood Type <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.bloodType}
                onChangeText={(v) => updateField('bloodType', v)}
                placeholder="A+, B-, O+, etc."
                placeholderTextColor="#666"
                autoCapitalize="characters"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Emergency Contact <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={styles.input}
                value={formData.emergencyContact}
                onChangeText={(v) => updateField('emergencyContact', v)}
                placeholder="Family member phone"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, isLoading && styles.btnDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>💾 Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  photoSection: { alignItems: 'center', marginBottom: 28 },
  photoImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#DC2626' },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  photoPlaceholderText: { fontSize: 40, fontWeight: '800', color: '#fff' },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  cameraBadgeText: { fontSize: 16 },
  photoHint: { color: '#666', fontSize: 13, marginTop: 10, fontWeight: '500' },
  form: { marginBottom: 20 },
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
  fieldError: { color: '#EF4444', fontSize: 12, marginTop: 6, marginLeft: 4 },
  saveBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});