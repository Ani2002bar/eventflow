// screens/RegistroEventosScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Provider, Portal } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';
import GuestDetailsModal from '../components/GuestDetailsModal';

type RootStackParamList = {
  RegistroEventos: { newGuest?: { nombre: string } };
  InvitadoNuevo: undefined;
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
  const route = useRoute<RouteProp<RootStackParamList, 'RegistroEventos'>>();

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const snapshot = await firestore().collection('guests').get();
        const guests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAssistants(guests);
      } catch (error) {
        console.error("Error al cargar los invitados: ", error);
      }
    };

    fetchGuests();
  }, []);

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
    if (!description || !date || !time || !location) {
      Alert.alert("Por favor completa todos los campos.");
      return;
    }

    const newEvent = {
      description,
      date: date.toISOString(),
      time: time.toISOString(),
      location,
      observations,
      assistants: assistants.map(a => a.nombre),
    };

    try {
      await firestore().collection('events').add(newEvent);
      Alert.alert("Evento creado exitosamente!");
      navigation.goBack();
    } catch (error) {
      console.error("Error al crear el evento: ", error);
      Alert.alert("Hubo un error al crear el evento. Inténtalo nuevamente.");
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
      setAssistants((prevAssistants) => prevAssistants.filter(g => g.id !== guestId));
      Alert.alert("Invitado eliminado", "El invitado ha sido eliminado exitosamente.");
      closeGuestModal();
    } catch (error) {
      console.error("Error al eliminar el invitado: ", error);
      Alert.alert("Error", "No se pudo eliminar el invitado.");
    }
  };

  const handleUpdateGuest = async (updatedGuest: any) => {
    try {
      await firestore().collection('guests').doc(updatedGuest.id).update(updatedGuest);
      setAssistants((prevAssistants) =>
        prevAssistants.map(guest => guest.id === updatedGuest.id ? updatedGuest : guest)
      );
      Alert.alert("Invitado actualizado", "Los detalles del invitado han sido actualizados.");
      closeGuestModal();
    } catch (error) {
      console.error("Error al actualizar el invitado: ", error);
      Alert.alert("Error", "No se pudo actualizar el invitado.");
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

        <View style={styles.assistantsSection}>
          <Text style={styles.label}>Asistentes</Text>
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
          />
          <TouchableOpacity onPress={() => navigation.navigate('InvitadoNuevo')} style={styles.addButton}>
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

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
  assistantsSection: {
    marginVertical: 15,
  },
  assistantContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  assistantText: {
    fontSize: 16,
  },
  detailsText: {
    color: '#007bff',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007bff',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    width: 50,
    alignSelf: 'flex-end',
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegistroEventosScreen;
