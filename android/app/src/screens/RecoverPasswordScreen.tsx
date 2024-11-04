import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import MyButton from '../components/MyButton';

const RecoverPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  // Función para validar el formato del email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordRecovery = (): void => {
    // Validación del campo vacío
    if (email.trim() === '') {
      Alert.alert(
        'Campo Vacío',
        'Por favor ingresa una dirección de correo electrónico.',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    // Validación del formato del email
    if (!isValidEmail(email)) {
      Alert.alert(
        'Formato Inválido',
        'Por favor ingresa una dirección de correo electrónico válida.\nEjemplo: usuario@dominio.com',
        [{ text: 'Entendido', style: 'default' }]
      );
      return;
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          '¡Correo Enviado!',
          `Se ha enviado un enlace de recuperación a:\n${email}\n\nPor favor revisa tu bandeja de entrada.`,
          [
            {
              text: 'OK',
              style: 'default'
            }
          ]
        );
      })
      .catch((error) => {
        // Personalización de mensajes de error de Firebase
        let errorMessage = 'Ha ocurrido un error. Por favor intenta nuevamente.';
        let errorTitle = 'Error';
        
        switch (error.code) {
          case 'auth/user-not-found':
            errorTitle = 'Usuario No Encontrado';
            errorMessage = 'No existe ninguna cuenta registrada con este correo electrónico.\n\n¿Deseas crear una nueva cuenta?';
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
            return; // Salimos temprano para no mostrar el Alert genérico
          case 'auth/invalid-email':
            errorMessage = 'La dirección de correo electrónico no es válida.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Demasiados intentos. Por favor intenta más tarde.';
            break;
          case 'auth/network-request-failed':
            errorTitle = 'Error de Conexión';
            errorMessage = 'No se pudo conectar al servidor. Por favor verifica tu conexión a internet e intenta nuevamente.';
            break;
        }

        // Solo mostramos este Alert si no es el caso de usuario no encontrado
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
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.instructions}>
        Ingresa tu dirección de correo electrónico para recibir un enlace de recuperación de contraseña.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#666"
      />

      <MyButton 
        title="Enviar correo de recuperación" 
        onPress={handlePasswordRecovery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default RecoverPasswordScreen;