import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Header from '../components/Header';

type RootStackParamList = {
  RegistroEventos: { newGuest?: { nombre: string } };
  InvitadoNuevo: undefined;
};

const RegistroEventosScreen: React.FC = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [observations, setObservations] = useState('');
  const [assistants, setAssistants] = useState<string[]>(['Ana Barreto', 'Matías Garay']);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'RegistroEventos'>>();

  useEffect(() => {
    if (route.params?.newGuest) {
      const { newGuest } = route.params;
      setAssistants((prevAssistants) => [...prevAssistants, newGuest.nombre]);
      navigation.setParams({ newGuest: undefined });
    }
  }, [route.params?.newGuest, navigation]);

  const handleDatePress = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
  };

  const handleAddAssistant = () => {
    navigation.navigate('InvitadoNuevo');
  };

  const handleCreateEvent = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción del evento"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Fecha</Text>
      <TouchableOpacity onPress={handleDatePress}>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={date.toLocaleDateString('es-ES')}
          editable={false}
        />
      </TouchableOpacity>

      <DatePicker
        modal
        open={isDatePickerVisible}
        date={date}
        mode="date"
        onConfirm={(selectedDate) => {
          handleConfirm(selectedDate);
        }}
        onCancel={() => setDatePickerVisibility(false)}
        title="Selecciona una fecha"
        confirmText="Aceptar"
        cancelText="Cancelar"
        theme="light" // For a light theme, matching your app's colors
        textColor="#6200EA" // Primary color for selected text/buttons
      />

      <Text style={styles.label}>Ubicación</Text>
      <TextInput
        style={styles.input}
        placeholder="Lugar del evento"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Hora</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Observaciones</Text>
      <TextInput
        style={styles.input}
        placeholder="Detalles adicionales"
        value={observations}
        onChangeText={setObservations}
      />

      <View style={styles.assistantsSection}>
        <Text style={styles.label}>Asistentes</Text>
        <FlatList
          data={assistants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.assistantContainer}>
              <Text style={styles.assistantText}>{item}</Text>
              <TouchableOpacity onPress={() => setAssistants(assistants.filter(a => a !== item))}>
                <Text style={styles.removeText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity onPress={handleAddAssistant} style={styles.addButton}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
        <Text style={styles.createButtonText}>CREAR EVENTO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  assistantsSection: {
    backgroundColor: '#f0f0f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  assistantContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
  },
  assistantText: {
    fontSize: 16,
    color: '#333',
  },
  removeText: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#6200EA',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  createButton: {
    backgroundColor: '#6200EA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistroEventosScreen;