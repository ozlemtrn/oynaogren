import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // StackNavigationProp'ı import edin
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../types'; // types.ts dosyasını import edin

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>; // Home ekranı için navigation türü

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Türü burada belirtin

  return (
    <View style={styles.container}>
      {/* Sağ Üstteki Arı Animasyonu */}
      <View style={styles.topRightContainer}>
        <LottieView
          source={require('../assets/images/bee.json')}
          autoPlay
          loop
          style={styles.beeAnimation}
        />
      </View>

      {/* Başlık ve Alt Metin */}
      <View style={styles.textContainer}>
        <Text style={styles.mainTitle}>OynaÖğren</Text>
        <Text style={styles.subTitle}>
          OynaÖğren ailesiyle bir yola çıkmaya hoşgeldiniz...
        </Text>
      </View>

      {/* Ortada Animasyonlu Görsel ve Buton */}
      <View style={styles.middleContainer}>
        <LottieView
          source={require('../assets/images/bee_anim.json')}
          autoPlay
          loop
          style={styles.centerAnimation}
        />
        
        {/* Butona Basınca Yeni Sayfaya Git */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Devam')}>
          <Text style={styles.buttonText}>Devam</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topRightContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
  },
  beeAnimation: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#424242',
    textAlign: 'center',
  },
  middleContainer: {
    alignItems: 'center',
  },
  centerAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
