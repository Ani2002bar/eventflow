import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface GuestDetailsModalProps {
  visible: boolean;
  guest: any;
  onClose: () => void;
  onUpdate: (updatedGuest: any) => void;
  onDelete: (guestId: string) => void;
}

const GuestDetailsModal: React.FC<GuestDetailsModalProps> = ({ visible, guest, onClose, onUpdate, onDelete }) => {
  const [guestDetails, setGuestDetails] = useState(guest);
  const [successMessage, setSuccessMessage] = useState('');

  React.useEffect(() => {
    setGuestDetails(guest);
    setSuccessMessage('');
  }, [guest]);

  const handleUpdate = () => {
    onUpdate(guestDetails);
    setSuccessMessage('Invitado modificado correctamente');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 2000);
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que quieres eliminar este invitado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            onDelete(guestDetails.id);
            setSuccessMessage('Invitado eliminado correctamente');
            setTimeout(() => {
              setSuccessMessage('');
              onClose();
            }, 2000);
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalles del Invitado</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Nombre"
            value={guestDetails?.nombre}
            onChangeText={(text) => setGuestDetails({ ...guestDetails, nombre: text })}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Edad"
            keyboardType="numeric"
            value={guestDetails?.edad}
            onChangeText={(text) => setGuestDetails({ ...guestDetails, edad: text })}
          />

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={guestDetails?.sexo}
              style={styles.picker}
              onValueChange={(itemValue) => setGuestDetails({ ...guestDetails, sexo: itemValue })}
            >
              <Picker.Item label="Sexo" value="" color="#9e9e9e" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>

          <TextInput
            style={styles.modalInput}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={guestDetails?.telefono}
            onChangeText={(text) => setGuestDetails({ ...guestDetails, telefono: text })}
          />

          {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  updateButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#6200EA',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#FF4081',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  closeButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#6200EA',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessage: {
    color: '#4CAF50',
    fontSize: 14,
    marginBottom: 15,
  },
});

export default GuestDetailsModal;
