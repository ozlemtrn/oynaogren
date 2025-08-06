import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DevamScreen from './screens/DevamScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SoruBirScreen from './screens/SoruBirScreen';
import SoruikiScreen from './screens/SoruikiScreen';
import SoruUcScreen from './screens/SoruUcScreen';
import SoruDortScreen from './screens/SoruDortScreen';
import BaslangicVeSeviyeScreen from './screens/BaslangicVeSeviyeScreen';
import QuestionScreen from './screens/QuestionScreen';
import MainTabs from './screens/MainTabs'; // alt tab navigatörü
import StoryDetailScreen from './screens/StoryDetailScreen';

import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Devam" component={DevamScreen} />
        <Stack.Screen name="SoruBirScreen" component={SoruBirScreen} />
        <Stack.Screen name="SoruikiScreen" component={SoruikiScreen} />
        <Stack.Screen name="SoruUcScreen" component={SoruUcScreen} />
        <Stack.Screen name="SoruDortScreen" component={SoruDortScreen} />
        <Stack.Screen name="BaslangicVeSeviyeScreen" component={BaslangicVeSeviyeScreen} />
        <Stack.Screen name="StoryDetailScreen" component={StoryDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
