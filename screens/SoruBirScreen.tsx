import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SoruBirScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SoruBirScreen'>;

const SoruBirScreen = () => {
  const navigation = useNavigation<SoruBirScreenNavigationProp>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) {
      Alert.alert('Hata', 'Lütfen bir seçenek seçiniz.');
      return;
    }
    navigation.navigate('SoruikiScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SORU-1</Text>
      <Text style={styles.subHeader}>OynaÖğren uygulamasından nasıl haberdar oldunuz?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'Tanıdık önerisi' && styles.selectedButton]}
          onPress={() => handleOptionSelect('Tanıdık önerisi')}
        >
          <Text style={[styles.buttonText, selectedOption === 'Tanıdık önerisi' && styles.selectedButtonText]}>
            Tanıdık önerisi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'Google' && styles.selectedButton]}
          onPress={() => handleOptionSelect('Google')}
        >
          <Text style={[styles.buttonText, selectedOption === 'Google' && styles.selectedButtonText]}>
            Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'Play Store' && styles.selectedButton]}
          onPress={() => handleOptionSelect('Play Store')}
        >
          <Text style={[styles.buttonText, selectedOption === 'Play Store' && styles.selectedButtonText]}>
            Play Store
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, selectedOption === 'Diğer' && styles.selectedButton]}
          onPress={() => handleOptionSelect('Diğer')}
        >
          <Text style={[styles.buttonText, selectedOption === 'Diğer' && styles.selectedButtonText]}>
            Diğer
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !selectedOption && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!selectedOption}
      >
        <Text style={styles.continueButtonText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SoruBirScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#007bff' },
  subHeader: { fontSize: 18, textAlign: 'center', marginBottom: 30, color: '#555' },
  buttonContainer: { width: '100%', marginBottom: 20 },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.3)', // Daha şeffaf mavi
    borderColor: '#0056b3',
  },
  buttonText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' },
  selectedButtonText: {
    color: '#003c7f', // Koyu mavi seçilen metin için
  },
  continueButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#b0c4de',
  },
  continueButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
