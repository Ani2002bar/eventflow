import {
  Image,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import auth from '@react-native-firebase/auth';

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type SignUpScreenNavigationProp = NavigationProp<RootStackParamList, 'SignUp'>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const signUpTestFn = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, llena todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const currentUser = auth().currentUser;
        if (currentUser) {
          return currentUser.updateProfile({
            displayName: `${firstName} ${lastName}`, // Guarda nombre y apellido juntos
          });
        }
      })
      .then(() => {
        Alert.alert('Éxito', 'Usuario creado. Por favor inicia sesión.');
        navigation.navigate("Login");
      })
      .catch(error => {
        let errorMessage = 'Ocurrió un error al registrarse';
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = '¡Ese correo electrónico ya está en uso!';
            break;
          case 'auth/invalid-email':
            errorMessage = '¡Ese correo electrónico no es válido!';
            break;
          case 'auth/weak-password':
            errorMessage = '¡Por favor, utiliza una contraseña más fuerte!';
            break;
        }
        
        console.log('Error details:', error);
        Alert.alert('Error', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/food/eventflow.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Únete a EventFlow</Text>
      </View>

      <View style={styles.inputsContainer}>
        <MyTextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Nombre"
        />
        <MyTextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Apellido"
        />
        <MyTextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Correo"
        />
        <MyTextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
        />
        <MyTextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repetir contraseña"
          secureTextEntry
        />

        <MyButton onPress={signUpTestFn} title="Unirme" />
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputsContainer: {
    width: '100%',
    alignItems: 'center',
  },
});