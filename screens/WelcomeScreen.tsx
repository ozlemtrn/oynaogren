import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type WelcomeScreenRouteProp = RouteProp<RootStackParamList, 'Welcome'>;
type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

type Props = {
  route: WelcomeScreenRouteProp;
};

const WelcomeScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { name } = route.params; // 'name' parametresini alıyoruz

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name}, sana bazı sorular soracağım</Text>

      {/* Lottie animasyonunu buraya ekliyoruz */}
      <LottieView
        source={require('../assets/images/bee.json')}  // Lottie animasyon JSON dosyasını buraya ekleyin
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Devam Et Butonu */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SoruBirScreen')}>
        <Text style={styles.buttonText}>Devam Et</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF9C4', padding: 20 },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#388E3C'  // Turkuaz rengi burada ekleniyor
  },
  animation: { width: 250, height: 250, marginBottom: 20 },
  button: { backgroundColor: '#000', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
