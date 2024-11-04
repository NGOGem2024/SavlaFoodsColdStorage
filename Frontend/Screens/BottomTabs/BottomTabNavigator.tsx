import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../HomeScreen';
import AnnouncementScreen from './AnnouncementScreen'; 
import ReportScreen from './ReportScreen';
import AlertScreen from './AlertScreen';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          if (route.name === 'Home') {
            iconName = 'home' ;
          } else if (route.name === 'Announcement') {
            iconName = 'campaign';
          } else if (route.name === 'Report') {
            iconName = 'assessment';
          } else if (route.name === 'Alert') {
            iconName = focused ? 'notifications' : 'notifications-none';
          } else {
            iconName = 'circle'; // Default icon
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F48221',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Announcement" component={AnnouncementScreen} options={{headerShown:true}}/>
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Alert" component={AlertScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,       
  },
});

export default BottomTabNavigator;