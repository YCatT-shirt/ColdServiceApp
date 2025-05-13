import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import firebase from '../services/firebase';

const { db } = firebase;

const ConsultarEquiposConfiguradosScreen = () => {
  const [equipo, setEquipo] = useState(null);

  useEffect(() => {
    const obtenerEquipo = async () => {
      try {
        const snapshot = await db
          .collection('equipos_configurados')
          .limit(1)
          .get();
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setEquipo(data);
        } else {
          Alert.alert('Error', 'No se encontraron equipos configurados.');
        }
      } catch (error) {
        console.error('Error al obtener el equipo:', error);
        Alert.alert('Error', 'No se pudo obtener el equipo: ' + error.message);
      }
    };

    obtenerEquipo();
  }, []);

  if (!equipo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.text}>Cargando equipo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Consultar Equipos Configurados</Text>

        <View style={styles.equipoContainer}>
          <Text style={styles.label}>Nombre del equipo:</Text>
          <Text style={styles.info}>{equipo.nombreEquipo}</Text>

          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.info}>{equipo.marca}</Text>

          <Text style={styles.label}>Modelo:</Text>
          <Text style={styles.info}>{equipo.modelo}</Text>

          <Text style={styles.label}>Número de serie:</Text>
          <Text style={styles.info}>{equipo.numeroSerie}</Text>

          <Text style={styles.label}>Ubicación:</Text>
          <Text style={styles.info}>{equipo.ubicacion}</Text>

          <Text style={styles.label}>Fecha de configuración:</Text>
          <Text style={styles.info}>
            {new Date(equipo.fechaConfiguracion).toLocaleDateString()}
          </Text>

          <Text style={styles.label}>Técnico responsable:</Text>
          <Text style={styles.info}>{equipo.tecnicoResponsable}</Text>

          <Text style={styles.label}>Descripción del equipo:</Text>
          <Text style={styles.info}>{equipo.descripcion}</Text>

          <Text style={styles.label}>Observaciones:</Text>
          <Text style={styles.info}>{equipo.observaciones}</Text>

          <Text style={styles.label}>Estado del equipo:</Text>
          <Text style={styles.info}>{equipo.estado}</Text>

          {/* Agregar más campos aquí si es necesario */}
          <Text style={styles.label}>Fecha de último mantenimiento:</Text>
          <Text style={styles.info}>
            {new Date(equipo.fechaUltimoMantenimiento).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000080', // Fondo azul
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  equipoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#555',
  },
});

export default ConsultarEquiposConfiguradosScreen;
