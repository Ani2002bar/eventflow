import React, { useEffect } from 'react';
import 'react-native-gesture-handler';  // This should be at the very top
import { NavigationContainer } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import MyStack from './android/app/src/navigation/MyStack';
import messaging from '@react-native-firebase/messaging';
import { TurboModuleRegistry } from 'react-native';

const PlatformConstants = TurboModuleRegistry.get('PlatformConstants');
console.log(PlatformConstants);
const App = () => {

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async() => {
    const token = await messaging().getToken()
    console.log("Token = ", token)
  }

  useEffect(() => {
    requestUserPermission()
    getToken()
  },[])

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};

export default App;
