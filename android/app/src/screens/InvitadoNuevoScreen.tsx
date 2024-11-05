import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';

type RootStackParamList = {
  RegistroEventosScreen: { newGuest: any };
  ModificarEventoScreen: { newGuest: any };
  InvitadoNuevoScreen: { eventId?: string; onGuestAdded: (guest: any) => void };
};

const InvitadoNuevoScreen: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'InvitadoNuevoScreen'>>();

  const handleAddGuest = async () => {
    // Validación para verificar si todos los campos están completos
    if (!nombre.trim() || !edad.trim() || !sexo.trim() || !telefono.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Validación para asegurarse de que la edad tenga un máximo de 2 dígitos
    if (edad.length > 2) {
      Alert.alert('Error', 'La edad no puede tener más de dos dígitos.');
      return;
    }

    try {
      const newGuest = {
        nombre,
        edad,
        sexo,
        telefono,
        eventId: route.params?.eventId || null, // Usa null si eventId es undefined
      };
      const guestRef = await firestore().collection('guests').add(newGuest);
      const guestData = { id: guestRef.id, ...newGuest };

      if (route.params?.onGuestAdded) {
        route.params.onGuestAdded(guestData);
        navigation.goBack();
      } else {
        navigation.navigate('RegistroEventosScreen', { newGuest: guestData });
      }
    } catch (error) {
      console.error("Error al agregar el invitado:", error);
      Alert.alert('Error', 'No se pudo agregar el invitado. Inténtalo nuevamente.');
    }
  };

  // Función para actualizar la edad y limitarla a un máximo de 2 dígitos
  const handleAgeChange = (text: string) => {
    if (/^\d{0,2}$/.test(text)) {
      setEdad(text);
    } else {
      Alert.alert('Error', 'La edad solo puede contener un máximo de dos dígitos.');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Invitado Nuevo</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Edad"
          keyboardType="numeric"
          value={edad}
          onChangeText={handleAgeChange}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sexo}
            style={styles.picker}
            onValueChange={(itemValue) => setSexo(itemValue)}
          >
            <Picker.Item label="Sexo" value="" color="#9e9e9e" />
            <Picker.Item label="Masculino" value="Masculino" />
            <Picker.Item label="Femenino" value="Femenino" />
            <Picker.Item label="Otro" value="Otro" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddGuest}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#6200EA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvitadoNuevoScreen;
