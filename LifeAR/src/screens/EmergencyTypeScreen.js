import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  {
    title: 'Cardiac',
    color: '#DC2626',
    items: [
      { id: 'cpr', name: 'Cardiac Arrest / CPR', icon: '❤️', critical: true },
      { id: 'heart-attack', name: 'Heart Attack', icon: '💔', critical: true },
    ],
  },
  {
    title: 'Airway',
    color: '#F59E0B',
    items: [
      { id: 'choking', name: 'Choking', icon: '😮', critical: true },
      { id: 'drowning', name: 'Drowning', icon: '💧', critical: true },
    ],
  },
  {
    title: 'Trauma',
    color: '#EF4444',
    items: [
      { id: 'bleeding', name: 'Severe Bleeding', icon: '🩸', critical: true },
      { id: 'fracture', name: 'Fracture / Broken Bone', icon: '🦴', critical: false },
      { id: 'burns', name: 'Burns', icon: '🔥', critical: false },
    ],
  },
  {
    title: 'Neurological',
    color: '#8B5CF6',
    items: [
      { id: 'seizure', name: 'Seizure', icon: '⚡', critical: true },
      { id: 'stroke', name: 'Stroke', icon: '🧠', critical: true },
      { id: 'fainting', name: 'Fainting', icon: '😵', critical: false },
    ],
  },
  {
    title: 'Medical',
    color: '#EC4899',
    items: [
      { id: 'allergic', name: 'Severe Allergic Reaction', icon: '🤧', critical: true },
      { id: 'poison', name: 'Poisoning', icon: '☠️', critical: true },
      { id: 'shock', name: 'Shock', icon: '🥶', critical: true },
    ],
  },
  {
    title: 'Environmental',
    color: '#06B6D4',
    items: [
      { id: 'heat', name: 'Heat Stroke', icon: '🌡️', critical: true },
      { id: 'hypothermia', name: 'Hypothermia', icon: '❄️', critical: true },
    ],
  },
];

export default function EmergencyTypeScreen({ navigation }) {
  const handleSelect = (item) => {
    navigation.navigate('ARGuide', { type: item.id });
  };

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Emergency Types</Text>
        <Text style={styles.headerSubtitle}>Select the emergency situation</Text>

        {CATEGORIES.map((category) => (
          <View key={category.title} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.itemsGrid}>
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, { borderLeftColor: category.color }]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.critical && (
                    <View style={[styles.criticalBadge, { backgroundColor: category.color }]}>
                      <Text style={styles.criticalText}>CRITICAL</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  categorySection: { marginBottom: 24 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  categoryDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  categoryTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  itemCard: {
    width: (width - 56) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    marginRight: 8,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    minHeight: 90,
  },
  itemIcon: { fontSize: 24, marginBottom: 8 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#fff', lineHeight: 18 },
  criticalBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  criticalText: { color: '#fff', fontSize: 9, fontWeight: '900' },
});