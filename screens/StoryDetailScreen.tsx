import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { storyData } from '../storyData';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Tts from 'react-native-tts';

// ➔ Speaker isim ve ikon eşlemesi
const getSpeakerLabel = (speaker: string) => {
  switch (speaker) {
    case 'bee':
      return '🐝 Bee';
    case 'lucy':
      return '👩‍🦳 Lucy';
    case 'lin':
      return '👧 Lin';
    case 'priti':
      return '👩‍🦰 Priti';
    case 'honey':
      return '🧑 Honey';
    case 'daniel':
      return '🧑‍🦰 Daniel';
    case 'airportStaff':
      return '🛫 Airport Staff';
    default:
      return '';
  }
};



const introTexts: Record<string, string> = {
  story1: "Bee has a date at a restaurant.",
  story2: "Bee is going to the airport.",
  story3: "Lucy is with her granddaughter, Lin.",
  story4: "Honey is looking for the keys.",
};

const introTitles: Record<string, string> = {
  story1: "A Date",
  story2: "At the Airport",
  story3: "One Thing",
  story4: "Good Morning!",
};

const storyImages: Record<string, any> = {
  story1: require('../assets/images/date.png'),
  story2: require('../assets/images/airport.png'),
  story3: require('../assets/images/supermarket.png'),
  story4: require('../assets/images/breakfast.png'),
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'StoryDetailScreen'>;

const StoryDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProps>();
  const { storyId } = route.params as { storyId: string };

  const steps = storyData[storyId];
  const [currentScreen, setCurrentScreen] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (currentScreen !== 2) return;
    const lastVisibleStep = visibleSteps[visibleSteps.length - 1];
    if (lastVisibleStep?.type === 'dialog') {
      speakStep(lastVisibleStep);
    } else {
      Tts.stop();
    }
  }, [visibleSteps, currentScreen]);

  const speakStep = async (step: any) => {
    if (step.type !== 'dialog') return;
    await Tts.stop();
    await Tts.setDefaultLanguage('en-US');
    try {
      if (step.speaker === 'bee' || step.speaker === 'lucy' || step.speaker === 'priti') {
        await Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact'); // Kadın 1
      } else if (step.speaker === 'lin') {
        await Tts.setDefaultVoice('com.apple.ttsbundle.Ava-compact'); // Kadın 2
      } else if (step.speaker === 'daniel' || step.speaker === 'honey') {
        await Tts.setDefaultVoice('com.apple.ttsbundle.Tom-compact'); // Erkek 1
      } else if (step.speaker === 'airportStaff') {
        await Tts.setDefaultVoice('com.apple.ttsbundle.Fred-compact'); // Erkek 2
      }
    } catch (error) {
      console.warn('Voice set error:', error);
    }
    Tts.speak(step.text);
  };
  

  const speakIntro = async () => {
    await Tts.stop();
    await Tts.setDefaultLanguage('en-US');
    await Tts.speak(introTexts[storyId]);
  };

  const handleNext = async () => {
    if (currentScreen === 0) {
      setCurrentScreen(1);
    } else if (currentScreen === 1) {
      setCurrentScreen(2);
      setVisibleSteps([steps[0]]);
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStepIndex(nextIndex);
        setVisibleSteps(prev => [...prev, steps[nextIndex]]);
        setSelectedOption(null);
        setShowCorrect(false);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } else {
        const user = auth().currentUser;
        if (user) {
          await firestore().collection('users').doc(user.uid).update({
            completedStories: firestore.FieldValue.arrayUnion(storyId),
          });
        }
        navigation.goBack();
      }
    }
  };

  const handleOptionPress = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    setShowCorrect(true);
  };

  return (
    <View style={styles.container}>
      {/* Üst Görsel ve Başlık */}
      <View style={styles.introContainer}>
        <Image source={storyImages[storyId]} style={styles.introImage} />
        <Text style={styles.introTitle}>
          {introTitles[storyId]}
        </Text>
        {currentScreen >= 1 && (
          <View style={styles.introTextContainer}>
            <Text style={styles.introDescription}>{introTexts[storyId]}</Text>
            <TouchableOpacity onPress={speakIntro}>
              <Image
                source={require('../assets/images/speaker.png')}
                style={styles.speakerIcon}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Diyaloglar ve Sorular */}
      <ScrollView contentContainerStyle={styles.stepsContainer} ref={scrollViewRef}>
        {currentScreen === 2 && visibleSteps.map((step, index) => {
          if (step.type === 'dialog') {
            return (
              <View key={index} style={styles.dialogBox}>
                <Text style={styles.speaker}>
                  {getSpeakerLabel(step.speaker)}
                </Text>
                <Text style={styles.dialog}>{step.text}</Text>
              </View>
            );
          } else if (index === currentStepIndex) {
            return (
              <View key={index} style={styles.questionBox}>
                <Text style={styles.dialog}>{step.text}</Text>
                {step.options?.map((option: string) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleOptionPress(option)}
                    disabled={!!selectedOption}
                    style={[
                      styles.option,
                      selectedOption === option && option === step.correctAnswer && styles.correct,
                      selectedOption === option && option !== step.correctAnswer && styles.incorrect,
                    ]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
                {showCorrect && (
                  <>
                    <Text style={styles.correctText}>Correct Answer: {step.correctAnswer}</Text>
                    <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
                      <Text style={styles.nextText}>Next</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            );
          }
          return null;
        })}

        {/* Devam Et Butonu */}
        {!(showCorrect && currentScreen === 2) && (
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default StoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  introContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
  },
  introImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  introTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  introDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  speakerIcon: {
    width: 26,
    height: 26,
    marginLeft: 10,
  },
  stepsContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  dialogBox: {
    marginBottom: 20,
  },
  speaker: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444',
  },
  dialog: {
    fontSize: 18,
    lineHeight: 24,
    color: '#000',
  },
  questionBox: {
    marginTop: 20,
    marginBottom: 40,
  },
  option: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  correct: {
    backgroundColor: '#A5D6A7',
  },
  incorrect: {
    backgroundColor: '#EF9A9A',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  correctText: {
    marginTop: 10,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  nextText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
