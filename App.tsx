import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WorkoutProvider} from './src/context/WorkoutContext';
import {AppNavigator} from './src/navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WorkoutProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </WorkoutProvider>
    </SafeAreaProvider>
  );
}

export default App;
