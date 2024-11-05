import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';
import { Menu, Provider } from 'react-native-paper';

interface Event {
  id: string;
  description: string;
  date: string;
  time: string;
  location: string;
  observations: string;
  assistants: string[];
}

const HomeScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigation = useNavigation();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const fetchEvents = async () => {
    try {
      const eventsList: Event[] = [];
      const querySnapshot = await firestore().collection('events').get();
      querySnapshot.forEach((doc) => {
        eventsList.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsList);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  useEffect(() => {
    fetchEvents();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const handleModifyEvent = (event: Event) => {
    setSelectedEvent(event);
    closeMenu();
    navigation.navigate('ModificarEventoScreen', { eventId: event.id });
  };

  const handleDeleteEvent = async (event: Event) => {
    try {
      await firestore().collection('events').doc(event.id).delete();
      setEvents(events.filter(e => e.id !== event.id));
    } catch (error) {
      console.error("Error al eliminar evento:", error);
    } finally {
      closeMenu();
    }
  };

  const renderEventItem = ({ item }: { item: Event }) => {
    const eventDate = new Date(item.date);
    const eventTime = new Date(item.time);
    const formattedDate = eventDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const formattedTime = `${eventTime.getHours()}:${eventTime.getMinutes().toString().padStart(2, '0')}`;

    return (
      <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate('EventDetailScreen', { eventId: item.id })}>
        <View style={styles.eventDateContainer}>
          <Text style={styles.eventMonth}>{eventDate.toLocaleString('es-ES', { month: 'short' })}</Text>
          <Text style={styles.eventDay}>{eventDate.getDate()}</Text>
        </View>
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.description}</Text>
          <Text style={styles.eventDate}>Fecha: {formattedDate}</Text>
          <Text style={styles.eventTime}>Hora: {formattedTime}</Text>
        </View>
        <Menu
          visible={visible && selectedEvent?.id === item.id}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={() => {
              setSelectedEvent(item);
              openMenu();
            }}>
              <Icon name="ellipsis-horizontal" size={20} color="#333" />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => handleModifyEvent(item)} title="Modificar" />
          <Menu.Item onPress={() => handleDeleteEvent(item)} title="Eliminar" />
        </Menu>
      </TouchableOpacity>
    );
  };

  const filteredEvents = events.filter((event) => {
    const eventMonth = new Date(event.date).getMonth() + 1;
    return (selectedMonth === '' || eventMonth === parseInt(selectedMonth)) &&
           (search === '' || event.description.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <Provider>
      <View style={styles.container}>
        <Header />

        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar evento"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filtrar por mes:</Text>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              <Picker.Item label="Todos" value="" />
              <Picker.Item label="Enero" value="1" />
              <Picker.Item label="Febrero" value="2" />
              <Picker.Item label="Marzo" value="3" />
              <Picker.Item label="Abril" value="4" />
              <Picker.Item label="Mayo" value="5" />
              <Picker.Item label="Junio" value="6" />
              <Picker.Item label="Julio" value="7" />
              <Picker.Item label="Agosto" value="8" />
              <Picker.Item label="Septiembre" value="9" />
              <Picker.Item label="Octubre" value="10" />
              <Picker.Item label="Noviembre" value="11" />
              <Picker.Item label="Diciembre" value="12" />
            </Picker>
          </View>

          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEventItem}
            contentContainerStyle={styles.eventList}
          />
        </View>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('RegistroEventosScreen')}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
    paddingBottom: 80,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  picker: {
    flex: 1,
  },
  eventList: {
    paddingTop: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  eventDateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    marginRight: 15,
  },
  eventMonth: {
    fontSize: 12,
    color: '#6200EA',
    textTransform: 'uppercase',
  },
  eventDay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
  },
  eventTime: {
    fontSize: 12,
    color: '#666',
  },
  optionsButton: {
    padding: 5,
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
