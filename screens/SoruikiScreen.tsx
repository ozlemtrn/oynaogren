import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SoruikiScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SoruikiScreen'>;

const SoruikiScreen = () => {
  const navigation = useNavigation<SoruikiScreenNavigationProp>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (!selectedOption) {
      Alert.alert('Hata', 'Lütfen bir seçenek seçiniz.');
      return;
    }
    // Seçenek seçildiyse SoruUcScreen'e geçiş yapıyoruz.
    navigation.navigate('SoruUcScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>SORU-2</Text>
      <Text style={styles.subHeader}>Neden İngilizce öğreniyorsun?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'Kariyerimi güçlendirmek için' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('Kariyerimi güçlendirmek için')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'Kariyerimi güçlendirmek için' && styles.selectedButtonText,
            ]}
          >
            Kariyerimi güçlendirmek için
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'Eğitimimi ilerletmek için' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('Eğitimimi ilerletmek için')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'Eğitimimi ilerletmek için' && styles.selectedButtonText,
            ]}
          >
            Eğitimimi ilerletmek için
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'Seyahata hazırlık için' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('Seyahata hazırlık için')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'Seyahata hazırlık için' && styles.selectedButtonText,
            ]}
          >
            Seyahata hazırlık için
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selectedOption === 'Daha üretken fikirler sunmak için' && styles.selectedButton,
          ]}
          onPress={() => handleOptionSelect('Daha üretken fikirler sunmak için')}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === 'Daha üretken fikirler sunmak için' && styles.selectedButtonText,
            ]}
          >
            Daha üretken fikirler sunmak için
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

export default SoruikiScreen;

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
    backgroundColor: 'rgba(0, 123, 255, 0.3)', // Daha şeffaf bir mavi
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
