import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import CameraScreen from './screens/CameraScreen';
import LoggingScreen from './screens/LoggingScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MacroSummaryScreen from './screens/MacroSummaryScreen';
import ProfileScreen from './screens/ProfileScreen';
import { AppProvider } from './context/AppContext'; 
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="OnboardingScreen">
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="MacroSummaryScreen" component={MacroSummaryScreen} />
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="LoggingScreen" component={LoggingScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AppProvider>
  );
}