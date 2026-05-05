import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';

const LANGUAGES = [
  { code: 'ko', name: 'Korean', flag: '🇰🇷', locale: 'ko-KR' },
  { code: 'en', name: 'English', flag: '🇺🇸', locale: 'en-US' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵', locale: 'ne-NP' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', locale: 'zh-CN' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', locale: 'vi-VN' },
];

const PHRASES = {
  en: [
    'Help! There is an emergency!',
    'Please call an ambulance.',
    'Where is the nearest hospital?',
    'I need a doctor immediately.',
    'Someone is not breathing.',
    'There has been an accident.',
    'I am allergic to...',
    'What is your blood type?',
  ],
  ko: [
    '도와주세요! 응급 상황입니다!',
    '구급차를 불러주세요.',
    '가장 가까운 병원은 어디인가요?',
    '당장 의사가 필요합니다.',
    '누군가 숨을 쉬지 않습니다.',
    '사고가 났습니다.',
    '저는 ...에 알레르기가 있습니다.',
    '혈액형이 어떻게 되세요?',
  ],
  ne: [
    'मद्दत गर्नुहोस्! आपतकालीन अवस्था छ!',
    'कृपया एम्बुलेन्स बोलाउनुहोस्।',
    'नजिकको अस्पताल कहाँ छ?',
    'मलाई तुरुन्त डाक्टर चाहिन्छ।',
    'कसैले सास फेर्दैन।',
    'दुर्घटना भएको छ।',
    'मलाई ...मा एलर्जी छ।',
    'तपाईंको रक्त समूह के हो?',
  ],
  zh: [
    '救命！有紧急情况！',
    '请叫救护车。',
    '最近的医院在哪里？',
    '我需要马上看医生。',
    '有人没有呼吸了。',
    '发生事故了。',
    '我对...过敏。',
    '你是什么血型？',
  ],
  ja: [
    '助けて！緊急事態です！',
    '救急車を呼んでください。',
    '一番近い病院はどこですか？',
    'すぐに医者が必要です。',
    '誰かが呼吸していません。',
    '事故が起きました。',
    '私は...にアレルギーがあります。',
    '血液型は何型ですか？',
  ],
  vi: [
    'Cứu tôi! Có tình huống khẩn cấp!',
    'Vui lòng gọi xe cứu thương.',
    'Bệnh viện gần nhất ở đâu?',
    'Tôi cần bác sĩ ngay lập tức.',
    'Có người không thở được.',
    'Đã xảy ra tai nạn.',
    'Tôi bị dị ứng với...',
    'Nhóm máu của bạn là gì?',
  ],
};

export default function EmergencyPhrasesScreen({ navigation }) {
  const [selectedLang, setSelectedLang] = useState('ko');
  const [speakingId, setSpeakingId] = useState(null);

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang);
  const phrases = PHRASES[selectedLang] || PHRASES.en;

  const speakPhrase = (text, index) => {
    if (speakingId === index) {
      Speech.stop();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(index);
    Speech.speak(text, {
      language: currentLang?.locale || 'en-US',
      rate: 0.85,
      onDone: () => setSpeakingId(null),
      onStopped: () => setSpeakingId(null),
    });
  };

  const renderPhrase = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.phraseCard, speakingId === index && styles.phraseActive]}
      onPress={() => speakPhrase(item, index)}
      activeOpacity={0.8}
    >
      <View style={styles.phraseRow}>
        <Text style={styles.phraseNumber}>{index + 1}</Text>
        <Text style={styles.phraseText}>{item}</Text>
      </View>
      <Text style={styles.speakHint}>{speakingId === index ? '🔊 Playing...' : '🔊 Tap to speak'}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#0a0a0a', '#1a1a1a', '#0a0a0a']} style={styles.container}>
      {/* Language Selector */}
      <View style={styles.langHeader}>
        <Text style={styles.langTitle}>Select Language</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langList}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langChip, selectedLang === lang.code && styles.langChipActive]}
              onPress={() => {
                Speech.stop();
                setSpeakingId(null);
                setSelectedLang(lang.code);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langName, selectedLang === lang.code && styles.langNameActive]}>
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Phrases List */}
      <FlatList
        data={phrases}
        renderItem={renderPhrase}
        keyExtractor={(_, i) => `${selectedLang}-${i}`}
        contentContainerStyle={styles.phrasesList}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  langHeader: { paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  langTitle: { fontSize: 14, fontWeight: '700', color: '#888', marginLeft: 20, marginBottom: 10 },
  langList: { paddingHorizontal: 16 },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  langChipActive: { backgroundColor: '#DC2626', borderColor: '#DC2626' },
  langFlag: { fontSize: 18, marginRight: 6 },
  langName: { fontSize: 13, fontWeight: '600', color: '#ccc' },
  langNameActive: { color: '#fff', fontWeight: '800' },
  phrasesList: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  phraseCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  phraseActive: { borderColor: '#DC2626', backgroundColor: 'rgba(220, 38, 38, 0.1)' },
  phraseRow: { flexDirection: 'row', alignItems: 'flex-start' },
  phraseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 13,
    fontWeight: '800',
    marginRight: 14,
    marginTop: 2,
  },
  phraseText: { flex: 1, fontSize: 16, color: '#fff', fontWeight: '600', lineHeight: 22 },
  speakHint: { fontSize: 12, color: '#666', marginTop: 10, marginLeft: 42, fontWeight: '500' },
});