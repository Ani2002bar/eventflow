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
import Header from '../components/Header';
import GuestDetailsModal from '../components/GuestDetailsModal';

type RootStackParamList = {
  ModificarEvento: { eventId: string };
  InvitadoNuevo: { eventId: string, onGuestAdded: (guest: any) => void };
};

const ModificarEventoScreen: React.FC = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [observations, setObservations] = useState('');
  const [assistants, setAssistants] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ModificarEvento'>>();
  const { eventId } = route.params;

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const eventDoc = await firestore().collection('events').doc(eventId).get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data();
          setDescription(eventData?.description || '');
          setDate(new Date(eventData?.date));
          setTime(new Date(eventData?.time));
          setLocation(eventData?.location || '');
          setObservations(eventData?.observations || '');
        }

        const guestsSnapshot = await firestore()
          .collection('guests')
          .where('eventId', '==', eventId)
          .get();
        const guestsList = guestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssistants(guestsList);
      } catch (error) {
        console.error('Error al cargar los datos del evento:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del evento.');
      }
    };

    loadEventData();
  }, [eventId]);

  const handleUpdateEvent = async () => {
    if (!description || !date || !time || !location || assistants.length === 0) {
      Alert.alert('Por favor completa todos los campos y añade al menos un invitado.');
      return;
    }

    try {
      await firestore().collection('events').doc(eventId).update({
        description,
        date: date.toISOString(),
        time: time.toISOString(),
        location,
        observations,
      });
      Alert.alert('Evento actualizado exitosamente!');
      navigation.goBack();
    } catch (error) {
      console.error('Error al actualizar el evento:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el evento.');
    }
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
      console.error('Error al eliminar el invitado:', error);
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
      console.error('Error al actualizar el invitado:', error);
      Alert.alert('Error', 'No se pudo actualizar el invitado.');
    }
  };

  const navigateToAddGuest = () => {
    navigation.navigate('InvitadoNuevoScreen', {
      eventId,
      onGuestAdded: (newGuest: any) => setAssistants([...assistants, newGuest]),
    });
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
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            value={date ? date.toLocaleDateString('es-ES') : ''}
            editable={false}
          />
        </TouchableOpacity>

        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
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
            onConfirm={(params) => {
              setDate(params.date);
              setDatePickerVisibility(false);
            }}
            locale="es"
            saveLabel="Aceptar"
            label="Selecciona la fecha"
            animationType="slide"
          />

          <TimePickerModal
            visible={isTimePickerVisible}
            onDismiss={() => setTimePickerVisibility(false)}
            onConfirm={(params) => {
              const selectedTime = new Date();
              selectedTime.setHours(params.hours);
              selectedTime.setMinutes(params.minutes);
              setTime(selectedTime);
              setTimePickerVisibility(false);
            }}
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

        <TouchableOpacity style={styles.createButton} onPress={handleUpdateEvent}>
          <Text style={styles.createButtonText}>ACTUALIZAR EVENTO</Text>
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModificarEventoScreen;
