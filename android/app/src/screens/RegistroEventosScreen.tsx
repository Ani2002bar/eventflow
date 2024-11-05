import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Provider, Portal } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Header from '../components/Header';
import GuestDetailsModal from '../components/GuestDetailsModal';

type RootStackParamList = {
  RegistroEventosScreen: { newGuest?: { nombre: string; edad: string; sexo: string; telefono: string; id: string } };
  InvitadoNuevoScreen: { eventId?: string; onGuestAdded: (guest: any) => void };
};

const RegistroEventosScreen: React.FC = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [location, setLocation] = useState('');
  const [observations, setObservations] = useState('');
  const [assistants, setAssistants] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'RegistroEventosScreen'>>();
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (route.params?.newGuest) {
      const { newGuest } = route.params;
      setAssistants((prevAssistants) => [...prevAssistants, newGuest]);
      navigation.setParams({ newGuest: undefined });
    }
  }, [route.params?.newGuest, navigation]);

  const handleDatePress = () => setDatePickerVisibility(true);
  const handleTimePress = () => setTimePickerVisibility(true);

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

  const handleCreateEvent = async () => {
    if (!description || !date || !time || !location || assistants.length === 0) {
      Alert.alert('Por favor completa todos los campos y añade al menos un invitado.');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    const newEvent = {
      description,
      date: date.toISOString(),
      time: time.toISOString(),
      location,
      observations,
      userId: currentUser.uid, // Añade el ID del usuario autenticado
    };

    try {
      // Crear el evento en Firestore y obtener el ID del evento
      const eventRef = await firestore().collection('events').add(newEvent);
      const eventId = eventRef.id;

      // Guardar cada invitado en la colección `guests` con el `eventId`
      for (const assistant of assistants) {
        await firestore().collection('guests').add({
          ...assistant,
          eventId: eventId, // Asocia el invitado al evento
        });
      }

      Alert.alert('Evento creado exitosamente!');
      navigation.goBack();
    } catch (error) {
      console.error('Error al crear el evento: ', error);
      Alert.alert('Hubo un error al crear el evento. Inténtalo nuevamente.');
    }
  };

  // Función para navegar a la pantalla de agregar invitado
  const navigateToAddGuest = () => {
    navigation.navigate('InvitadoNuevoScreen', {
      onGuestAdded: (newGuest: any) => setAssistants((prevAssistants) => [...prevAssistants, newGuest]),
    });
  };

  const openGuestModal = (guest: any) => {
    setSelectedGuest(guest);
    setModalVisible(true);
  };

  const closeGuestModal = () => {
    setSelectedGuest(null);
    setModalVisible(false);
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      await firestore().collection('guests').doc(guestId).delete();
      setAssistants((prevAssistants) => prevAssistants.filter((g) => g.id !== guestId));
      Alert.alert('Invitado eliminado', 'El invitado ha sido eliminado exitosamente.');
      closeGuestModal();
    } catch (error) {
      console.error('Error al eliminar el invitado: ', error);
      Alert.alert('Error', 'No se pudo eliminar el invitado.');
    }
  };

  const handleUpdateGuest = async (updatedGuest: any) => {
    try {
      await firestore().collection('guests').doc(updatedGuest.id).update(updatedGuest);
      setAssistants((prevAssistants) =>
        prevAssistants.map((guest) => (guest.id === updatedGuest.id ? updatedGuest : guest))
      );
      Alert.alert('Invitado actualizado', 'Los detalles del invitado han sido actualizados.');
      closeGuestModal();
    } catch (error) {
      console.error('Error al actualizar el invitado: ', error);
      Alert.alert('Error', 'No se pudo actualizar el invitado.');
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

        <Text style={styles.label}>Asistentes</Text>
        <View style={styles.assistantsContainer}>
          {assistants.length === 0 ? (
            <Text style={styles.emptyMessage}>Añadir invitados al evento</Text>
          ) : (
            <FlatList
              data={assistants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openGuestModal(item)}>
                  <View style={styles.assistantContainer}>
                    <Text style={styles.assistantText}>{item.nombre}</Text>
                    <Text style={styles.detailsText}>Detalles</Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.assistantsList}
            />
          )}
        </View>

        <TouchableOpacity onPress={navigateToAddGuest} style={styles.addButton}>
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
          <Text style={styles.createButtonText}>CREAR EVENTO</Text>
        </TouchableOpacity>

        <GuestDetailsModal
          visible={isModalVisible}
          guest={selectedGuest}
          onClose={closeGuestModal}
          onUpdate={handleUpdateGuest}
          onDelete={handleDeleteGuest}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  assistantsContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    height: 150,
  },
  assistantsList: {
    flexGrow: 0,
  },
  emptyMessage: {
    color: '#888',
    fontStyle: 'italic',
  },
  assistantContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  assistantText: {
    fontSize: 16,
  },
  detailsText: {
    fontSize: 14,
    color: '#007bff',
  },
  addButton: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 15,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RegistroEventosScreen;
