import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


type NavigationProp = StackNavigationProp<RootStackParamList, 'StoryScreen'>;

interface StoryItem {
  id: string;
  title: string;
  image: any;
}

const storyList: StoryItem[] = [
  {
    id: 'story1',
    title: 'A Date',
    image: require('../assets/images/date.png'),
  },
  {
    id: 'story2',
    title: 'At the Airport',
    image: require('../assets/images/airport.png'),
  },
  {
    id: 'story3',
    title: 'One Thing', // ✅ yeni başlık
    image: require('../assets/images/supermarket.png'), // ✅ supermarket için bir resim
  },
  {
    id: 'story4',
    title: 'Good Morning', // ✅ Story 4 kartı
    image: require('../assets/images/breakfast.png'),
  },
];


const StoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const [completedStories, setCompletedStories] = useState<string[]>([]);

  const newCompletedStory = (route.params as { newCompletedStory?: string })?.newCompletedStory;

  useFocusEffect(
    useCallback(() => {
      const fetchCompletedStories = async () => {
        const user = auth().currentUser;
        if (!user) return;
  
        const doc = await firestore().collection('users').doc(user.uid).get();
        const data = doc.data();
        const completed = data?.completedStories ?? [];
  
        setCompletedStories(completed);
      };
  
      fetchCompletedStories();
    }, [])
  );
  

  const handleStoryPress = (storyId: string) => {
    navigation.navigate('StoryDetailScreen', { storyId });
  };

  return (
    <View style={styles.container}>
      {/* Başlık Alanı */}
      <View style={styles.header}>
        <Image source={require('../assets/images/book.png')} style={styles.bookIcon} />
        <Text style={styles.headerText}>LET'S READ</Text>
      </View>

      {/* Alt Açıklama + Yıldızlar */}
      <View style={styles.subHeaderContainer}>
        <Image source={require('../assets/images/star.png')} style={styles.starIcon} />
        <Text style={styles.subHeaderText}>Pick a story and start reading!</Text>
        <Image source={require('../assets/images/star.png')} style={styles.starIcon} />
      </View>

      {/* Hikaye Kartları */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {storyList.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyCard}
            onPress={() => handleStoryPress(story.id)}
          >
            <Image source={story.image} style={styles.storyImage} />
            <Text style={styles.storyTitle}>{story.title}</Text>
            {completedStories.includes(story.id) && (
              <Image
                source={require('../assets/icons/check.png')}
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default StoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4', // açık sarı
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  bookIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', // alt yazı da gri header ile bütünleşsin
    paddingBottom: 18,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#555',
    marginHorizontal: 8,
  },
  starIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 28,
  },
  storyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 5, // Android için shadow
    shadowColor: '#000', // iOS için shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  storyImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 20,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  checkIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 10,
    top: 32,
    bottom: 0,
    marginVertical: 'auto',
  },
});
