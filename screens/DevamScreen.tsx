import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../types'; // RootStackParamList'i import ettik

type DevamScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Devam'>; // Türü burada belirtin

export default function DevamScreen() {
  const navigation = useNavigation<DevamScreenNavigationProp>(); // Türü burada belirtin

  return (
    <View style={styles.container}>
      {/* En Üste "OynaÖğren" Başlığı */}
      <Text style={styles.title}>OynaÖğren</Text>

      {/* Siyah Kedi ve "Hesabım Var" Butonu */}
      <View style={styles.topLeft}>
        <LottieView
          source={require('../assets/images/bee.json')}
          autoPlay
          loop
          style={styles.catAnimation}
        />
        <TouchableOpacity 
          style={styles.speechBubbleLeft} 
          onPress={() => navigation.navigate('Login')}  // Login sayfasına yönlendirme
        >
          <Text style={styles.speechText}>Hesabım Var</Text>
        </TouchableOpacity>
      </View>

      {/* Pembe Kedi ve "Hesap Oluştur" Butonu */}
      <View style={styles.bottomRight}>
        <LottieView
          source={require('../assets/images/bee_anim.json')}
          autoPlay
          loop
          style={styles.catAnimation}
        />
        <TouchableOpacity 
          style={styles.speechBubbleRight} 
          onPress={() => navigation.navigate('Register')}  // Register sayfasına yönlendirme
        >
          <Text style={styles.speechText}>Hesap Oluştur</Text>
        </TouchableOpacity>
      </View>

      {/* Ana Sayfaya Geri Dön Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Ana Sayfaya Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 40, 
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5D4037',
  },
  topLeft: {
    position: 'absolute',
    top: 100, 
    left: 20,
    alignItems: 'center',
  },
  bottomRight: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    alignItems: 'center',
  },
  catAnimation: {
    width: 200,
    height: 200,
  },
  speechBubbleLeft: {
    marginTop: 15,
    backgroundColor: '#F5A3C7',
    padding: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  speechBubbleRight: {
    marginTop: 15,
    backgroundColor: '#E91E63',
    padding: 12,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  speechText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#9B59B6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
