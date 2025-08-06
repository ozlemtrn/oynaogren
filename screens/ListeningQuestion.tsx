import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';
import { QuestionItem } from '../data';

type WordToken = { key: string; word: string };

type ListeningQuestionProps = {
  question: QuestionItem;
  onNextQuestion: () => void;
  onAnswer: (id: string, isCorrect: boolean) => void;
};

const ListeningQuestion: React.FC<ListeningQuestionProps> = ({
  question,
  onNextQuestion,
  onAnswer,
}) => {
  const [shuffledWords, setShuffledWords] = useState<WordToken[]>([]);
  const [selectedWords, setSelectedWords] = useState<WordToken[]>([]);
  const [result, setResult] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => Tts.setDefaultLanguage('en-US'))
      .then(() => Tts.setDefaultRate(0.5))
      .then(() => Tts.setDefaultPitch(1.0))
      .catch((error) => console.error('TTS error:', error));
  }, []);

  useEffect(() => {
    if (question.words && question.words.length > 0) {
      const wordTokens: WordToken[] = question.words.map((word, i) => ({
        key: `${word}-${i}`,
        word,
      }));
      const shuffled = [...wordTokens].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setSelectedWords([]);
      setResult('');
      setIsAnswered(false);
      setAnswerSubmitted(false);
    }
  }, [question]);

  const speak = () => {
    Tts.setDefaultRate(0.5);
    Tts.speak(question.sentence);
  };

  const speakSlow = () => {
    Tts.setDefaultRate(0.25);
    Tts.speak(question.sentence);
  };

  const playSound = (fileName: string) => {
    const sound = new Sound(fileName, Sound.MAIN_BUNDLE, error => {
      if (!error) {
        sound.play(() => sound.release());
      }
    });
  };

  const handleWordPress = (token: WordToken) => {
    if (selectedWords.find(w => w.key === token.key)) return;
    const correctWordCount = question.sentence.trim().split(/\s+/).length;
    if (selectedWords.length >= correctWordCount) return;
    setSelectedWords(prev => [...prev, token]);
    Tts.speak(token.word); // Her seçimde kelimeyi seslendir
  };

  const handleRemoveWord = (index: number) => {
    setSelectedWords(prev => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  const removePunctuation = (text: string) => {
    return text.replace(/[.,!?]/g, '').trim().toLowerCase();
  };

  const checkAnswer = () => {
    const userSentence = removePunctuation(
      selectedWords.map(w => w.word).join(' ')
    );
    const correctSentence = removePunctuation(question.sentence);

    const isCorrect = userSentence === correctSentence;
    setResult(isCorrect ? 'Tebrikler! Doğru sırayla seçtin.' : 'Yanlış! Tekrar dene.');
    setIsAnswered(true);
    playSound(isCorrect ? 'correct.mp3' : 'incorrect.mp3');

    if (!answerSubmitted) {
      onAnswer(question.id, isCorrect);
      setAnswerSubmitted(true);
    }
  };

  const resetQuestion = () => {
    setSelectedWords([]);
    setResult('');
    setIsAnswered(false);
    setAnswerSubmitted(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LottieView
        source={require('../assets/images/arıuc.json')}
        autoPlay
        loop
        style={styles.topAnimation}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Dinleme Sorusu</Text>
        <Text style={styles.questionText}>{question.description}</Text>

        <View style={styles.audioRow}>
          <Button title="🔊 Dinle" onPress={speak} color="#007bff" />
          <TouchableOpacity onPress={speakSlow} style={styles.turtleWrapper}>
            <Image
              source={require('../assets/images/turtle.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.selectedContainer}>
          {selectedWords.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={styles.selectedWord}
              onPress={() => handleRemoveWord(index)}
            >
              <Text style={styles.wordText}>{item.word}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.wordBank}>
          {shuffledWords.map(token => {
            const alreadySelected = selectedWords.find(w => w.key === token.key);
            return (
              <TouchableOpacity
                key={token.key}
                style={[styles.wordButton, alreadySelected && styles.wordButtonDisabled]}
                onPress={() => handleWordPress(token)}
                disabled={!!alreadySelected || isAnswered}
              >
                <Text style={styles.wordText}>{token.word}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!isAnswered && (
          <View style={styles.controlButton}>
            <Button
              title="Cevabı Kontrol Et"
              onPress={checkAnswer}
              disabled={!selectedWords.length}
              color="#007bff"
            />
          </View>
        )}

        {result !== '' && <Text style={styles.resultText}>{result}</Text>}

        {!result.startsWith('Tebrikler') && isAnswered && (
          <View style={styles.controlButton}>
            <Button title="Tekrar Dene" onPress={resetQuestion} color="#007bff" />
          </View>
        )}

        {result.startsWith('Tebrikler') && isAnswered && (
          <View style={styles.controlButton}>
            <Button title="Sonraki Soru" onPress={onNextQuestion} color="#007bff" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ListeningQuestion;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topAnimation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  turtleWrapper: {
    marginLeft: 10,
  },
  icon: {
    width: 36,
    height: 36,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginVertical: 15,
    width: '90%',
    justifyContent: 'center',
  },
  selectedWord: {
    backgroundColor: '#8fbc8f',
    margin: 5,
    padding: 10,
    borderRadius: 6,
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  wordButton: {
    backgroundColor: '#f0e68c',
    margin: 5,
    padding: 10,
    borderRadius: 6,
  },
  wordButtonDisabled: {
    opacity: 0.4,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  controlButton: {
    marginVertical: 10,
    width: '80%',
  },
  resultText: {
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});
