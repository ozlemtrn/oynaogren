import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SoruUcScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SoruUcScreen'>;

const SoruUcScreen: React.FC = () => {
  const navigation = useNavigation<SoruUcScreenNavigationProp>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) {
      Alert.alert('Hata', 'Lütfen bir seçenek seçiniz.');
      return;
    }
    // Devam Et butonuna basıldığında sonraki ekrana geçiş
    navigation.navigate('SoruDortScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SORU-3</Text>
      <Text style={styles.subHeader}>İngilizce dil seviyen nedir?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'Daha önce ingilizce deneyimim yok' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('Daha önce ingilizce deneyimim yok')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'Daha önce ingilizce deneyimim yok' && styles.selectedButtonText,
            ]}
          >
            Daha önce ingilizce deneyemim yok
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'A seviye' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('A seviye')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'A seviye' && styles.selectedButtonText,
            ]}
          >
            A seviye
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'B seviye' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('B seviye')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'B seviye' && styles.selectedButtonText,
            ]}
          >
            B seviye
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'C seviye' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('C seviye')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'C seviye' && styles.selectedButtonText,
            ]}
          >
            C seviye
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

export default SoruUcScreen;

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
  },
  selectedButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.3)', // Yarı şeffaf mavi
    borderColor: '#0056b3',
  },
  buttonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#003c7f', // Seçili butonda metin rengi biraz koyu
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
