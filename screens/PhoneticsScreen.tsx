// screens/PhoneticsScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Tts from 'react-native-tts';

const alphabet = [
  { letter: 'A', pronunciation: 'a' },
  { letter: 'B', pronunciation: 'bee' },
  { letter: 'C', pronunciation: 'see' },
  { letter: 'D', pronunciation: 'dee' },
  { letter: 'E', pronunciation: 'e' },
  { letter: 'F', pronunciation: 'f' },
  { letter: 'G', pronunciation: 'jee' },
  { letter: 'H', pronunciation: 'aitch' },
  { letter: 'I', pronunciation: 'eye' },
  { letter: 'J', pronunciation: 'jay' },
  { letter: 'K', pronunciation: 'kay' },
  { letter: 'L', pronunciation: 'el' },
  { letter: 'M', pronunciation: 'em' },
  { letter: 'N', pronunciation: 'en' },
  { letter: 'O', pronunciation: 'oh' },
  { letter: 'P', pronunciation: 'pee' },
  { letter: 'Q', pronunciation: 'cue' },
  { letter: 'R', pronunciation: 'r' },
  { letter: 'S', pronunciation: 'es' },
  { letter: 'T', pronunciation: 'tee' },
  { letter: 'U', pronunciation: 'you' },
  { letter: 'V', pronunciation: 'vee' },
  { letter: 'W', pronunciation: 'double you' },
  { letter: 'X', pronunciation: 'ex' },
  { letter: 'Y', pronunciation: 'why' },
  { letter: 'Z', pronunciation: 'zet' },
];

const vowelSounds = [
  { symbol: 'æ', example: 'cat' },
  { symbol: 'ʌ', example: 'but' },
  { symbol: 'ɑ', example: 'hot' },
  { symbol: 'ɛ', example: 'bed' },
  { symbol: 'ə', example: 'about' },
  { symbol: 'ɪ', example: 'ship' },
  { symbol: 'i', example: 'sheep' },
  { symbol: 'ʊ', example: 'foot' },
  { symbol: 'u', example: 'food' },
  { symbol: 'eɪ', example: 'say' },
  { symbol: 'aʊ', example: 'cow' },
  { symbol: 'oʊ', example: 'boat' },
  { symbol: 'aɪ', example: 'time' },
  { symbol: 'ɔɪ', example: 'boy' },
];

const consonantSounds = [
  { symbol: 'b', example: 'book' },
  { symbol: 'd', example: 'day' },
  { symbol: 'f', example: 'fish' },
  { symbol: 'g', example: 'go' },
  { symbol: 'h', example: 'home' },
  { symbol: 'ʤ', example: 'job' },
  { symbol: 'k', example: 'key' },
  { symbol: 'l', example: 'lion' },
  { symbol: 'm', example: 'moon' },
  { symbol: 'n', example: 'nose' },
  { symbol: 'ŋ', example: 'sing' },
  { symbol: 'p', example: 'pig' },
  { symbol: 'r', example: 'red' },
  { symbol: 's', example: 'see' },
  { symbol: 'ʃ', example: 'shoe' },
  { symbol: 't', example: 'time' },
  { symbol: 'θ', example: 'think' },
  { symbol: 'ð', example: 'then' },
  { symbol: 'v', example: 'very' },
  { symbol: 'w', example: 'water' },
  { symbol: 'j', example: 'you' },
  { symbol: 'z', example: 'zoo' },
  { symbol: 'ʒ', example: 'measure' },
  { symbol: 'ʧ', example: 'chair' },
];

const PhoneticsScreen = () => {
  const speak = (text: string) => {
    Tts.speak(text);
  };

  const renderGrid = (data: { symbol: string; example: string }[]) => (
    <View style={styles.grid}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => speak(item.example)}
        >
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.example}>{item.example}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAlphabet = () => (
    <View style={styles.grid}>
      {alphabet.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => speak(item.pronunciation)}
        >
          <Text style={styles.symbol}>{item.letter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>İngilizce Alfabesi</Text>
      {renderAlphabet()}
      <Text style={styles.sectionTitle}>Sesli Harfler - Örnek okunuşlar </Text>
      {renderGrid(vowelSounds)}
      <Text style={styles.sectionTitle}>Sessiz Harfler - Örnek okunuşlar </Text>
      {renderGrid(consonantSounds)}
    </ScrollView>
  );
};

export default PhoneticsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    alignSelf: 'flex-start',
    color: '#000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fde4ec',
    borderRadius: 12,
    padding: 12,
    width: 90,
    height: 90,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  example: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
});
