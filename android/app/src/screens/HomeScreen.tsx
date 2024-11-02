import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MyButton from '../components/MyButton'; // Asumiendo que tienes un componente de botón personalizado
import Icon from 'react-native-vector-icons/Ionicons';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

const HomeScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Aquí puedes cargar los eventos desde una API o base de datos
    // Ejemplo de datos estáticos:
    setEvents([
      { id: '1', title: 'Concierto de Rock', date: '2023-12-12', description: 'Un concierto inolvidable con las mejores bandas de rock.' },
      { id: '2', title: 'Festival de Comida', date: '2023-12-15', description: 'Disfruta de la mejor gastronomía local.' },
      { id: '3', title: 'Conferencia de Tecnología', date: '2024-01-20', description: 'Actualízate con las últimas tendencias tecnológicas.' },
    ]);
  }, []);

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetailScreen', { eventId: item.id })}
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Eventos</Text>
      
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.eventList}
      />

      {/* Botón flotante para agregar un nuevo evento */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEventScreen')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  eventList: {
    paddingBottom: 80, // Espacio para el botón flotante
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#6200EA',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HomeScreen;