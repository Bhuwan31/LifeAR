import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const InfoRow = ({ icon, label, value, highlight }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, highlight && styles.highlightValue]}>
          {value || 'Not set'}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.photoUri ? (
              <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(user?.fullName)}</Text>
              </View>
            )}
            <View style={styles.statusIndicator} />
          </View>
          <Text style={styles.name}>{user?.fullName || 'User'}</Text>
          <Text style={styles.phone}>{user?.phone || ''}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
        </View>

        {/* Emergency Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🩺 Emergency Information</Text>
          <InfoRow icon="🩸" label="Blood Type" value={user?.bloodType} highlight />
          <InfoRow icon="📞" label="Emergency Contact" value={user?.emergencyContact} />
        </View>

        {/* Account Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Account Details</Text>
          <InfoRow icon="📱" label="Phone" value={user?.phone} />
          <InfoRow icon="✉️" label="Email" value={user?.email} />
          <InfoRow icon="📅" label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'} />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutBtnText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>LifeAR v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 28 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatarImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#DC2626' },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#0a0a0a',
  },
  name: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  phone: { fontSize: 15, color: '#888', marginBottom: 2 },
  email: { fontSize: 14, color: '#666' },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  infoIcon: { fontSize: 20, marginRight: 14, width: 28 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#666', marginBottom: 2, fontWeight: '600' },
  infoValue: { fontSize: 15, color: '#ccc', fontWeight: '500' },
  highlightValue: { color: '#EF4444', fontWeight: '700' },
  actions: { marginTop: 8 },
  editBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  logoutBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutBtnText: { color: '#EF4444', fontSize: 16, fontWeight: '700' },
  version: { textAlign: 'center', color: '#444', fontSize: 12, marginTop: 24 },
});