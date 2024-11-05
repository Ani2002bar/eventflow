import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import AddFoodOrCategory from '../screens/AddFoodOrCategory';
import RegistroEventosScreen from '../screens/RegistroEventosScreen';
import InvitadoNuevoScreen from '../screens/InvitadoNuevoScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import RecoverPasswordScreen from '../screens/RecoverPasswordScreen';
import ModificarEventoScreen from '../screens/ModificarEventoScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

// Define el tipo para las rutas y sus parámetros
export type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  SignUp: undefined;
  AddFoodOrCategory: undefined;
  RegistroEventosScreen: undefined;
  InvitadoNuevo: undefined;
  EventDetailScreen: undefined;
  RecoverPassword: undefined;
  ModificarEvento: { eventId: string }; // Define el tipo de parámetro `eventId`
  UserProfileScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function MyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="AddFoodOrCategory" component={AddFoodOrCategory} />
      <Stack.Screen name="RegistroEventosScreen" component={RegistroEventosScreen} />
      <Stack.Screen name="InvitadoNuevo" component={InvitadoNuevoScreen} />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />
      <Stack.Screen name="ModificarEvento" component={ModificarEventoScreen} />
      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}