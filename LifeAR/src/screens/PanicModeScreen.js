import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Dimensions,
  Animated,
  Linking,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const EMERGENCY_STEPS = [
  { step: 1, title: 'Check Scene Safety', desc: 'Ensure the area is safe for you and the victim.' },
  { step: 2, title: 'Check Responsiveness', desc: 'Tap shoulders and shout "Are you okay?"' },
  { step: 3, title: 'Call 119', desc: 'Emergency services are being contacted.' },
  { step: 4, title: 'Check Breathing', desc: 'Look, listen, and feel for breathing for 10 seconds.' },
  { step: 5, title: 'Start CPR', desc: '30 compressions, then 2 rescue breaths. Repeat.' },
];

export default function PanicModeScreen({ navigation }) {
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [compressionCount, setCompressionCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    if (countdown > 0 && !isActive) {
      const t = setTimeout(() => {
        setCountdown((c) => c - 1);
        Vibration.vibrate(200);
        Speech.speak(countdown.toString(), { rate: 0.8 });
      }, 1000);
      return () => clearTimeout(t);
    } else if (countdown === 0 && !isActive) {
      activatePanicMode();
    }
  }, [countdown, isActive]);

  const activatePanicMode = useCallback(async () => {
    setIsActive(true);
    Vibration.vibrate([0, 500, 200, 500]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Speech.speak('Panic mode activated. Emergency protocol initiated.', { rate: 0.9 });

    // Auto-dial 119 (Korea emergency)
    try {
      await Linking.openURL('tel:119');
    } catch {
      // Fallback if dial fails
    }

    // Start timer
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    // Pulse animation for metronome
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 300, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      Speech.stop();
    };
  }, []);

  const handleCompression = () => {
    setCompressionCount((c) => c + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (compressionCount % 30 === 29) {
      Speech.speak('Give two rescue breaths', { rate: 1 });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Emergency',
      'Are you sure you want to cancel?',
      [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => {
            if (timerRef.current) clearInterval(timerRef.current);
            Speech.stop();
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!isActive) {
    return (
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownLabel}>Activating Panic Mode in</Text>
        <Text style={styles.countdownNumber}>{countdown}</Text>
        <Text style={styles.countdownSub}>Tap anywhere to cancel</Text>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.activeContainer}>
      {/* Camera Background */}
      {permission?.granted ? (
        <CameraView style={styles.camera} facing="back" />
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraPlaceholderText}>Camera access needed for AR guide</Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyBadgeText}>🚨 EMERGENCY ACTIVE</Text>
          </View>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
        </View>

        {/* Step Guide */}
        <View style={styles.stepsContainer}>
          {EMERGENCY_STEPS.map((s, index) => (
            <View
              key={s.step}
              style={[
                styles.stepItem,
                index === currentStep && styles.stepActive,
                index < currentStep && styles.stepCompleted,
              ]}
            >
              <Text style={styles.stepNumber}>{s.step}</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                {index === currentStep && <Text style={styles.stepDesc}>{s.desc}</Text>}
              </View>
            </View>
          ))}
        </View>

        {/* Compression Counter */}
        <View style={styles.compressionSection}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.compressionCount}>{compressionCount}</Text>
            <Text style={styles.compressionLabel}>Compressions</Text>
          </Animated.View>
          <Text style={styles.bpmText}>Target: 110 BPM</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.compressBtn} onPress={handleCompression} activeOpacity={0.7}>
            <Text style={styles.compressBtnText}>👋 TAP TO COMPRESS</Text>
          </TouchableOpacity>

          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navBtn, styles.prevBtn]}
              onPress={() => setCurrentStep((s) => Math.max(0, s - 1))}
            >
              <Text style={styles.navBtnText}>← Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navBtn, styles.nextBtn]}
              onPress={() => setCurrentStep((s) => Math.min(EMERGENCY_STEPS.length - 1, s + 1))}
            >
              <Text style={styles.navBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.endBtn} onPress={handleCancel}>
            <Text style={styles.endBtnText}>End Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  countdownContainer: {
    flex: 1,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  countdownLabel: { fontSize: 20, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 20 },
  countdownNumber: { fontSize: 120, fontWeight: '900', color: '#fff' },
  countdownSub: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 20 },
  cancelBtn: {
    marginTop: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  activeContainer: { flex: 1, backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  cameraPlaceholderText: { color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permissionBtn: { backgroundColor: '#DC2626', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  permissionBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  emergencyBadge: {
    backgroundColor: '#DC2626',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  emergencyBadgeText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  timer: { fontSize: 20, fontWeight: '800', color: '#fff', fontVariant: ['tabular-nums'] },
  stepsContainer: { marginBottom: 16 },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    opacity: 0.5,
  },
  stepActive: { backgroundColor: 'rgba(220, 38, 38, 0.2)', borderWidth: 1, borderColor: '#DC2626', opacity: 1 },
  stepCompleted: { opacity: 0.8 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 13,
    fontWeight: '800',
    marginRight: 12,
  },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  stepDesc: { fontSize: 12, color: '#aaa', marginTop: 2 },
  compressionSection: { alignItems: 'center', marginBottom: 16 },
  pulseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
    borderWidth: 2,
    borderColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  compressionCount: { fontSize: 32, fontWeight: '900', color: '#fff' },
  compressionLabel: { fontSize: 11, color: '#aaa', fontWeight: '600' },
  bpmText: { fontSize: 13, color: '#888', fontWeight: '500' },
  actions: { marginTop: 'auto' },
  compressBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  compressBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  navButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  prevBtn: { marginLeft: 0 },
  nextBtn: { marginRight: 0 },
  navBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  endBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  endBtnText: { color: '#EF4444', fontSize: 14, fontWeight: '700' },
});