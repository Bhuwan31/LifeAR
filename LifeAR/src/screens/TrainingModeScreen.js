import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

const LEVELS = [
  { id: 'basics', name: 'Basics', desc: 'Learn hand placement', difficulty: 1 },
  { id: 'rhythm', name: 'Rhythm', desc: 'Master 110 BPM', difficulty: 2 },
  { id: 'depth', name: 'Depth', desc: 'Proper compression depth', difficulty: 3 },
  { id: 'full', name: 'Full CPR', desc: 'Complete simulation', difficulty: 4 },
];

export default function TrainingModeScreen({ navigation }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [compressionCount, setCompressionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);
  const lastTapRef = useRef(0);
  const animRef = useRef(null);
  const countRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) animRef.current.stop();
      Speech.stop();
    };
  }, []);

  const startTraining = (level) => {
    setSelectedLevel(level);
    setIsTraining(true);
    setCompressionCount(0);
    setScore(0);
    setTimer(0);
    setStreak(0);
    countRef.current = 0;
    setFeedback('Tap in rhythm with the pulse!');

    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    Speech.speak('Training started. Follow the rhythm.', { rate: 1 }).catch(() => {});

    animRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 273, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 273, useNativeDriver: true }),
      ])
    );
    animRef.current.start();
  };

  const handleCompression = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    lastTapRef.current = now;

    countRef.current += 1;
    const newCount = countRef.current;
    setCompressionCount(newCount);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {}
    Vibration.vibrate(30);

    const targetInterval = 545;
    const tolerance = 150;

    if (timeSinceLastTap > 0) {
      const diff = Math.abs(timeSinceLastTap - targetInterval);
      if (diff < tolerance) {
        setScore((s) => s + 10);
        setStreak((st) => st + 1);
        setFeedback('Perfect rhythm! 🔥');
      } else if (diff < tolerance * 2) {
        setScore((s) => s + 5);
        setStreak(0);
        setFeedback('Good, keep steady');
      } else {
        setStreak(0);
        setFeedback('Too fast/slow - aim for 110 BPM');
      }
    }

    if (newCount % 30 === 0) {
      Speech.speak('Give two breaths', { rate: 1.1 }).catch(() => {});
      setFeedback('30 compressions! Give 2 rescue breaths');
    }
  }, []); // ✅ no stale deps

  const stopTraining = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) animRef.current.stop();
    setIsTraining(false);
    Speech.stop();
    pulseAnim.setValue(1);
  };
  // ... rest stays the same
}
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!isTraining) {
    return (
      <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Training Mode</Text>
          <Text style={styles.headerSubtitle}>Practice CPR skills safely</Text>

          <View style={styles.levelsContainer}>
            {LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={styles.levelCard}
                onPress={() => startTraining(level)}
                activeOpacity={0.8}
              >
                <View style={styles.levelHeader}>
                  <Text style={styles.levelIcon}>🎯</Text>
                  <View style={styles.difficultyDots}>
                    {[1, 2, 3, 4].map((d) => (
                      <View
                        key={d}
                        style={[
                          styles.difficultyDot,
                          d <= level.difficulty && styles.difficultyDotActive,
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.levelName}>{level.name}</Text>
                <Text style={styles.levelDesc}>{level.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Training Tips</Text>
            <Text style={styles.tipsText}>• Tap the button in rhythm with the pulse</Text>
            <Text style={styles.tipsText}>• Target: 110 compressions per minute</Text>
            <Text style={styles.tipsText}>• Every 30 compressions = 2 rescue breaths</Text>
            <Text style={styles.tipsText}>• Build streaks for higher scores</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a']} style={styles.trainingContainer}>
      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(timer)}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{compressionCount}</Text>
          <Text style={styles.statLabel}>Compressions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{score}</Text>
          <Text style={styles.statLabel}>Score</Text>
        </View>
      </View>

      {/* Streak */}
      {streak > 2 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streak} Streak!</Text>
        </View>
      )}

      {/* Pulse Circle */}
      <View style={styles.pulseSection}>
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.pulseIcon}>👐</Text>
          <Text style={styles.pulseLabel}>TAP</Text>
        </Animated.View>
      </View>

      {/* Feedback */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackText}>{feedback}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min((compressionCount % 30) / 30 * 100, 100)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{compressionCount % 30} / 30</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.compressBtn} onPress={handleCompression} activeOpacity={0.7}>
          <Text style={styles.compressBtnText}>COMPRESS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopBtn} onPress={stopTraining}>
          <Text style={styles.stopBtnText}>Stop Training</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#888', marginBottom: 24 },
  levelsContainer: { marginBottom: 24 },
  levelCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  levelIcon: { fontSize: 24 },
  difficultyDots: { flexDirection: 'row' },
  difficultyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginLeft: 4 },
  difficultyDotActive: { backgroundColor: '#DC2626' },
  levelName: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  levelDesc: { fontSize: 14, color: '#888' },
  tipsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  tipsTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 12 },
  tipsText: { fontSize: 14, color: '#aaa', marginBottom: 8, lineHeight: 20 },
  trainingContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 30 },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '900', color: '#fff', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4, fontWeight: '600' },
  streakBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  streakText: { color: '#F59E0B', fontSize: 16, fontWeight: '800' },
  pulseSection: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pulseCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderWidth: 3,
    borderColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseIcon: { fontSize: 40, marginBottom: 4 },
  pulseLabel: { fontSize: 14, fontWeight: '900', color: '#DC2626', letterSpacing: 2 },
  feedbackSection: { alignItems: 'center', marginBottom: 20 },
  feedbackText: { fontSize: 15, color: '#ccc', fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  progressBar: {
    width: width - 80,
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#DC2626', borderRadius: 4 },
  progressText: { fontSize: 12, color: '#666', marginTop: 6, fontWeight: '600' },
  controls: { marginTop: 'auto' },
  compressBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  compressBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  stopBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  stopBtnText: { color: '#888', fontSize: 15, fontWeight: '700' },
});