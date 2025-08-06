import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';
import LottieView from 'lottie-react-native';
import { QuestionItem } from '../data';

type ImageChoiceQuestionProps = {
  question: QuestionItem;
  onNextQuestion: () => void;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
};

const ImageChoiceQuestion: React.FC<ImageChoiceQuestionProps> = ({
  question,
  onNextQuestion,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
      })
      .catch(err => console.error('TTS error:', err));

    speakNormal();
  }, []);

  const speakNormal = () => {
    Tts.setDefaultRate(0.5);
    Tts.speak(question.sentence);
  };

  const speakSlow = () => {
    Tts.setDefaultRate(0.25);
    Tts.speak(question.sentence);
  };

  const playSound = (fileName: string) => {
    const sound = new Sound(fileName, Sound.MAIN_BUNDLE, error => {
      if (!error) sound.play(() => sound.release());
    });
  };

  const handleChoice = (label: string) => {
    if (isAnswered) return;
    setSelectedOption(label);
    const isCorrect = label.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    setResult(isCorrect ? 'Doğru!' : `Yanlış! Seçimin: ${label}`);
    setIsAnswered(true);
    playSound(isCorrect ? 'correct.mp3' : 'incorrect.mp3');
    onAnswer(question.id, isCorrect);
  };

  const resetQuestion = () => {
    setSelectedOption(null);
    setResult('');
    setIsAnswered(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LottieView
        source={require('../assets/images/arıuc.json')}
        autoPlay
        loop
        style={styles.topAnimation}
      />

      <Text style={styles.header}>Görsel Seçme Sorusu</Text>
      <Text style={styles.description}>Doğru görseli seçin: "{question.sentence}"</Text>

      <View style={styles.audioRow}>
        <TouchableOpacity onPress={speakNormal}>
          <Image source={require('../assets/images/speaker.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={speakSlow}>
          <Image source={require('../assets/images/turtle.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {question.images?.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.imageWrapper,
              selectedOption === item.label && styles.imageWrapperSelected,
            ]}
            onPress={() => handleChoice(item.label)}
            disabled={isAnswered}
          >
            <Image source={item.image} style={styles.imageStyle} />
            <Text style={styles.labelText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {result !== '' && <Text style={styles.resultText}>{result}</Text>}

      {result.startsWith('Yanlış') && (
        <View style={styles.buttonWrapper}>
          <Button title="Tekrar Dene" onPress={resetQuestion} color="#007bff" />
        </View>
      )}

      {result.startsWith('Doğru') && (
        <View style={styles.buttonWrapper}>
          <Button title="Sonraki Soru" onPress={onNextQuestion} color="#007bff" />
        </View>
      )}
    </ScrollView>
  );
};

export default ImageChoiceQuestion;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  topAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  audioRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  icon: {
    width: 40,
    height: 40,
    marginHorizontal: 12,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  imageWrapper: {
    width: '45%',
    marginVertical: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  imageWrapperSelected: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  imageStyle: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  labelText: {
    marginTop: 5,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  resultText: {
    fontSize: 20,
    marginVertical: 15,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  buttonWrapper: {
    marginVertical: 10,
    width: '80%',
  },
});
