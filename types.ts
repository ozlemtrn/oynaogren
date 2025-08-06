export interface QuestionData {
  id: string;
  type: 'matching' | 'translation' | 'listening' | 'speaking' | 'imageChoice';  // Yeni 'imageChoice' eklendi
  description: string;
  sentence: string;
  correctAnswer: string;
  x: number;
  y: number;
  unit?: number;
  
  extra?: boolean; // ← bu satırı ekle

  // Matching soruları için ek alanlar
  leftOptions?: string[];
  rightOptions?: string[];
  correctPairs?: { left: string; right: string }[];

  // Listening soruları için ses dosyası
  audioFile?: string;

  // Image choice soruları için görsel kaynaklarını tutan alan (örneğin require ile alınan dosya yolu veya URL)
  images?: { label: string; image: any }[];
}

export type RootStackParamList = {
  Home: undefined;
  Devam: undefined;
  Login: undefined;
  Register: undefined;
  Welcome: { name: string };
  SoruBirScreen: undefined;
  SoruikiScreen: undefined;
  SoruUcScreen: undefined;
  SoruDortScreen: undefined;
  BaslangicVeSeviyeScreen: undefined;
  SoruHaritasiScreen: undefined;
  StoryScreen: { newCompletedStory?: string };
  StoryDetailScreen: { storyId: string };
  MainTabs: { screen: 'SoruHaritasiScreen' | 'PhoneticsScreen' | 'ProfilScreen' | 'StoryScreen' } | undefined;


  QuestionScreen: {
    questionData: QuestionData;
    questionIndex: number;
    questionList: QuestionData[];
    onAnswer?: (id: string, isCorrect: boolean) => void;
  };

  ProfilScreen: undefined;
};
