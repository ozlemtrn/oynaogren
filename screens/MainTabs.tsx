import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, StyleSheet } from 'react-native';
import SoruHaritasiScreen from './SoruHaritasiScreen';
import PhoneticsScreen from './PhoneticsScreen';
import ProfilScreen from './ProfilScreen'; 
import StoryScreen from './StoryScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'SoruHaritasiScreen') {
            iconSource = require('../assets/icons/home.png');
          } else if (route.name === 'PhoneticsScreen') {
            iconSource = require('../assets/icons/mouth.png');
          } else if (route.name === 'ProfilScreen') {
            iconSource = require('../assets/icons/profile.png');
          } else if (route.name === 'StoryScreen') {
            iconSource = require('../assets/icons/story.png');
          }
          

          // Eğer iconSource tanımsızsa null döndür (hata engeli)
          if (!iconSource) return null;

          return (
            <View style={focused ? styles.focusedIconWrapper : styles.iconWrapper}>
              <Image source={iconSource} style={styles.icon} />
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="SoruHaritasiScreen" component={SoruHaritasiScreen} />
      <Tab.Screen name="PhoneticsScreen" component={PhoneticsScreen} />
      <Tab.Screen name="ProfilScreen" component={ProfilScreen} />
      <Tab.Screen name="StoryScreen" component={StoryScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 6,
  },
  focusedIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 6,
    borderWidth: 2,
    borderColor: '#42a5f5',
  },
  icon: {
    width: 26,
    height: 26,
  },
});
