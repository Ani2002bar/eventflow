import {
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
  View,
  Text,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import MyButton from '../components/MyButton';
import MyTextInput from '../components/MyTextInput';
import SocialMedia from '../components/SocialMedia';
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const signUpTestFn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Success', 'User Created with those credentials Please Login');
        navigation.navigate("Login");
      })
      .catch(error => {
        let errorMessage = 'An error occurred during sign up';
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'That email address is already in use!';
            break;
          case 'auth/invalid-email':
            errorMessage = 'That email address is invalid!';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password accounts are not enabled. Please enable them in the Firebase Console.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Please use a stronger password!';
            break;
          case 'auth/configuration-not':
            errorMessage = 'Firebase configuration error. Please check your setup.';
            break;
        }
        
        console.log('Error details:', error);
        Alert.alert('Error', errorMessage);
      });
};

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/background.png')}
        style={styles.imageBackground}>
        <Image
          source={require('../assets/food/eventflow.png')}
          style={styles.foodImage}
        />

        <Text style={styles.title}>Fatmore</Text>

        <View style={styles.inputsContainer}>
          <MyTextInput 
            value={email} 
            onChangeText={(text: string) => setEmail(text)} 
            placeholder="Enter E-mail or User Name" 
          />
          <MyTextInput 
            value={password} 
            onChangeText={(text: string) => setPassword(text)} 
            placeholder="Password" 
            secureTextEntry 
          />
          <MyTextInput 
            value={confirmPassword} 
            onChangeText={(text: string) => setConfirmPassword(text)} 
            placeholder="Confirm Password" 
            secureTextEntry 
          />

          <MyButton onPress={signUpTestFn} title={'Sign Up'} />

          <Text style={styles.orText}>OR</Text>

          <SocialMedia />
        </View>
      </ImageBackground>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  foodImage: {
    height: 50,
    width: 90,
    resizeMode: 'stretch',
    position: 'absolute',
    right: 20,
    top: Platform.OS == 'android' ? 20 : 50,
  },
  title: {
    fontSize: 40,
    color: 'white',
    marginTop: Platform.OS == 'android' ? 60 : 110,
    fontFamily: 'Audiowide-Regular',
  },
  inputsContainer: {
    height: 450,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  textDontHave: {
    alignSelf: 'flex-end',
    marginRight: 10,
    color: 'black',
    marginBottom: 15,
    fontFamily: 'NovaFlat-Regular',
  },
  orText: {
    fontSize: 20,
    color: 'gray',
    marginTop: 20,
    fontFamily: 'Audiowide-Regular',
  },
});
