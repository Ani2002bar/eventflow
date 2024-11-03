import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/Header'; // Importa el encabezado

const InvitadoNuevoScreen: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigation = useNavigation();

  const handleAddGuest = () => {
    if (nombre.trim() && edad.trim() && sexo.trim() && telefono.trim()) {
      navigation.navigate('RegistroEventos', {
        newGuest: { nombre, edad, sexo, telefono }
      });
    } else {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
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
          onChangeText={setEdad}
        />

        {/* Selector de Sexo */}
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
    justifyContent: 'center', // Centra el contenido verticalmente
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