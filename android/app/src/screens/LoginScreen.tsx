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

  const validateInputs = (): boolean => {
    if (email.trim() === '' && password.trim() === '') {
      Alert.alert(
        'Campos Vacíos',
        'Por favor ingresa tu correo y contraseña para continuar.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return false;
    }

    if (email.trim() === '') {
      Alert.alert(
        'Campo Vacío',
        'Por favor ingresa tu correo electrónico.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return false;
    }

    if (password.trim() === '') {
      Alert.alert(
        'Campo Vacío',
        'Por favor ingresa tu contraseña.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return false;
    }

    return true;
  };

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
    if (!validateInputs()) return;

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        Alert.alert(
          '¡Bienvenido!',
          'Has iniciado sesión exitosamente.',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.navigate('HomeScreen')
            }
          ]
        );
      })
      .catch(error => {
        console.log(error);
        let errorMessage = 'Ha ocurrido un error. Por favor intenta nuevamente.';
        let errorTitle = 'Error de Inicio de Sesión';

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo electrónico no es válido.';
            break;
          case 'auth/user-not-found':
            errorTitle = 'Usuario No Encontrado';
            errorMessage = 'No existe una cuenta asociada a este correo electrónico.\n\n¿Deseas crear una nueva cuenta?';
            Alert.alert(
              errorTitle,
              errorMessage,
              [
                {
                  text: 'Cancelar',
                  style: 'cancel'
                },
                {
                  text: 'Crear Cuenta',
                  onPress: () => navigation.navigate('SignUp'),
                  style: 'default'
                }
              ]
            );
            return;
          case 'auth/wrong-password':
            errorMessage = 'La contraseña ingresada es incorrecta.\n\n¿Olvidaste tu contraseña?';
            Alert.alert(
              errorTitle,
              errorMessage,
              [
                {
                  text: 'Cancelar',
                  style: 'cancel'
                },
                {
                  text: 'Recuperar Contraseña',
                  onPress: () => navigation.navigate('RecoverPassword'),
                  style: 'default'
                }
              ]
            );
            return;
          case 'auth/too-many-requests':
            errorMessage = 'Demasiados intentos fallidos. Por favor intenta más tarde o recupera tu contraseña.';
            break;
          case 'auth/network-request-failed':
            errorTitle = 'Error de Conexión';
            errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet e intenta nuevamente.';
            break;
        }

        Alert.alert(
          errorTitle,
          errorMessage,
          [
            {
              text: 'Entendido',
              style: 'cancel'
            }
          ]
        );
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
          onPress={() => navigation.navigate('RecoverPassword')}
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
    width: 200,
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
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
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
