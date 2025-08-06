import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ImageBackground, Image, Alert
} from 'react-native';
import Svg, { Line } from 'react-native-svg';
import LottieView from 'lottie-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { questions, QuestionItem } from '../data';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Modal from 'react-native-modal';
import functions from '@react-native-firebase/functions';
import { Linking } from 'react-native';


type SoruHaritasiNavigationProp = StackNavigationProp<RootStackParamList, 'SoruHaritasiScreen'>;

const SoruHaritasiScreen: React.FC = () => {
  const navigation = useNavigation<SoruHaritasiNavigationProp>();
  const [questionList] = useState<QuestionItem[]>(questions);
  const [expandedUnit, setExpandedUnit] = useState<number | null>(1);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [unitLockState, setUnitLockState] = useState<{ [unitId: number]: boolean }>({});
  const [isModalVisible, setModalVisible] = useState(false);

  const units = [
    { id: 1, title: '1. Ünite: İçecek teklif et ve kabul et' },
    { id: 2, title: '2. Ünite: Nereli olduğunu söyle' },
    { id: 3, title: '3. Ünite: Kendini ve aileni tanıt' },
    { id: 4, title: '4. Ünite: Havaalanında yolunu bul' },
    { id: 5, title: '5. Ünite: İsim tanımı için sıfat kullan' },
    { id: 6, title: '6. Ünite: Yiyecek ve içecek siparişi ver' },
    { id: 7, title: '7. Ünite: Meslekler için şimdiki zamanı kullan' },
  ];

  const fetchProgress = useCallback(async () => {
    const user = auth().currentUser;
    if (!user) return;

    const doc = await firestore().collection('users').doc(user.uid).get();
    const data = doc.data();
    setUserProgress(data);

    const progress = data?.progress?.units ?? {};
    const lockState: { [key: number]: boolean } = {};

    for (let i = 1; i <= units.length; i++) {
      if (i === 1) {
        lockState[i] = false;
      } else {
        const prev = progress[i - 1]?.correctAnswers ?? [];
        const prevQuestions = questionList.filter(q => q.unit === i - 1 && !q.extra);
        const isPrevUnitComplete = prevQuestions.every(q => prev.includes(q.id));
        lockState[i] = !isPrevUnitComplete;
      }
    }    

    setUnitLockState(lockState);
    setExpandedUnit(null);
  }, [questionList]);

  useFocusEffect(useCallback(() => {
    fetchProgress();
  }, [fetchProgress]));

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth().currentUser;
      if (!user) return;
  
      const ref = firestore().collection('users').doc(user.uid);
      const doc = await ref.get();
      const data = doc.data();
  
      const lives = data?.lives ?? 5;
      const last = data?.lastLifeUpdate?.toDate?.() ?? new Date();
      const now = new Date();
      const diff = Math.floor((now.getTime() - last.getTime()) / 60000); // dakika cinsinden fark
      const canEklenecek = Math.min(5 - lives, Math.floor(diff / 10)); // her 10 dakikada 1 can
  
      if (canEklenecek > 0) {
        await ref.update({
          lives: Math.min(lives + canEklenecek, 5),
          lastLifeUpdate: firestore.FieldValue.serverTimestamp(),
        });
        fetchProgress(); // UI'yı da güncelle
      }
    }, 30000); // Her 30 saniyede bir kontrol et
  
    return () => clearInterval(interval); // Sayfa kapanınca durdur
  }, []);
  

  const getIsQuestionEnabled = (q: QuestionItem): boolean => {
    const unitKey = (q.unit ?? 1).toString();
    const correct = userProgress?.progress?.units?.[unitKey]?.correctAnswers ?? [];
  
    // Bonus sorular için: sadece çözülmüşse açık
    if (q.extra === true) {
      return correct.includes(q.id);
    }
  
    // Normal sorular için: sıradaki soru ya da çözülmüşse açık
    const unitQuestions = questionList
      .filter(qx => qx.unit === q.unit && qx.extra !== true) // bonuslar hariç!
      .sort((a, b) => parseInt(a.id.replace('q', '')) - parseInt(b.id.replace('q', '')));
  
    const next = unitQuestions[correct.length];
    return correct.includes(q.id) || next?.id === q.id;
  };  

  const handlePress = (id: string) => {
    const lives = userProgress?.lives ?? 5;
    if (lives <= 0) {
      Alert.alert('Yetersiz Can', 'Soru çözmek için en az 1 canınız olmalı.');
      return;
    }

    const idx = questionList.findIndex(q => q.id === id);
    if (idx === -1) return;

    navigation.navigate('QuestionScreen', {
      questionData: questionList[idx],
      questionIndex: idx,
      questionList,
      onAnswer: () => fetchProgress(),
    });
  };

  const filteredQuestions = expandedUnit !== null
    ? questionList.filter(q => q.unit === expandedUnit)
    : [];

  const minUnitY = filteredQuestions.length > 0
    ? Math.min(...filteredQuestions.map(q => q.y))
    : 0;

  const unitContainerHeight = filteredQuestions.length > 0
    ? Math.max(...filteredQuestions.map(q => q.y)) - minUnitY + 180
    : 0;

    const buyLives = async (option: 'one' | 'five') => {
      const user = auth().currentUser;
      if (!user || !userProgress) return;
    
      const ref = firestore().collection('users').doc(user.uid);
      const data = (await ref.get()).data();
    
      const lives = data?.lives ?? 5;
      const points = data?.globalScore ?? 0;
    
      const cost = option === 'five' ? 40 : 10;
      const add = option === 'five' ? 5 : 1;
    
      if (lives >= 5) {
        Alert.alert('Canlar Zaten Full', 'Zaten 5 canınız var. Daha fazla can satın alamazsınız.');
        return;
      }
    
      if (points < cost) {
        Alert.alert('Yetersiz Puan', `${cost} puan gerekiyor.`);
        return;
      }
    
      try {
        await ref.update({
          lives: Math.min(lives + add, 5),
          globalScore: firestore.FieldValue.increment(-cost),
          lastLifeUpdate: firestore.FieldValue.serverTimestamp()
        });
    
        await fetchProgress(); // ✅ UI'da can ve puanı hemen güncelle
        setModalVisible(false);
    
        Alert.alert('Başarılı', `${add} can satın alındı.`);
      } catch (error) {
        console.error('Can satın alma hatası:', error);
        Alert.alert('Hata', 'Can satın alınırken bir sorun oluştu.');
      }
    };
    

    const startStripeCheckout = async (
      quantity: number,
      onSuccess?: () => void
    ) => {
      try {
        const user = auth().currentUser;
        if (!user) return;
    
        const ref = firestore().collection('users').doc(user.uid);
        const doc = await ref.get();
        const data = doc.data();
        const lives = data?.lives ?? 5;
    
        if (lives >= 5) {
          Alert.alert('Canlar Zaten Full', 'Zaten 5 canınız var. Stripe ile satın alma yapamazsınız.');
          return;
        }
    
        const res = await functions()
          .httpsCallable('purchaseLifeWithStripe')({ quantity }) as { data: { url: string } };
    
        if (res.data.url) {
          const subscription = Linking.addEventListener('url', ({ url }) => {
            if (url.startsWith('myapp://payment-success')) {
              Alert.alert('Başarılı', `${quantity} can satın alındı.`);
              onSuccess?.();
            } else if (url.startsWith('myapp://payment-cancel')) {
              Alert.alert('İptal', 'Ödeme iptal edildi.');
            }
            subscription.remove();
          });
    
          Linking.openURL(res.data.url);
        } else {
          Alert.alert('Hata', 'Stripe ödeme bağlantısı alınamadı.');
        }
      } catch (error) {
        console.error('Stripe hatası:', error);
        Alert.alert('Hata', 'Stripe ile ödeme başlatılamadı.');
      }
    };
    
    
    

  return (
    <ImageBackground source={require('../assets/images/walpaperari.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <LottieView source={require('../assets/images/bee.json')} autoPlay loop style={styles.beeAnimation} />
            <Text style={styles.headerTitle}>Oyna Öğren</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.livesContainer}>
              <Image source={require('../assets/images/heart.png')} style={styles.heartIcon} />
              <Text style={styles.livesText}>: {userProgress?.lives ?? 5}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.plusIcon}>➕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.scoreText}>Puan: {userProgress?.globalScore ?? 0}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {units.map(unit => (
            <View key={unit.id} style={styles.unitSection}>
              <TouchableOpacity
                style={styles.unitHeader}
                onPress={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                disabled={unitLockState[unit.id]}
              >
                <Text style={styles.unitTitle}>{unit.title}</Text>
                {unitLockState[unit.id] && <Image source={require('../assets/images/lock.png')} style={styles.lockIcon} />}
              </TouchableOpacity>

              {expandedUnit === unit.id && !unitLockState[unit.id] && (
                <View style={[styles.unitQuestionsContainer, { height: unitContainerHeight }]}>
                  <Svg style={StyleSheet.absoluteFill}>
                    {filteredQuestions.map((q, idx) => {
                      if (idx < filteredQuestions.length - 1) {
                        const next = filteredQuestions[idx + 1];
                        return (
                          <Line
                            key={`line-${q.id}`}
                            x1={q.x + 40}
                            y1={q.y - minUnitY + 40}
                            x2={next.x + 40}
                            y2={next.y - minUnitY + 40}
                            stroke="black"
                            strokeWidth={2}
                          />
                        );
                      }
                      return null;
                    })}
                  </Svg>

                  {filteredQuestions.map(q => {
                    const isEnabled = getIsQuestionEnabled(q);
                    const adjustedY = q.y - minUnitY;
                    return (
                      <TouchableOpacity
                        key={q.id}
                        style={[styles.questionButton, { left: q.x, top: adjustedY, position: 'absolute' }, !isEnabled && { opacity: 0.3 }]}
                        onPress={() => isEnabled && handlePress(q.id)}
                        disabled={!isEnabled}
                      >
                        <ImageBackground
                          source={isEnabled
                            ? require('../assets/images/renkliari.jpg')
                            : require('../assets/images/renksizari.jpg')}
                          style={styles.buttonBackground}
                        >
                          <View style={styles.buttonTextContainer}>
                            <Text style={styles.starText}>{q.type}</Text>
                            <Text style={styles.numberText}>{q.id.replace('q', '')}</Text>
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
  <View style={styles.modalContainer}>
    <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
      <Text style={{ fontSize: 18, color: '#333' }}>✖</Text>
    </TouchableOpacity>

    <Text style={styles.modalTitle}>Can Satın Al</Text>

    <TouchableOpacity
      style={styles.purchaseCard}
      onPress={() =>
        Alert.alert('Onay', '10 puan karşılığında 1 can almak istiyor musunuz?', [
          { text: 'İptal', style: 'cancel' },
          { text: 'Evet', onPress: () => buyLives('one') },
        ])
      }
    >
      <Text style={styles.heartText}>❤️ 1 Can</Text>
      <Text style={styles.priceText}>→ 10 Puan</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.purchaseCard}
      onPress={() =>
        Alert.alert('Onay', '40 puan karşılığında 5 can almak istiyor musunuz?', [
          { text: 'İptal', style: 'cancel' },
          { text: 'Evet', onPress: () => buyLives('five') },
        ])
      }
    >
      <Text style={styles.heartText}>❤️❤️❤️❤️❤️ 5 Can</Text>
      <Text style={styles.priceText}>→ 40 Puan</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.purchaseCard}
      onPress={() => startStripeCheckout(1, fetchProgress)}
    >
      <Text style={styles.heartText}>❤️ 1 Can</Text>
      <Text style={styles.priceText}>→ $1</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.purchaseCard}
      onPress={() => startStripeCheckout(5, fetchProgress)}
    >
      <Text style={styles.heartText}>❤️❤️❤️❤️❤️ 5 Can</Text>
      <Text style={styles.priceText}>→ $4</Text>
    </TouchableOpacity>
  </View>
</Modal>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  headerContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 10, backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  beeAnimation: { width: 40, height: 40, marginRight: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  progressContainer: { flexDirection: 'row', alignItems: 'center' },
  livesContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  heartIcon: { width: 24, height: 24, marginRight: 2 },
  plusIcon: { fontSize: 22, marginLeft: 5, color: '#000' },
  livesText: { fontSize: 16, color: '#000' },
  scoreText: { fontSize: 16, color: '#000' },
  scrollContainer: { padding: 10 },
  unitSection: { marginBottom: 18 },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    paddingTop: 40,
    position: 'relative',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  purchaseCard: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 16,
    color: '#333',
  },
  

  // 🔽 ÜNİTE BAŞLIKLARI GÜNCELLENDİ
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  lockIcon: { width: 20, height: 20, marginLeft: 8 },

  unitQuestionsContainer: { marginTop: 10, position: 'relative' },
  questionButton: {
    width: 80, height: 80, borderRadius: 40, overflow: 'hidden', elevation: 5,
  },
  buttonBackground: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonTextContainer: {
    position: 'absolute', top: 5, left: 5, right: 5, bottom: 5,
    justifyContent: 'center', alignItems: 'center',
  },
  starText: { fontSize: 12, fontWeight: 'bold', color: 'pink' },
  numberText: { fontSize: 12, fontWeight: 'bold', color: 'red', position: 'absolute', top: 4, right: 6 },
});


export default SoruHaritasiScreen;
