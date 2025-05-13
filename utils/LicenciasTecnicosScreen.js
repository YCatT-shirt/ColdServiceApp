import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
const { width } = Dimensions.get('window');
import { firebase, db, auth, storage } from '../services/firebase';
import firebaseInstance from '../services/firebase';

// Función para formatear fechas
const formatDate = (date) => {
  if (!date) return '--/--/----';

  try {
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString('es-MX');
  } catch (e) {
    console.error('Error formateando fecha:', e);
    return '--/--/----';
  }
};

const LicenciasTecnicosScreen = ({ navigation }) => {
  // Estados del formulario
  const [form, setForm] = useState({
    nombre: '',
    numeroLicencia: '',
    tipoLicencia: 'basica',
    estado: 'activa',
  });
  const [fechaEmision, setFechaEmision] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [showDatePickerEmision, setShowDatePickerEmision] = useState(false);
  const [showDatePickerVencimiento, setShowDatePickerVencimiento] =
    useState(false);
  const [licencias, setLicencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fotoLicencia, setFotoLicencia] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Tipos de licencia con emojis
  const tiposLicencia = [
    { id: 'basica', nombre: 'Básica 📋' },
    { id: 'intermedia', nombre: 'Intermedia 📑' },
    { id: 'avanzada', nombre: 'Avanzada 📜' },
    { id: 'especializada', nombre: 'Especializada 🏅' },
  ];

  // Estados de licencia con emojis
  const estadosLicencia = [
    { id: 'activa', nombre: 'Activa ✅' },
    { id: 'vencida', nombre: 'Vencida ❌' },
    { id: 'suspendida', nombre: 'Suspendida ⚠️' },
    { id: 'renovada', nombre: 'Renovada 🔄' },
  ];

  // Cargar licencias
  useEffect(() => {
    cargarLicencias();
  }, []);

  const cargarLicencias = async () => {
    try {
      setLoading(true);
      const snapshot = await db
        .collection('licencias_tecnicos')
        .orderBy('fechaVencimiento', 'desc')
        .limit(100)
        .get();

      const licenciasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        fechaEmision: doc.data().fechaEmision,
        fechaVencimiento: doc.data().fechaVencimiento,
      }));

      setLicencias(licenciasData);
    } catch (error) {
      console.error('Error cargando licencias:', error);
      Alert.alert('Error', 'No se pudieron cargar las licencias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refrescar lista
  const onRefresh = () => {
    setRefreshing(true);
    cargarLicencias();
  };

  // Manejar cambios en el formulario
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar fechas
  const handleDateChange = (date, setDate) => {
    setDate(date);
    if (setDate === setFechaEmision && date > fechaVencimiento) {
      setFechaVencimiento(date);
    }
  };

  // Seleccionar foto
  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a las fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setFotoLicencia({
        uri: image.uri,
        name: `licencia_${Date.now()}.jpg`,
        size: image.fileSize || 0,
      });
    }
  };

  // Tomar foto
  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      setFotoLicencia({
        uri: image.uri,
        name: `licencia_${Date.now()}.jpg`,
        size: image.fileSize || 0,
      });
    }
  };

  // Subir imagen
  const subirImagen = async () => {
    if (!fotoLicencia) return null;

    try {
      const filename = `licencias/${form.numeroLicencia}_${Date.now()}.jpg`;
      const reference = storage.ref(filename);

      const response = await fetch(fotoLicencia.uri);
      const blob = await response.blob();

      await reference.put(blob);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error('Error al subir la imagen');
    }
  };

  // Guardar licencia
  const guardarLicencia = async () => {
    if (!form.nombre || !form.numeroLicencia) {
      Alert.alert('Error', 'Complete los campos obligatorios');
      return;
    }

    if (fechaVencimiento < fechaEmision) {
      Alert.alert('Error', 'La fecha de vencimiento no puede ser anterior');
      return;
    }

    setLoading(true);

    try {
      const fotoUrl = fotoLicencia ? await subirImagen() : null;

      const licenciaData = {
        ...form,
        fotoUrl,
        fechaEmision: firebase.firestore.Timestamp.fromDate(fechaEmision),
        fechaVencimiento:
          firebase.firestore.Timestamp.fromDate(fechaVencimiento),
        fechaRegistro: firebase.firestore.FieldValue.serverTimestamp(),
        estado: calcularEstadoLicencia(fechaVencimiento),
      };

      const querySnapshot = await db
        .collection('licencias_tecnicos')
        .where('numeroLicencia', '==', form.numeroLicencia)
        .get();

      if (!querySnapshot.empty) {
        Alert.alert('Advertencia', 'Licencia ya existe. ¿Actualizar?', [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Actualizar',
            onPress: async () => {
              await db
                .collection('licencias_tecnicos')
                .doc(querySnapshot.docs[0].id)
                .update(licenciaData);
              Alert.alert('Éxito', 'Licencia actualizada');
              resetForm();
              cargarLicencias();
            },
          },
        ]);
        return;
      }

      await db.collection('licencias_tecnicos').add(licenciaData);
      Alert.alert('Éxito', 'Licencia registrada');
      resetForm();
      cargarLicencias();
    } catch (error) {
      console.error('Error guardando licencia:', error);
      Alert.alert('Error', error.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estado
  const calcularEstadoLicencia = (fechaVencimiento) => {
    return fechaVencimiento < new Date() ? 'vencida' : form.estado;
  };

  // Resetear formulario
  const resetForm = () => {
    setForm({
      nombre: '',
      numeroLicencia: '',
      tipoLicencia: 'basica',
      estado: 'activa',
    });
    setFotoLicencia(null);
    setFechaEmision(new Date());
    setFechaVencimiento(new Date());
  };

  // Filtrar licencias
  const licenciasFiltradas = licencias.filter(
    (licencia) =>
      licencia.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      licencia.numeroLicencia.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Renderizar item
  const renderLicencia = ({ item }) => {
    const estaVencida =
      item.estado === 'vencida' ||
      (item.fechaVencimiento && item.fechaVencimiento.toDate() < new Date());

    return (
      <TouchableOpacity
        style={[styles.licenciaItem, estaVencida && styles.licenciaVencida]}
        onPress={() =>
          navigation.navigate('DetalleLicencia', { licenciaId: item.id })
        }
      >
        <View style={styles.licenciaHeader}>
          <Text style={styles.licenciaNombre}>{item.nombre}</Text>
          <Text
            style={[
              styles.licenciaEstado,
              styles[
                `estado${estaVencida ? 'Vencida' : item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}`
              ],
            ]}
          >
            {estaVencida
              ? 'VENCIDA ❌'
              : `${item.estado.toUpperCase()} ${item.estado === 'activa' ? '✅' : item.estado === 'renovada' ? '🔄' : '⚠️'}`}
          </Text>
        </View>

        <Text style={styles.licenciaText}>
          🔢 Número: {item.numeroLicencia}
        </Text>
        <Text style={styles.licenciaText}>
          📋 Tipo:{' '}
          {tiposLicencia
            .find((t) => t.id === item.tipoLicencia)
            ?.nombre.split(' ')[0] || item.tipoLicencia}
        </Text>

        <View style={styles.fechasContainer}>
          <Text style={styles.fechaText}>
            📅 Emisión: {formatDate(item.fechaEmision)}
          </Text>
          <Text style={styles.fechaText}>
            ⏳ Vence: {formatDate(item.fechaVencimiento)}
          </Text>
        </View>

        {item.fotoUrl && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ImageViewer', { uri: item.fotoUrl })
            }
          >
            <Text style={styles.verFotoText}>📸 Ver foto de licencia</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Text style={{ position: 'absolute', left: 10, top: 12, fontSize: 20 }}>
          🔍
        </Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar técnicos o licencias..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498DB']}
          />
        }
      >
        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>📝 REGISTRAR NUEVA LICENCIA</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>👤 Nombre del Técnico *</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Nombre completo"
              value={form.nombre}
              onChangeText={(text) => handleChange('nombre', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🆔 Número de Licencia *</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Número oficial"
              value={form.numeroLicencia}
              onChangeText={(text) => handleChange('numeroLicencia', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📋 Tipo de Licencia *</Text>
            <View style={styles.radioGroup}>
              {tiposLicencia.map((tipo) => (
                <TouchableOpacity
                  key={tipo.id}
                  style={[
                    styles.radioButton,
                    form.tipoLicencia === tipo.id && styles.radioButtonSelected,
                  ]}
                  onPress={() => handleChange('tipoLicencia', tipo.id)}
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      form.tipoLicencia === tipo.id &&
                        styles.radioButtonTextSelected,
                    ]}
                  >
                    {tipo.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔄 Estado</Text>
            <View style={styles.radioGroup}>
              {estadosLicencia.map((estado) => (
                <TouchableOpacity
                  key={estado.id}
                  style={[
                    styles.radioButton,
                    form.estado === estado.id && styles.radioButtonSelected,
                  ]}
                  onPress={() => handleChange('estado', estado.id)}
                >
                  <Text
                    style={[
                      styles.radioButtonText,
                      form.estado === estado.id &&
                        styles.radioButtonTextSelected,
                    ]}
                  >
                    {estado.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.datesRow}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>📅 Fecha Emisión</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePickerEmision(true)}
              >
                <Text style={{ fontSize: 20 }}>📅</Text>
                <Text style={styles.dateText}>{formatDate(fechaEmision)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.inputLabel}>⏳ Fecha Vencimiento</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePickerVencimiento(true)}
              >
                <Text style={{ fontSize: 20 }}>📅</Text>
                <Text style={styles.dateText}>
                  {formatDate(fechaVencimiento)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePickerEmision && (
            <DateTimePicker
              value={fechaEmision}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePickerEmision(false);
                if (date) handleDateChange(date, setFechaEmision);
              }}
            />
          )}

          {showDatePickerVencimiento && (
            <DateTimePicker
              value={fechaVencimiento}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePickerVencimiento(false);
                if (date) handleDateChange(date, setFechaVencimiento);
              }}
              minimumDate={fechaEmision}
            />
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📸 Foto de la Licencia</Text>
            <View style={styles.imageButtonsRow}>
              <TouchableOpacity
                style={[styles.imageButton, styles.cameraButton]}
                onPress={tomarFoto}
              >
                <Text style={{ fontSize: 20, marginRight: 8 }}>📸</Text>
                <Text style={styles.imageButtonText}>TOMAR FOTO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.imageButton, styles.galleryButton]}
                onPress={seleccionarFoto}
              >
                <Text style={{ fontSize: 20, marginRight: 8 }}>🖼️</Text>
                <Text style={styles.imageButtonText}>SELECCIONAR</Text>
              </TouchableOpacity>
            </View>

            {fotoLicencia && (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: fotoLicencia.uri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                <TouchableOpacity
                  style={styles.deleteImageButton}
                  onPress={() => setFotoLicencia(null)}
                >
                  <Text style={{ fontSize: 18, color: '#E74C3C' }}>❌</Text>
                </TouchableOpacity>
                <Text style={styles.imageSizeText}>
                  {(fotoLicencia.size / (1024 * 1024)).toFixed(2)} MB
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={guardarLicencia}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.saveButtonText}>💾 GUARDAR LICENCIA</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Listado */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>📋 LICENCIAS REGISTRADAS</Text>
            <Text style={styles.licenciasCount}>
              {licenciasFiltradas.length} registros
            </Text>
          </View>

          {licenciasFiltradas.length === 0 ? (
            <Text style={styles.emptyText}>
              {searchQuery
                ? '🔍 No hay resultados'
                : '📭 No hay licencias registradas'}
            </Text>
          ) : (
            <FlatList
              data={licenciasFiltradas}
              renderItem={renderLicencia}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// Estilos (simplificados pero mantenidos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  searchContainer: {
    margin: 15,
    marginBottom: 0,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  listContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    margin: 15,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  licenciasCount: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
    backgroundColor: '#FBFCFC',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3498DB',
    marginBottom: 10,
    backgroundColor: '#FFF',
    minWidth: width * 0.4,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#3498DB',
  },
  radioButtonText: {
    color: '#3498DB',
    fontSize: 14,
    fontWeight: '500',
  },
  radioButtonTextSelected: {
    color: '#FFF',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputContainer: {
    width: '48%',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FBFCFC',
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2C3E50',
  },
  imageButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    gap: 10,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flex: 1,
  },
  cameraButton: {
    backgroundColor: '#2980B9',
  },
  galleryButton: {
    backgroundColor: '#3498DB',
  },
  imageButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  previewContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 6,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  imageSizeText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
    marginTop: 5,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  licenciaItem: {
    backgroundColor: '#F8F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EAEDED',
  },
  licenciaVencida: {
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  licenciaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  licenciaNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  licenciaEstado: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  estadoActiva: {
    backgroundColor: '#D5F5E3',
    color: '#27AE60',
  },
  estadoVencida: {
    backgroundColor: '#FADBD8',
    color: '#E74C3C',
  },
  estadoSuspendida: {
    backgroundColor: '#FDEBD0',
    color: '#F39C12',
  },
  estadoRenovada: {
    backgroundColor: '#D6EAF8',
    color: '#3498DB',
  },
  licenciaText: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 3,
  },
  fechasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fechaText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  verFotoText: {
    color: '#3498DB',
    marginTop: 8,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  emptyText: {
    textAlign: 'center',
    color: '#95A5A6',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

export default LicenciasTecnicosScreen;
