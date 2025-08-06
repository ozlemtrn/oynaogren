// BaslangicVeSeviyeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'BaslangicVeSeviyeScreen'>;

const BaslangicVeSeviyeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Parametreyi dinamik olarak oluşturabilirsiniz
  const goToSoruHaritasi = () => {
    const answeredQuestionId = '1'; // Burada örnek olarak '1' kullanıyoruz
    navigation.navigate('MainTabs'); // Parametreyi ekliyoruz
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hoş Geldiniz!</Text>
      <Text style={styles.subHeader}>Ekrana başarılı bir şekilde geldiniz.</Text>

      <TouchableOpacity style={styles.button} onPress={goToSoruHaritasi}>
        <Text style={styles.buttonText}>Soru Haritasına Gidelim</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BaslangicVeSeviyeScreen;

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
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
