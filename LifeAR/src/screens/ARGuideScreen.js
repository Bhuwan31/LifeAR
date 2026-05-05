import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const GUIDE_DATA = {
  cpr: {
    title: 'CPR Guide',
    steps: [
      'Place heel of hand on center of chest',
      'Place other hand on top, interlock fingers',
      'Push hard and fast: 2 inches deep, 110/min',
      'Allow chest to recoil between compressions',
      'Continue until help arrives or victim responds',
    ],
    overlay: 'hand-placement',
    bpm: 110,
  },
  choking: {
    title: 'Choking Guide',
    steps: [
      'Ask "Are you choking?" If yes, proceed',
      'Stand behind the person',
      'Wrap arms around waist',
      'Make fist above navel',
      'Thrust inward and upward sharply',
      'Repeat until object is expelled',
    ],
    overlay: 'heimlich',
    bpm: null,
  },
  bleeding: {
    title: 'Bleeding Control',
    steps: [
      'Apply direct pressure with clean cloth',
      'Elevate wound above heart level',
      'Maintain pressure for 10-15 minutes',
      'If severe, apply tourniquet 2-3 inches above wound',
      'Note time tourniquet was applied',
    ],
    overlay: 'pressure',
    bpm: null,
  },
  burns: {
    title: 'Burn Treatment',
    steps: [
      'Remove from heat source',
      'Cool with running water for 10-20 minutes',
      'Do NOT apply ice, butter, or ointments',
      'Cover loosely with sterile non-stick dressing',
      'Seek medical attention for severe burns',
    ],
    overlay: 'cooling',
    bpm: null,
  },
  default: {
    title: 'First Aid Guide',
    steps: [
      'Ensure scene safety first',
      'Check victim responsiveness',
      'Call emergency services (119)',
      'Assess breathing and pulse',
      'Provide appropriate first aid',
    ],
    overlay: 'general',
    bpm: null,
  },
};

export default function ARGuideScreen({ route, navigation }) {
  const type = route.params?.type || 'default';
  const guide = GUIDE_DATA[type] || GUIDE_DATA.default;
  const [permission, requestPermission] = useCameraPermissions();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (guide.bpm) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [guide.bpm]);

  const speakStep = (index) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    Speech.speak(guide.steps[index], {
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const nextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep((s) => Math.min(guide.steps.length - 1, s + 1));
  };

  const prevStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  return (
    <View style={styles.container}>
      {permission?.granted ? (
        <CameraView style={styles.camera} facing="back" />
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.placeholderText}>Camera access required for AR guide</Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* AR Overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Header */}
        <View style={styles.header} pointerEvents="auto">
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{guide.title}</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepIndicatorText}>
              {currentStep + 1} / {guide.steps.length}
            </Text>
          </View>
        </View>

        {/* AR Visual Guide */}
        <View style={styles.arVisual} pointerEvents="none">
          {type === 'cpr' && (
            <Animated.View style={[styles.arCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.arCircleText}>👐</Text>
              <Text style={styles.arCircleLabel}>Place Hands Here</Text>
            </Animated.View>
          )}
          {type === 'choking' && (
            <View style={styles.arBox}>
              <Text style={styles.arBoxText}>🤜</Text>
              <Text style={styles.arBoxLabel}>Fist above navel</Text>
            </View>
          )}
          {type === 'bleeding' && (
            <View style={styles.arBox}>
              <Text style={styles.arBoxText}>✋</Text>
              <Text style={styles.arBoxLabel}>Apply Pressure</Text>
            </View>
          )}
          {type === 'burns' && (
            <View style={styles.arBox}>
              <Text style={styles.arBoxText}>💧</Text>
              <Text style={styles.arBoxLabel}>Cool with Water</Text>
            </View>
          )}
        </View>

        {/* Bottom Panel */}
        <View style={styles.bottomPanel} pointerEvents="auto">
          <View style={styles.stepCard}>
            <Text style={styles.stepNumber}>Step {currentStep + 1}</Text>
            <Text style={styles.stepText}>{guide.steps[currentStep]}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} onPress={prevStep}>
              <Text style={styles.controlBtnText}>← Prev</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.speakBtn, isSpeaking && styles.speakActive]}
              onPress={() => speakStep(currentStep)}
            >
              <Text style={styles.speakBtnText}>{isSpeaking ? '🔊 Stop' : '🔊 Speak'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn} onPress={nextStep}>
              <Text style={styles.controlBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: { color: '#888', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  permissionBtn: { backgroundColor: '#DC2626', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  permissionBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  overlay: { flex: 1, justifyContent: 'space-between' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backBtn: { padding: 8 },
  backBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#fff' },
  stepIndicator: { backgroundColor: '#DC2626', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  stepIndicatorText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  arVisual: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  arCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#DC2626',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arCircleText: { fontSize: 40 },
  arCircleLabel: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 4 },
  arBox: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
  },
  arBoxText: { fontSize: 40 },
  arBoxLabel: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 8 },
  bottomPanel: {
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  stepCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  stepNumber: { fontSize: 12, color: '#DC2626', fontWeight: '800', marginBottom: 6, textTransform: 'uppercase' },
  stepText: { fontSize: 16, color: '#fff', fontWeight: '600', lineHeight: 22 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  controlBtn: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  controlBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  speakBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  speakActive: { backgroundColor: '#991B1B' },
  speakBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});