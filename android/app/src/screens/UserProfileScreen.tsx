import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const UserProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
  }, []);

  if (!user) {
    return <Text>Cargando...</Text>;
  }

  const handleSignOut = () => {
    auth().signOut().then(() => {
      navigation.navigate('Login');
    });
  };

  const handleGoHome = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      {/* Logo de la app */}
      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/food/eventflow.png')} // Logo de la app
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.displayName || 'Usuario'}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Botones */}
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={handleGoHome}>
        <Text style={styles.buttonText}>Ir a Menú Principal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#6200EA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  homeButton: {
    backgroundColor: '#00A9F4',
  },
});

export default UserProfileScreen;