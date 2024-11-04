import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AddFoodOrCategory from '../screens/AddFoodOrCategory';
import RegistroEventosScreen from '../screens/RegistroEventosScreen';
import InvitadoNuevoScreen from '../screens/InvitadoNuevoScreen'; 
import EventDetailScreen from '../screens/EventDetailScreen'; 
import RecoverPasswordScreen from '../screens/RecoverPasswordScreen';



const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="AddFoodOrCategory" component={AddFoodOrCategory} />
      <Stack.Screen name="RegistroEventosScreen" component={RegistroEventosScreen} />
      <Stack.Screen name="InvitadoNuevo" component={InvitadoNuevoScreen} />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />


    </Stack.Navigator>
  );
}
/*************  ✨ Codeium Command ⭐  *************/
/******  a978a538-f61e-469a-b193-7abea21325d2  *******//**
 * SignUpScreen component
 *
 * This component renders the sign up screen, which contains form
 * elements to capture user's email address, password, and confirm
 * password. It also renders the "Sign Up" button that calls the
 * `signUpTestFn` when pressed, which attempts to create a new user
 * in Firebase Authentication.
 *
 * @param {NavigationProp<RootStackParamList, 'SignUp'>} navigation
 *   The navigation prop passed from the parent component.
 */
