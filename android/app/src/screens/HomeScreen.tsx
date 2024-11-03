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
import Header from '../components/Header';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

const HomeScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    setEvents([
      { id: '1', title: 'Fiesta XX', date: '2023-08-10', description: 'Celebración especial con amigos.' },
      { id: '2', title: 'Casamiento', date: '2023-08-20', description: 'Boda de amigos.' },
    ]);
  }, []);

  const renderEventItem = ({ item }: { item: Event }) => {
    const eventDate = new Date(item.date);
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('EventDetailScreen', { eventId: item.id })}
      >
        <View style={styles.eventDateContainer}>
          <Text style={styles.eventMonth}>{eventDate.toLocaleString('default', { month: 'short' })}</Text>
          <Text style={styles.eventDay}>{eventDate.getDate()}</Text>
        </View>
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>{item.date}</Text>
        </View>
        <TouchableOpacity style={styles.optionsButton}>
          <Icon name="ellipsis-horizontal" size={20} color="#333" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const filteredEvents = events.filter((event) => {
    const eventMonth = new Date(event.date).getMonth() + 1;
    return selectedMonth === '' || eventMonth === parseInt(selectedMonth);
  });

  return (
    <View style={styles.container}>
      {/* Reutilizar el componente Header */}
      <Header />

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar evento"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtro de mes */}
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

      {/* Lista de eventos */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        contentContainerStyle={styles.eventList}
      />

      {/* Botón flotante para agregar un nuevo evento */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('RegistroEventosScreen')}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    marginBottom: 20,
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
    paddingBottom: 80,
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
    marginRight: 15,
  },
  eventMonth: {
    fontSize: 14,
    color: '#6200EA',
  },
  eventDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDetails: {
    flex: 1,
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