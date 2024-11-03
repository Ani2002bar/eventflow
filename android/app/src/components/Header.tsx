import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Header: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Logo */}
      <Image source={require('../assets/food/eventflow.png')} style={styles.logo} />
      
      {/* Ícono de usuario */}
      <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
        <Icon name="person-circle" size={30} color="#6200EA" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 40,
  },
});

export default Header;