import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const EMERGENCY_TYPES = [
  { id: 'cpr', name: 'CPR', icon: '❤️', color: '#DC2626', critical: true },
  { id: 'choking', name: 'Choking', icon: '😮', color: '#F59E0B', critical: true },
  { id: 'bleeding', name: 'Bleeding', icon: '🩸', color: '#EF4444', critical: true },
  { id: 'burns', name: 'Burns', icon: '🔥', color: '#F97316', critical: false },
  { id: 'fracture', name: 'Fracture', icon: '🦴', color: '#8B5CF6', critical: false },
  { id: 'allergic', name: 'Allergic', icon: '🤧', color: '#EC4899', critical: true },
  { id: 'seizure', name: 'Seizure', icon: '⚡', color: '#6366F1', critical: true },
  { id: 'drowning', name: 'Drowning', icon: '💧', color: '#06B6D4', critical: true },
  { id: 'poison', name: 'Poison', icon: '☠️', color: '#84CC16', critical: true },
  { id: 'shock', name: 'Shock', icon: '🥶', color: '#0EA5E9', critical: true },
  { id: 'stroke', name: 'Stroke', icon: '🧠', color: '#A855F7', critical: true },
  { id: 'heat', name: 'Heat Stroke', icon: '🌡️', color: '#F43F5E', critical: true },
];

const SECONDARY_ACTIONS = [
  { id: 'phrases', name: 'Emergency Phrases', icon: '🗣️', desc: '6 languages' },
  { id: 'training', name: 'Training Mode', icon: '🎮', desc: 'Practice CPR' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header with Profile */}
          <View style={styles.header}>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{user?.fullName?.split(' ')[0] || 'User'}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
              {user?.photoUri ? (
                <View style={styles.profileImageContainer}>
                  <Text style={styles.profileImageText}>👤</Text>
                </View>
              ) : (
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>{getInitials(user?.fullName)}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Panic Button */}
          <TouchableOpacity
            style={styles.panicContainer}
            onPress={() => navigation.navigate('PanicMode')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#DC2626', '#991B1B']}
              style={styles.panicButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.panicIcon}>🚨</Text>
              <Text style={styles.panicTitle}>PANIC MODE</Text>
              <Text style={styles.panicSubtitle}>Tap for emergency help</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Emergency Grid */}
          <Text style={styles.sectionTitle}>Emergency Guides</Text>
          <View style={styles.grid}>
            {EMERGENCY_TYPES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridItem, { borderLeftColor: item.color }]}
                onPress={() => navigation.navigate('ARGuide', { type: item.id })}
                activeOpacity={0.8}
              >
                <Text style={styles.gridIcon}>{item.icon}</Text>
                <Text style={styles.gridName}>{item.name}</Text>
                {item.critical && <View style={[styles.criticalBadge, { backgroundColor: item.color }]}><Text style={styles.criticalText}>!</Text></View>}
              </TouchableOpacity>
            ))}
          </View>

          {/* Secondary Actions */}
          <Text style={styles.sectionTitle}>More Features</Text>
          <View style={styles.secondaryContainer}>
            {SECONDARY_ACTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.secondaryItem}
                onPress={() => navigation.navigate(item.id === 'phrases' ? 'EmergencyPhrases' : 'TrainingMode')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryIcon}>{item.icon}</Text>
                <View>
                  <Text style={styles.secondaryName}>{item.name}</Text>
                  <Text style={styles.secondaryDesc}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Stay safe. Be prepared.</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  gradient: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  greetingSection: { flex: 1 },
  greeting: { fontSize: 15, color: '#888', fontWeight: '500' },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 2 },
  profileBtn: { marginLeft: 12 },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  profileAvatarText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  profileImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  profileImageText: { fontSize: 20 },
  panicContainer: { marginBottom: 28, borderRadius: 20, overflow: 'hidden' },
  panicButton: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  panicIcon: { fontSize: 48, marginBottom: 8 },
  panicTitle: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  panicSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 14, marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridItem: {
    width: (width - 56) / 3,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  gridIcon: { fontSize: 28, marginBottom: 8 },
  gridName: { fontSize: 12, fontWeight: '700', color: '#fff', textAlign: 'center' },
  criticalBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  criticalText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  secondaryContainer: { marginBottom: 20 },
  secondaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  secondaryIcon: { fontSize: 28, marginRight: 16 },
  secondaryName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  secondaryDesc: { fontSize: 13, color: '#888', marginTop: 2 },
  footer: { alignItems: 'center', marginTop: 12 },
  footerText: { color: '#444', fontSize: 12, fontWeight: '500' },
});