import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { Menu, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Header: React.FC = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const confirmLogout = () => {
    Alert.alert(
      "¿Deseas cerrar sesión?",
      "",
      [
        { text: "Cancelar", style: "cancel", onPress: closeMenu },
        { text: "Cerrar sesión", onPress: handleLogout },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    closeMenu();
    try {
      await AsyncStorage.removeItem('userToken'); // Remueve el token de sesión
      console.log("Sesión cerrada");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Redirige a 'Login'
      });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
    }
  };

  const goToProfile = () => {
    closeMenu();
    console.log("Navegando a UserProfileScreen");
    navigation.navigate('UserProfileScreen');
  };
  
  return (
    <Provider>
      <View style={styles.header}>
        {/* Ícono de usuario a la izquierda con menú desplegable */}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Icon name="person-circle" size={30} color="#6200EA" onPress={openMenu} />
          }
        >
          <Menu.Item onPress={goToProfile} title="Ver Perfil" />
          <Divider />
          <Menu.Item onPress={confirmLogout} title="Cerrar sesión" />
        </Menu>

        {/* Logo centrado */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/food/eventflow.png')} style={styles.logo} />
        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    zIndex: 1000, // para que esté por encima de otros elementos
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
});

export default Header;
