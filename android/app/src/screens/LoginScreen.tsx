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
        Alert.alert('Success: Logged In');
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
        <Text style={styles.title}>Bienvenidos a EventFlow</Text>
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
          onPress={() => {/* Add forgot password handler */}}
        >
          ¿Olvidaste tu contraseña?
        </Text>

        <MyButton title={'Ingresa a EventFlow'} onPress={loginWithEmailAndPass} />

        <Text style={styles.noAccount}>
          ¿No tienes una cuenta?{' '}
          <Text
            style={styles.signUpLink}
            onPress={() => navigation.navigate("SignUp")}
          >
            Únete a Eventflow
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 40,
  },
  inputsContainer: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#666',
    marginBottom: 20,
  },
  noAccount: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  signUpLink: {
    color: '#000',
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
