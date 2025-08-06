import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SoruDortScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SoruDortScreen'>;

const SoruDortScreen: React.FC = () => {
  const navigation = useNavigation<SoruDortScreenNavigationProp>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) {
      Alert.alert('Hata', 'Lütfen bir seçenek seçiniz.');
      return;
    }
    // Devam Et butonuna basıldığında BaslangicVeSeviyeScreen sayfasına geçiş
    navigation.navigate('BaslangicVeSeviyeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SORU-4</Text>
      <Text style={styles.subHeader}>Günlük öğrenme hedefin ne?</Text>

      <View style={styles.buttonContainer}>
        {["5 dakika", "10 dakika", "15 dakika", "20 dakika"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.optionButton, selectedOption === option && styles.selectedButton]}
            onPress={() => handleOptionSelect(option)}
          >
            <Text
              style={[styles.buttonText, selectedOption === option && styles.selectedButtonText]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
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

export default SoruDortScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff',
  },
  subHeader: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.3)',
    borderColor: '#0056b3',
  },
  buttonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#003c7f',
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
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
