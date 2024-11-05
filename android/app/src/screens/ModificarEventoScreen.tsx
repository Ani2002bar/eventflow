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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Provider, Portal } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';

type RootStackParamList = {
  ModificarEventos: { eventId: string };
  InvitadoNuevo: undefined;
};

const ModificarEventosScreen: React.FC = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [location, setLocation] = useState('');
  const [observations, setObservations] = useState('');
  const [assistants, setAssistants] = useState<string[]>([]);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ModificarEventos'>>();
  const { eventId } = route.params;

  // Cargar los datos del evento cuando se monta el componente
  useEffect(() => {
    const loadEventData = async () => {
      try {
        const eventDoc = await firestore().collection('events').doc(eventId).get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data();
          setDescription(eventData?.description || '');
          setDate(eventData?.date ? new Date(eventData.date) : null);
          setTime(eventData?.time ? new Date(eventData.time) : null);
          setLocation(eventData?.location || '');
          setObservations(eventData?.observations || '');
          setAssistants(eventData?.assistants || []);
        }
      } catch (error) {
        console.error("Error al cargar el evento: ", error);
        alert("Hubo un error al cargar el evento.");
      }
    };

    loadEventData();
  }, [eventId]);

  const handleDatePress = () => {
    setDatePickerVisibility(true);
  };

  const handleTimePress = () => {
    setTimePickerVisibility(true);
  };

  const onDateConfirm = (params: { date: Date }) => {
    setDate(params.date);
    setDatePickerVisibility(false);
  };

  const onTimeConfirm = (params: { hours: number; minutes: number }) => {
    const selectedTime = new Date();
    selectedTime.setHours(params.hours);
    selectedTime.setMinutes(params.minutes);
    setTime(selectedTime);
    setTimePickerVisibility(false);
  };

  const handleUpdateEvent = async () => {
    if (!description || !date || !time || !location) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const updatedEvent = {
      description,
      date: date.toISOString(),
      time: time.toISOString(),
      location,
      observations,
      assistants,
    };

    try {
      await firestore().collection('events').doc(eventId).update(updatedEvent);
      alert("Evento actualizado exitosamente!");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el evento: ", error);
      alert("Hubo un error al actualizar el evento. Inténtalo nuevamente.");
    }
  };

  return (
    <Provider>
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
            value={date ? date.toLocaleDateString('es-ES') : ''}
            editable={false}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity onPress={handleTimePress}>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            value={time ? `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}` : ''}
            editable={false}
          />
        </TouchableOpacity>

        <Portal>
          <DatePickerModal
            visible={isDatePickerVisible}
            mode="single"
            onDismiss={() => setDatePickerVisibility(false)}
            date={date || new Date()}
            onConfirm={onDateConfirm}
            locale="es"
            saveLabel="Aceptar"
            label="Selecciona la fecha"
            animationType="slide"
            theme={{ colors: { primary: '#6200EA' } }}
          />

          <TimePickerModal
            visible={isTimePickerVisible}
            onDismiss={() => setTimePickerVisibility(false)}
            onConfirm={onTimeConfirm}
            hours={time ? time.getHours() : undefined}
            minutes={time ? time.getMinutes() : undefined}
            label="Selecciona la hora"
            cancelLabel="Cancelar"
            confirmLabel="Aceptar"
            animationType="slide"
            theme={{ colors: { primary: '#6200EA' } }}
          />
        </Portal>

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Lugar del evento"
          value={location}
          onChangeText={setLocation}
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
          <TouchableOpacity onPress={() => navigation.navigate('InvitadoNuevo')} style={styles.addButton}>
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleUpdateEvent}>
          <Text style={styles.createButtonText}>GUARDAR CAMBIOS</Text>
        </TouchableOpacity>
      </View>
    </Provider>
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

export default ModificarEventosScreen;
