import React from 'react';
import { View, Text, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MatchingQuestion from './MatchingQuestion';
import TranslationQuestion from './TranslationQuestion';
import ListeningQuestion from './ListeningQuestion';
import SpeakingQuestion from './SpeakingQuestion';
import ImageChoiceQuestion from './ImageChoiceQuestion';
import { QuestionItem } from '../data';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { httpsCallable } from '@react-native-firebase/functions';
import { functions } from '../firebase';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'QuestionScreen'>;

const QuestionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();

  const { questionData, questionIndex, questionList, onAnswer } = route.params as {
    questionData: QuestionItem;
    questionIndex: number;
    questionList: QuestionItem[];
    onAnswer?: (id: string, isCorrect: boolean) => void;
  };

  if (!questionData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hata: Soru verisi eksik!</Text>
      </View>
    );
  }

  const handleAnswer = async (id: string, isCorrect: boolean) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      const userRef = firestore().collection('users').doc(currentUser.uid);
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      const unitKey = (questionData.unit ?? 1).toString();
      const correctAnswers = userData?.progress?.units?.[unitKey]?.correctAnswers ?? [];
      const currentLives = userData?.lives ?? 5;

      const isBonus = questionData.extra === true;
      const unit = questionData.unit ?? 1;

      if (isCorrect && !correctAnswers.includes(questionData.id)) {
        const updateProgress = httpsCallable(functions, 'updateUserProgress');
        await updateProgress({
          unit,
          questionId: questionData.id,
          points: 1,
        });
      }

      if (!isCorrect && currentLives > 0) {
        const deductLife = httpsCallable(functions, 'deductLife');
        await deductLife({ lifeCount: 1 });

        const updatedDoc = await userRef.get();
        const updatedLives = updatedDoc.data()?.lives ?? 0;

        if (updatedLives <= 0) {
          Alert.alert('Can Bitti', 'Canınız kalmadı. Yeni soru çözebilmek için can almalısınız.');
          navigation.navigate('MainTabs', { screen: 'SoruHaritasiScreen' });
          return;
        }
      }

      onAnswer?.(id, isCorrect);
    } catch (error) {
      console.error('❌ handleAnswer hatası:', error);
    }
  };

  const goToNextQuestion = async () => {
    const unit = questionData.unit ?? 1;
    const isBonus = questionData.extra === true;

    const mainQuestions = questionList
      .filter(q => q.unit === unit && (q.extra !== true))
      .sort((a, b) => parseInt(a.id.replace('q', '')) - parseInt(b.id.replace('q', '')));

    const bonusQuestions = questionList
      .filter(q => q.unit === unit && q.extra === true)
      .sort((a, b) => parseInt(a.id.replace('q', '')) - parseInt(b.id.replace('q', '')));

    const currentIndex = isBonus
      ? bonusQuestions.findIndex(q => q.id === questionData.id)
      : mainQuestions.findIndex(q => q.id === questionData.id);

    const isLastMain = !isBonus && currentIndex === mainQuestions.length - 1;
    const isLastBonus = isBonus && currentIndex === bonusQuestions.length - 1;

    const userRef = firestore().collection('users').doc(auth().currentUser?.uid!);

    if (isLastMain) {
      if (bonusQuestions.length > 0) {
        Alert.alert(
          'Ekstra Sorular',
          'Üniteyi tamamladınız. 5 ekstra soruyla daha fazla puan kazanmak ister misiniz?',
          [
            {
              text: 'Hayır',
              style: 'cancel',
              onPress: async () => {
                await userRef.set({
                  [`progress.units.${unit + 1}`]: {
                    locked: false,
                    correctAnswers: [],
                    unitScore: 0,
                  }
                }, { merge: true });

                navigation.navigate('MainTabs', { screen: 'SoruHaritasiScreen' });
              }
            },
            {
              text: 'Evet',
              onPress: () => {
                const nextExtra = bonusQuestions[0];
                const globalIndex = questionList.findIndex(q => q.id === nextExtra.id);
                navigation.replace('QuestionScreen', {
                  questionData: nextExtra,
                  questionIndex: globalIndex,
                  questionList,
                  onAnswer,
                });
              }
            }
          ]
        );
        return;
      } else {
        await userRef.set({
          [`progress.units.${unit + 1}`]: {
            locked: false,
            correctAnswers: [],
            unitScore: 0,
          }
        }, { merge: true });

        navigation.navigate('MainTabs', { screen: 'SoruHaritasiScreen' });
        return;
      }
    }

    if (isLastBonus) {
      await userRef.set({
        [`progress.units.${unit + 1}`]: {
          locked: false,
          correctAnswers: [],
          unitScore: 0,
        }
      }, { merge: true });

      navigation.navigate('MainTabs', { screen: 'SoruHaritasiScreen' });
      return;
    }

    const allQuestions = isBonus ? bonusQuestions : mainQuestions;
    const nextQuestion = allQuestions[currentIndex + 1];
    const globalIndex = questionList.findIndex(q => q.id === nextQuestion.id);

    setTimeout(() => {
      navigation.replace('QuestionScreen', {
        questionData: nextQuestion,
        questionIndex: globalIndex,
        questionList,
        onAnswer,
      });
    }, 300);
  };

  const renderQuestionContent = () => {
    switch (questionData.type) {
      case 'matching':
        return <MatchingQuestion key={questionData.id} question={questionData} onNextQuestion={goToNextQuestion} onAnswer={handleAnswer} />;
      case 'translation':
        return <TranslationQuestion key={questionData.id} question={questionData} onNextQuestion={goToNextQuestion} onAnswer={handleAnswer} />;
      case 'listening':
        return <ListeningQuestion key={questionData.id} question={questionData} onNextQuestion={goToNextQuestion} onAnswer={handleAnswer} />;
      case 'speaking':
        return <SpeakingQuestion key={questionData.id} question={questionData} onNextQuestion={goToNextQuestion} onAnswer={handleAnswer} />;
      case 'imageChoice':
        return <ImageChoiceQuestion key={questionData.id} question={questionData} onNextQuestion={goToNextQuestion} onAnswer={handleAnswer} />;
      default:
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Bu soru tipi desteklenmiyor.</Text>
          </View>
        );
    }
  };

  return <View style={{ flex: 1 }}>{renderQuestionContent()}</View>;
};

export default QuestionScreen;
