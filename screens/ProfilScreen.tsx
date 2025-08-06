import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { questions } from '../data';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ProfilScreen'>;

const ProfilScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [completedUnits, setCompletedUnits] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const uid = auth().currentUser?.uid;
      if (!uid) return;
  
      try {
        const userDoc = await firestore().collection('users').doc(uid).get();
        const data = userDoc.data();
        setUserData(data);
  
        if (data?.profileUrl) setProfileUrl(data.profileUrl);
  
        // ✅ İlerleme yüzdesi hesaplama
        const progressUnits = data?.progress?.units || {};
        const unitEntries = Object.entries(progressUnits);
  
        const unlockedUnits = unitEntries.filter(
          ([_, unitData]: any) => unitData.locked === false || unitData.locked === undefined
        );
  
        const uniqueUnits = new Set(questions.map(q => q.unit));
        const total = uniqueUnits.size;
        const completed = unlockedUnits.length; // ❌ -1 YOK
  
        const percentage = total > 0
          ? Math.floor((completed / total) * 100)
          : 0;
  
        setTotalUnits(total);
        setCompletedUnits(completed);
        setCompletedPercentage(percentage);
      } catch (e) {
        console.error('Veri alınamadı:', e);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);
  

  const handleLogout = async () => {
    await auth().signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (result.didCancel || !result.assets?.length) return;

    const image = result.assets[0];
    if (!image.uri) return;

    try {
      const uid = auth().currentUser?.uid;
      const ref = storage().ref(`/profilePictures/${uid}.jpg`);
      await ref.putFile(image.uri);
      const url = await ref.getDownloadURL();
      setProfileUrl(url);
      await firestore().collection('users').doc(uid!).update({ profileUrl: url });
      Alert.alert('Başarılı', 'Profil fotoğrafı güncellendi!');
    } catch (err) {
      Alert.alert('Hata', 'Fotoğraf yüklenemedi.');
    }
  };

  if (loading) {
    return (
      <View style={lightStyles.centered}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  const email = auth().currentUser?.email || 'Bilinmiyor';
  const name = userData?.name || 'Kullanıcı';
  const age = userData?.age || 'Bilinmiyor';
  const phone = userData?.phone ? '••••••••' + userData.phone.toString().slice(-2) : 'Bilinmiyor';
  const startDate = userData?.startDate ? new Date(userData.startDate).toLocaleDateString() : 'Bilinmiyor';

  const theme = darkMode ? darkStyles : lightStyles;

  return (
    <ScrollView style={theme.scroll}>
      <View style={theme.header} />
      <View style={theme.container}>
        <Image source={profileUrl ? { uri: profileUrl } : require('../assets/icons/profile.png')} style={theme.avatar} />
        <TouchableOpacity onPress={handleImagePick}>
          <Text style={theme.changePhotoText}>📸 Profil Fotoğrafını Değiştir</Text>
        </TouchableOpacity>
        <Text style={theme.name}>{name}</Text>
        <Text style={theme.email}>{email}</Text>

        <View style={theme.progressContainer}>
          <Text style={theme.label}>İlerleme:</Text>
          <View style={theme.progressBar}>
            <View style={[theme.progressFill, { width: `${completedPercentage}%` }]} />
          </View>
          <Text style={theme.progressText}>
            {completedPercentage}% tamamlandı ({completedUnits}/{totalUnits})
          </Text>
        </View>

        <TouchableOpacity style={theme.themeToggle} onPress={() => setDarkMode(!darkMode)}>
          <Text style={theme.themeText}>{darkMode ? '☀️ Açık Tema' : '🌙 Koyu Tema'}</Text>
        </TouchableOpacity>

        <View style={theme.infoCard}>
          <InfoRow label="👤 Yaş" value={age} darkMode={darkMode} />
          <InfoRow label="📞 Telefon" value={phone} darkMode={darkMode} />
          <InfoRow label="📅 Katılım Tarihi" value={startDate} darkMode={darkMode} />
        </View>

        <TouchableOpacity style={theme.logoutButton} onPress={handleLogout}>
          <Text style={theme.logoutText}>🚪 Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value, darkMode }: { label: string; value: string; darkMode: boolean }) => {
  const theme = darkMode ? darkStyles : lightStyles;
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={theme.label}>{label}:</Text>
      <Text style={theme.value}>{value}</Text>
    </View>
  );
};

// 🔆 Tema stilleri
const lightStyles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#FFFDF6' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 140,
    backgroundColor: '#FFF8E1',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  container: { alignItems: 'center', marginTop: -60, paddingHorizontal: 20 },
  avatar: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 3, borderColor: '#fff', backgroundColor: '#eee', marginBottom: 8, elevation: 5,
  },
  changePhotoText: { color: '#888', fontSize: 13, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#111' },
  email: { fontSize: 14, color: '#666', marginBottom: 18 },
  progressContainer: { width: '100%', marginBottom: 20 },
  progressBar: {
    height: 14, backgroundColor: '#ddd', borderRadius: 8, overflow: 'hidden', marginTop: 4,
  },
  progressFill: { height: '100%', backgroundColor: '#FFA726' },
  progressText: { marginTop: 6, fontSize: 14, color: '#444', fontWeight: '500' },
  themeToggle: {
    marginBottom: 20, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#eeeeee', borderRadius: 20,
  },
  themeText: { color: '#333', fontWeight: '600' },
  infoCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 30, elevation: 3,
  },
  label: { fontSize: 15, fontWeight: '600', color: '#333' },
  value: { fontSize: 15, color: '#000', marginTop: 2 },
  logoutButton: {
    backgroundColor: '#FFA726', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, elevation: 2,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const darkStyles = {
  ...lightStyles,
  scroll: { flex: 1, backgroundColor: '#3C3C3C' },
  header: {
    height: 140,
    backgroundColor: '#DCD6C0',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  changePhotoText: { ...lightStyles.changePhotoText, color: '#DDDDDD' },
  name: { ...lightStyles.name, color: '#FFFFFF' },
  email: { ...lightStyles.email, color: '#CCCCCC' },
  progressBar: { ...lightStyles.progressBar, backgroundColor: '#6D6D6D' },
  progressText: { ...lightStyles.progressText, color: '#EEEEEE' },
  themeToggle: { ...lightStyles.themeToggle, backgroundColor: '#666666' },
  themeText: { ...lightStyles.themeText, color: '#fff' },
  infoCard: { ...lightStyles.infoCard, backgroundColor: '#4A4A4A' },
  label: { ...lightStyles.label, color: '#F0F0F0' },
  value: { ...lightStyles.value, color: '#FFFFFF' },
  logoutButton: { ...lightStyles.logoutButton, backgroundColor: '#FFA726' },
  logoutText: { ...lightStyles.logoutText, color: '#fff' },
};

export default ProfilScreen;
