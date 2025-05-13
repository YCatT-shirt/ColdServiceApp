import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '../services/firebase';

const { db, firebase: firebaseInstance } = firebase;

const EquipoConfiguradoScreen = () => {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [fechaConfiguracion, setFechaConfiguracion] = useState(new Date());
  const [mostrarFecha, setMostrarFecha] = useState(false);
  const [tecnicoResponsable, setTecnicoResponsable] = useState('');
  const [voltaje, setVoltaje] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('Operativo');
  const [fechaUltimoMantenimiento, setFechaUltimoMantenimiento] = useState(
    new Date(),
  );
  const [mostrarFechaMantenimiento, setMostrarFechaMantenimiento] =
    useState(false);

  const guardarEnFirebase = async () => {
    if (!nombreEquipo || !marca || !modelo) {
      Alert.alert(
        'Error',
        'Por favor completa al menos los campos obligatorios.',
      );
      return;
    }

    try {
      await db.collection('equipos_configurados').add({
        nombreEquipo,
        marca,
        modelo,
        numeroSerie,
        ubicacion,
        fechaConfiguracion: fechaConfiguracion.toISOString(),
        tecnicoResponsable,
        voltaje,
        capacidad,
        descripcion,
        observaciones,
        estado,
        fechaUltimoMantenimiento: fechaUltimoMantenimiento.toISOString(),
        creadoEn: firebaseInstance.firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Éxito', 'Datos guardados correctamente.');
      limpiarCampos();
    } catch (error) {
      console.error('Error al guardar el equipo:', error);
      Alert.alert('Error', 'No se pudo guardar: ' + error.message);
    }
  };

  const limpiarCampos = () => {
    setNombreEquipo('');
    setMarca('');
    setModelo('');
    setNumeroSerie('');
    setUbicacion('');
    setFechaConfiguracion(new Date());
    setTecnicoResponsable('');
    setVoltaje('');
    setCapacidad('');
    setDescripcion('');
    setObservaciones('');
    setEstado('Operativo');
    setFechaUltimoMantenimiento(new Date());
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Equipo Configurado</Text>

      <Text style={styles.label}>Nombre del equipo</Text>
      <TextInput
        style={styles.input}
        value={nombreEquipo}
        onChangeText={setNombreEquipo}
      />

      <Text style={styles.label}>Marca</Text>
      <TextInput style={styles.input} value={marca} onChangeText={setMarca} />

      <Text style={styles.label}>Modelo</Text>
      <TextInput style={styles.input} value={modelo} onChangeText={setModelo} />

      <Text style={styles.label}>Número de serie</Text>
      <TextInput
        style={styles.input}
        value={numeroSerie}
        onChangeText={setNumeroSerie}
      />

      <Text style={styles.label}>Ubicación</Text>
      <TextInput
        style={styles.input}
        value={ubicacion}
        onChangeText={setUbicacion}
      />

      <Text style={styles.label}>Fecha de configuración</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMostrarFecha(true)}
      >
        <Text style={styles.dateButtonText}>Seleccionar Fecha</Text>
      </TouchableOpacity>
      <Text style={styles.selectedDateText}>
        {fechaConfiguracion.toLocaleDateString()}
      </Text>
      {mostrarFecha && (
        <DateTimePicker
          value={fechaConfiguracion}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarFecha(false);
            if (selectedDate) setFechaConfiguracion(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Técnico responsable</Text>
      <TextInput
        style={styles.input}
        value={tecnicoResponsable}
        onChangeText={setTecnicoResponsable}
      />

      <Text style={styles.label}>Descripción del equipo</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.label}>Observaciones</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={observaciones}
        onChangeText={setObservaciones}
        multiline
      />

      <Text style={styles.label}>Estado del equipo</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={estado}
          onValueChange={(value) => setEstado(value)}
        >
          <Picker.Item label="En mantenimiento" value="En mantenimiento" />
          <Picker.Item label="Dañado" value="Dañado" />
        </Picker>
      </View>

      <Text style={styles.label}>Fecha de último mantenimiento</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setMostrarFechaMantenimiento(true)}
      >
        <Text style={styles.dateButtonText}>Seleccionar Fecha</Text>
      </TouchableOpacity>
      <Text style={styles.selectedDateText}>
        {fechaUltimoMantenimiento.toLocaleDateString()}
      </Text>
      {mostrarFechaMantenimiento && (
        <DateTimePicker
          value={fechaUltimoMantenimiento}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarFechaMantenimiento(false);
            if (selectedDate) setFechaUltimoMantenimiento(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={guardarEnFirebase}>
        <Text style={styles.saveButtonText}>Guardar equipo</Text>
      </TouchableOpacity>
      <View style={{ height: 10 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007bff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EquipoConfiguradoScreen;
