import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import Tts from 'react-native-tts';
import LottieView from 'lottie-react-native';
import { QuestionItem } from '../data';
import Sound from 'react-native-sound';

const correctSound = new Sound(require('../assets/sounds/correct.mp3'));
const incorrectSound = new Sound(require('../assets/sounds/incorrect.mp3'));

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const isPairEqual = (
  pair1: { left: string; right: string },
  pair2: { left: string; right: string }
): boolean => {
  return (
    pair1.left.trim().toLowerCase() === pair2.left.trim().toLowerCase() &&
    pair1.right.trim().toLowerCase() === pair2.right.trim().toLowerCase()
  );
};

type MatchingQuestionProps = {
  question: QuestionItem;
  onNextQuestion: () => void;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
};

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  onNextQuestion,
  onAnswer
}) => {
  const leftOptions = question.leftOptions || [];
  const correctPairs = question.correctPairs || [];

  const [rightOptions, setRightOptions] = useState<string[]>([]);
  const [selectedPairs, setSelectedPairs] = useState<{ left: string; right: string }[]>([]);
  const [leftSelection, setLeftSelection] = useState<string | null>(null);
  const [rightSelection, setRightSelection] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage('en-US');
      Tts.setDefaultRate(0.5);
    });
  }, []);

  useEffect(() => {
    setRightOptions(shuffleArray(question.rightOptions || []));
    setSelectedPairs([]);
    setLeftSelection(null);
    setRightSelection(null);
    setResult('');
    setIsAnswered(false);
  }, [question]);

  useEffect(() => {
    if (leftSelection && rightSelection) {
      const newPair = { left: leftSelection, right: rightSelection };
      if (!selectedPairs.some(pair => pair.left === newPair.left || pair.right === newPair.right)) {
        const isCorrect = correctPairs.some(p => isPairEqual(p, newPair));
        setSelectedPairs(prev => [...prev, newPair]);
        if (isCorrect) {
          correctSound.play();
          Tts.speak(newPair.right);
        } else {
          incorrectSound.play();
        }
      }
      setLeftSelection(null);
      setRightSelection(null);
    }
  }, [leftSelection, rightSelection]);

  useEffect(() => {
    if (selectedPairs.length === correctPairs.length) {
      const allCorrect = selectedPairs.every(pair =>
        correctPairs.some(correctPair => isPairEqual(correctPair, pair))
      );
      if (allCorrect) {
        setResult('Tebrikler! Tüm eşleşmeler doğru.');
        setIsAnswered(true);
        onAnswer(question.id, true);
      } else {
        setResult('Yanlış eşleşme var! Tekrar deneyin.');
        onAnswer(question.id, false);
      }
    }
  }, [selectedPairs]);

  const handleSelection = (side: 'left' | 'right', option: string) => {
    if (side === 'left') {
      setLeftSelection(option);
    } else if (leftSelection) {
      setRightSelection(option);
    }
  };

  const resetQuestion = () => {
    setSelectedPairs([]);
    setLeftSelection(null);
    setRightSelection(null);
    setResult('');
    setIsAnswered(false);
    setRightOptions(shuffleArray(question.rightOptions || []));
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/images/arıuc.json')}
        autoPlay
        loop
        style={styles.topAnimation}
      />
      <Text style={styles.header}>Eşleştirme Sorusu</Text>
      <Text style={styles.question}>{question.description}</Text>
      <View style={styles.optionsRow}>
        <View style={styles.column}>
          {leftOptions.map((option, index) => (
            <TouchableOpacity
              key={`left-${index}`}
              style={[
                styles.optionButton,
                selectedPairs.some(p => p.left === option) && styles.disabledButton,
                leftSelection === option && styles.selectedButton
              ]}
              disabled={selectedPairs.some(p => p.left === option)}
              onPress={() => handleSelection('left', option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          {rightOptions.map((option, index) => (
            <TouchableOpacity
              key={`right-${index}`}
              style={[
                styles.optionButton,
                selectedPairs.some(p => p.right === option) && styles.disabledButton,
                rightSelection === option && styles.selectedButton
              ]}
              disabled={selectedPairs.some(p => p.right === option)}
              onPress={() => handleSelection('right', option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {result !== '' && <Text style={styles.resultText}>{result}</Text>}
      {!isAnswered && result !== '' && (
        <TouchableOpacity onPress={resetQuestion} style={styles.retryButton}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      )}
      {isAnswered && (
        <TouchableOpacity onPress={onNextQuestion} style={styles.nextButton}>
          <Text style={styles.nextText}>Sonraki Soru</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#f0e68c',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButton: {
    borderWidth: 2,
    borderColor: '#007bff',
  },
  disabledButton: {
    opacity: 0.4,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#000',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
  },
  nextText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MatchingQuestion;
