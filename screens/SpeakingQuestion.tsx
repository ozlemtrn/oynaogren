import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Button, StyleSheet, ScrollView, Image
} from 'react-native';
import Voice, {
  SpeechResultsEvent, SpeechStartEvent, SpeechEndEvent, SpeechErrorEvent
} from '@react-native-voice/voice';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';
import LottieView from 'lottie-react-native';
import { QuestionItem } from '../data';

type SpeakingQuestionProps = {
  question: QuestionItem;
  onNextQuestion: () => void;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
};

const SpeakingQuestion: React.FC<SpeakingQuestionProps> = ({
  question, onNextQuestion, onAnswer,
}) => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
      })
      .catch(err => console.error('TTS Error:', err));
  }, []);

  useEffect(() => {
    setRecognizedText('');
    setResult('');
    setIsAnswered(false);
    setAnswerSubmitted(false);
  }, [question]);

  const playSound = (file: string) => {
    const sound = new Sound(file, Sound.MAIN_BUNDLE, error => {
      if (!error) sound.play(() => sound.release());
    });
  };

  const speakNormal = () => {
    Tts.setDefaultRate(0.5);
    Tts.speak(question.sentence);
  };

  const speakSlow = () => {
    Tts.setDefaultRate(0.25);
    Tts.speak(question.sentence);
  };

  const onSpeechStart = (_e: SpeechStartEvent) => setIsListening(true);
  const onSpeechEnd = (_e: SpeechEndEvent) => setIsListening(false);
  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value?.[0]) setRecognizedText(e.value[0]);
  };
  const onSpeechError = (_e: SpeechErrorEvent) => setIsListening(false);

  const startRecognizing = async () => {
    const permission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (permission !== RESULTS.GRANTED) return;
    setRecognizedText('');
    setResult('');
    setIsAnswered(false);
    setAnswerSubmitted(false);
    await Voice.start('en-US');
  };

  const stopRecognizing = async () => {
    setIsListening(false);
    await Voice.stop();
  };

  const checkAnswer = () => {
    const userSpeech = recognizedText.replace(/[^\w\s]/gi, '').toLowerCase().trim();
    const correctSpeech = question.sentence.replace(/[^\w\s]/gi, '').toLowerCase().trim();
    const isCorrect = userSpeech === correctSpeech;

    setResult(
      isCorrect
        ? 'Tebrikler! Doğru okudunuz.'
        : `Yanlış! Siz: "${recognizedText}"`
    );
    setIsAnswered(true);

    playSound(isCorrect ? 'correct.mp3' : 'incorrect.mp3');

    if (!answerSubmitted) {
      onAnswer(question.id, isCorrect);
      setAnswerSubmitted(true);
    }
  };

  const resetQuestion = () => {
    setRecognizedText('');
    setResult('');
    setIsAnswered(false);
    setAnswerSubmitted(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LottieView
        source={require('../assets/images/arıuc.json')}
        autoPlay loop
        style={styles.topAnimation}
      />
      <Text style={styles.header}>Konuşma Sorusu</Text>
      <Text style={styles.questionText}>{question.description}</Text>
      <Text style={styles.sentenceText}>{question.sentence}</Text>

      <View style={styles.audioButtons}>
        <TouchableOpacity onPress={speakNormal}>
          <Image source={require('../assets/images/speaker.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={speakSlow}>
          <Image source={require('../assets/images/turtle.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.instruction}>
        Mikrofona basılı tutarak konuşmayı başlat, bırakınca konuşma bitecek.
      </Text>

      <TouchableOpacity
        style={[styles.micButton, isListening && styles.micButtonActive]}
        onPressIn={startRecognizing}
        onPressOut={stopRecognizing}
      >
        <Text style={styles.micText}>🎤</Text>
      </TouchableOpacity>

      <Text style={styles.recognizedText}>
        Söylediğiniz: {recognizedText || '(henüz algılanmadı)'}
      </Text>

      {!isAnswered && (
        <View style={styles.buttonWrapper}>
          <Button
            title="Cevabı Kontrol Et"
            onPress={checkAnswer}
            disabled={!recognizedText}
            color="#007bff"
          />
        </View>
      )}

      {result !== '' && <Text style={styles.resultText}>{result}</Text>}

      {result.startsWith('Yanlış') && (
        <View style={styles.buttonWrapper}>
          <Button title="Tekrar Dene" onPress={resetQuestion} color="#007bff" />
        </View>
      )}

      {result.startsWith('Tebrikler') && (
        <View style={styles.buttonWrapper}>
          <Button title="Sonraki Soru" onPress={onNextQuestion} color="#007bff" />
        </View>
      )}
    </ScrollView>
  );
};

export default SpeakingQuestion;

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
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  questionText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
    textAlign: 'center',
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  instruction: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  micButton: {
    backgroundColor: '#ccc',
    padding: 20,
    borderRadius: 50,
    marginVertical: 10,
  },
  micButtonActive: {
    backgroundColor: '#ff7675',
  },
  micText: {
    fontSize: 24,
    color: '#000',
  },
  recognizedText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#000',
  },
  resultText: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  buttonWrapper: {
    marginVertical: 10,
    width: '80%',
  },
  audioButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 48,
    height: 48,
    marginHorizontal: 15,
  },
});
