import {
  Image,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1062407877324-qv3gg2q2m5hh9s15dcpolfm6tkjpl65r.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken, user } = await GoogleSignin.signIn();

      console.log(user);
      navigation.navigate('HomeScreen');
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  };

  const loginWithEmailAndPass = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        Alert.alert('Éxito: Has iniciado sesión');
        navigation.navigate('HomeScreen');
      })
      .catch(err => {
        console.log(err);
        Alert.alert(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/food/eventflow.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Bienvenido a EventFlow</Text>
      </View>

      <View style={styles.inputsContainer}>
        <MyTextInput
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          placeholder="Correo"
        />
        <MyTextInput
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          placeholder="Contraseña"
          secureTextEntry
        />

        <Text
          style={styles.forgotPassword}
          onPress={() => {/* Agregar manejador para recuperar contraseña */}}
        >
          ¿Olvidaste tu contraseña?
        </Text>

        <MyButton title={'Ingresa a EventFlow'} onPress={loginWithEmailAndPass} />

        <Text style={styles.noAccount}>
          ¿No tienes una cuenta?
        </Text>

        <MyButton
          title={'Únete a Eventflow'}
          onPress={() => navigation.navigate("SignUp")}
          style={styles.signUpButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200, // Tamaño del logo más grande
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  forgotPassword: {
    textAlign: 'center', // Centrado del texto
    color: '#666',
    marginTop: 10, // Espacio cercano al campo de contraseña
    marginBottom: 20, // Separación del botón de inicio de sesión
  },
  noAccount: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#666',
  },
  signUpButton: {
    backgroundColor: '#6200EA',
    marginTop: 10,
    borderRadius: 20,
  },
});

export default LoginScreen;