import React, { useState } from 'react';
import {
  View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !age.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    if (isNaN(Number(age)) || Number(age) <= 0) {
      Alert.alert('Hata', 'Geçerli bir yaş giriniz.');
      return;
    }

    if (!/^\d{10,}$/.test(phone)) {
      Alert.alert('Hata', 'Telefon numarası en az 10 haneli olmalıdır.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      await firestore().collection('users').doc(userId).set({
        name: fullName,
        email: email,
        phone: phone,
        age: age,
        lives: 5,
        points: 0,
        globalScore: 0,
        startDate: new Date().toISOString(),
      });

      const initializeUserProgress = functions().httpsCallable('initializeUserProgress');
      const result = await initializeUserProgress({ userId });

      Alert.alert('Başarılı', 'Kayıt tamamlandı!');
      navigation.navigate('Welcome', { name: fullName });

    } catch (error: any) {
      let errorMessage = 'Bilinmeyen hata.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanımda.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifre en az 6 karakter olmalıdır.';
      }

      Alert.alert('Kayıt Hatası', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Üst köşelerde arılar */}
      <Image source={require('../assets/arilar/bee.png')} style={styles.topLeftBee} />
      <Image source={require('../assets/arilar/nature.png')} style={styles.topRightBee} />

      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="İsim Soyisim"
        value={fullName}
        onChangeText={setFullName}
        placeholderTextColor="#000"
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Yaş"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        placeholderTextColor="#000"
      />
      <TextInput
        style={styles.input}
        placeholder="Telefon"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#000"
      />
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#000"
      />

      {/* Şifre + Göz ikonu */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Şifre"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#000"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kayıt Ol'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Hesabım Var</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefcf3',
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
    marginBottom: 25,
    color: '#e6ac00',
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: '90%',
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 12,
    elevation: 1,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#e6ac00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 15,
    color: '#666',
    fontSize: 16,
  },
});
