import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import firestore from '@react-native-firebase/firestore';
import GuestDetailsModal from '../components/GuestDetailsModal';

type RootStackParamList = {
  EventDetailScreen: { eventId: string };
};

interface Event {
  id: string;
  description: string;
  date: string;
  location: string;
  time: string;
  observations: string;
}

interface Guest {
  id: string;
  nombre: string;
  edad: string;
  sexo: string;
  telefono: string;
}

const EventDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetailScreen'>>();
  const { eventId } = route.params;
  const navigation = useNavigation();
  const [event, setEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Cargar los detalles del evento
        const eventDoc = await firestore().collection('events').doc(eventId).get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data() as Event;
          setEvent({
            ...eventData,
            date: new Date(eventData.date).toLocaleDateString('es-ES'),
            time: new Date(eventData.time).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        } else {
          console.warn('No se encontró el evento.');
        }

        // Cargar los invitados relacionados con el `eventId`
        const guestsSnapshot = await firestore()
          .collection('guests')
          .where('eventId', '==', eventId)
          .get();

        const guestsList = guestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Guest[];
        setGuests(guestsList);
      } catch (error) {
        console.error('Error al cargar detalles del evento:', error);
        Alert.alert('Error', 'No se pudieron cargar los detalles del evento.');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const openGuestModal = (guest: Guest) => {
    setSelectedGuest(guest);
    setModalVisible(true);
  };

  const closeGuestModal = () => {
    setSelectedGuest(null);
    setModalVisible(false);
  };

  const handleUpdateGuest = async (updatedGuest: Guest) => {
    try {
      await firestore().collection('guests').doc(updatedGuest.id).update(updatedGuest);
      setGuests((prevGuests) =>
        prevGuests.map((guest) => (guest.id === updatedGuest.id ? updatedGuest : guest))
      );
      Alert.alert('Éxito', 'Los detalles del invitado se han actualizado.');
      closeGuestModal();
    } catch (error) {
      console.error('Error al actualizar el invitado:', error);
      Alert.alert('Error', 'No se pudo actualizar el invitado.');
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      await firestore().collection('guests').doc(guestId).delete();
      setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== guestId));
      Alert.alert('Éxito', 'El invitado ha sido eliminado.');
      closeGuestModal();
    } catch (error) {
      console.error('Error al eliminar el invitado:', error);
      Alert.alert('Error', 'No se pudo eliminar el invitado.');
    }
  };

  if (!event) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.label}>Descripción</Text>
      <Text style={styles.text}>{event.description}</Text>

      <Text style={styles.label}>Fecha</Text>
      <Text style={styles.text}>{event.date}</Text>

      <Text style={styles.label}>Ubicación</Text>
      <Text style={styles.text}>{event.location}</Text>

      <Text style={styles.label}>Hora</Text>
      <Text style={styles.text}>{event.time}</Text>

      <Text style={styles.label}>Observaciones</Text>
      <Text style={styles.text}>{event.observations}</Text>

      <View style={styles.assistantsSection}>
        <Text style={styles.label}>Asistentes</Text>
        <FlatList
          data={guests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openGuestModal(item)}>
              <View style={styles.assistantContainer}>
                <Text style={styles.assistantText}>{item.nombre}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      {selectedGuest && (
        <GuestDetailsModal
          visible={isModalVisible}
          guest={selectedGuest}
          onClose={closeGuestModal}
          onUpdate={handleUpdateGuest}
          onDelete={handleDeleteGuest}
        />
      )}
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
  text: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  assistantsSection: {
    backgroundColor: '#f0f0f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  assistantContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  assistantText: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    backgroundColor: '#6200EA',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
});

export default EventDetailScreen;
