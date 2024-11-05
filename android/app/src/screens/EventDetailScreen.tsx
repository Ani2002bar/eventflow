import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import firestore from '@react-native-firebase/firestore';

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
  assistants: string[];
}

const EventDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'EventDetailScreen'>>();
  const { eventId } = route.params;
  const navigation = useNavigation();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
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
      } catch (error) {
        console.error('Error al cargar detalles del evento:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

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
          data={event.assistants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.assistantContainer}>
              <Text style={styles.assistantText}>{item}</Text>
            </View>
          )}
        />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
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
    flexDirection: 'row',
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
