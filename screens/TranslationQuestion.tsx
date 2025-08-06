import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image
} from 'react-native';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';
import LottieView from 'lottie-react-native';
import { QuestionItem } from '../data';

type TranslationQuestionProps = {
  question: QuestionItem;
  onNextQuestion: () => void;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
};

const TranslationQuestion: React.FC<TranslationQuestionProps> = ({
  question,
  onNextQuestion,
  onAnswer,
}) => {
  const options = question.options || [];
  const correctAnswer = question.correctAnswer || '';
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
      })
      .catch(error => console.error('TTS init error:', error));
  }, []);

  useEffect(() => {
    setSelectedOption(null);
    setResult('');
    setIsAnswered(false);
  }, [question]);

  const playSound = (fileName: string) => {
    const sound = new Sound(fileName, Sound.MAIN_BUNDLE, error => {
      if (!error) {
        sound.play(() => sound.release());
      }
    });
  };

  const checkAnswer = async () => {
    const isCorrect = selectedOption === correctAnswer;
    setResult(isCorrect ? 'Doğru!' : `Yanlış! Doğru cevap: ${correctAnswer}`);
    setIsAnswered(true);

    if (isCorrect) {
      playSound('correct.mp3');
      onAnswer(question.id, true);
      await Tts.speak(selectedOption || '');
    } else {
      playSound('incorrect.mp3');
      onAnswer(question.id, false);
    }
  };

  const resetQuestion = () => {
    setSelectedOption(null);
    setResult('');
    setIsAnswered(false);
  };

  const speakNormal = () => {
    Tts.setDefaultRate(0.5);
    Tts.speak(correctAnswer);
  };

  const speakSlow = () => {
    Tts.setDefaultRate(0.25);
    Tts.speak(correctAnswer);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LottieView
        source={require('../assets/images/arıuc.json')}
        autoPlay
        loop
        style={styles.topAnimation}
      />
      <Text style={styles.header}>Doğru Çeviriyi Seç</Text>
      <Text style={styles.questionText}>{question.description}</Text>

      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionButton,
            selectedOption === option && styles.selectedOption
          ]}
          onPress={() => setSelectedOption(option)}
          disabled={isAnswered}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.controlButton, (!selectedOption || isAnswered) && { opacity: 0.5 }]}
        onPress={checkAnswer}
        disabled={!selectedOption || isAnswered}
      >
        <Text style={styles.controlButtonText}>Cevabı Kontrol Et</Text>
      </TouchableOpacity>

      {result !== '' && <Text style={styles.resultText}>{result}</Text>}

      {isAnswered && selectedOption !== correctAnswer && (
        <TouchableOpacity style={styles.controlButton} onPress={resetQuestion}>
          <Text style={styles.controlButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      )}

      {isAnswered && selectedOption === correctAnswer && (
        <>
          <View style={styles.audioButtons}>
            <TouchableOpacity onPress={speakNormal}>
              <Image source={require('../assets/images/speaker.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={speakSlow}>
              <Image source={require('../assets/images/turtle.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.controlButton} onPress={onNextQuestion}>
            <Text style={styles.controlButtonText}>Sonraki Soru</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  topAnimation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#f0e68c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#c4e17f',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  controlButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  audioButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  icon: {
    width: 48,
    height: 48,
    marginHorizontal: 15,
  },
});

export default TranslationQuestion;
