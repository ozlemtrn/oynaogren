import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert
} from 'react-native';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '781984848645-d7nhrnoutef68s0n8n1vkjm3mhsmqru7.apps.googleusercontent.com', // ✅ bu web client
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['email', 'profile'],
    });    
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      const userDocRef = firestore().collection('users').doc(uid);
      const docSnapshot = await userDocRef.get();

      if (!docSnapshot.exists) {
        const initializeUserProgress = functions().httpsCallable('initializeUserProgress');
        await initializeUserProgress();
      }

      Alert.alert('Başarılı', 'Giriş başarılı!');
      navigation.navigate('MainTabs');
    } catch (error: any) {
      Alert.alert('Giriş Hatası', error.message || 'Bilinmeyen hata.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
  
      const idToken = tokens.idToken;
  
      if (!idToken) {
        Alert.alert('Hata', 'Google girişinde idToken alınamadı.');
        return;
      }
  
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
  
      Alert.alert('Başarılı', 'Google ile giriş yapıldı.');
      navigation.navigate('MainTabs');
    } catch (error: any) {
      console.log('GOOGLE SIGN-IN ERROR:', JSON.stringify(error, null, 2));
      Alert.alert('Google Giriş Hatası', error.code || error.message || 'Bilinmeyen hata');
    }
  };
  
  
  
  return (
    <View style={styles.container}>
      {/* Üst köşe arılar */}
      <Image source={require('../assets/arilar/bee.png')} style={styles.topLeftBee} />
      <Image source={require('../assets/arilar/nature.png')} style={styles.topRightBee} />

      <Text style={styles.title}>Giriş Yap</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Şifre"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, loading && { backgroundColor: '#cfa900' }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image source={require('../assets/images/google.png')} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Hesabım Yok</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9e7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  topLeftBee: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  topRightBee: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e6ac00',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#e6ac00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f1f1',
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    resizeMode: 'contain',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  registerText: {
    fontSize: 15,
    color: '#444',
  },
});
