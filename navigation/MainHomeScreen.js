import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
//import FormularioIcon from '../assets/formularios.png';


const HomeScreen = ({ navigation, route }) => {
  const { userRole } = route.params;

  const [activeIndex1, setActiveIndex1] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [activeIndex3, setActiveIndex3] = useState(0); // Nuevo estado para el tercer cuadro
 

  const handleScroll1 = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / 120);
    setActiveIndex1(index);
  };

  const handleScroll2 = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / 120);
    setActiveIndex2(index);
  };

  const handleScroll3 = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / 120);
    setActiveIndex3(index);
  };

 

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cold Service</Text>

      <View style={styles.horizontalContainer}>
        {/* Cuadro 1 */}
        <View style={styles.squareButtonContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll1}>
            <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('ProcesoReparacionScreen')}>
              <FontAwesome name="wrench" size={30} color="#fff" />
              <Text style={styles.squareButtonText}>Reporte de Reparación</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('ConsultarProcesoReparacionesScreen')}>
              <FontAwesome name="search" size={24} color="#fff" />
              <Text style={styles.squareButtonText}>Consultar Reparación</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, activeIndex1 === 0 ? styles.activeDot : styles.inactiveDot]} />
            <View style={[styles.dot, activeIndex1 === 1 ? styles.activeDot : styles.inactiveDot]} />
          </View>
        </View>

        {/* Cuadro 2 */}
        <View style={styles.squareButtonContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll2}>
            <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('ReportesScreen')}>
              <FontAwesome name="file" size={30} color="#fff" />
              <Text style={styles.squareButtonText}>Reportes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('ConsultarReportesScreen', { userRole })}>
              <FontAwesome name="clipboard" size={24} color="#fff" />
              <Text style={styles.squareButtonText}>Registros</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, activeIndex2 === 0 ? styles.activeDot : styles.inactiveDot]} />
            <View style={[styles.dot, activeIndex2 === 1 ? styles.activeDot : styles.inactiveDot]} />
          </View>
        </View>
        

         {/* Cuadro 3 - Reportar un Error */}
         <View style={styles.squareButtonContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll3}>
            <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('ReportarErrorScreen')}>
              <FontAwesome name="bug" size={40} color="#fff" />
              <Text style={styles.squareButtonText}>Reportar Error</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.squareButton} onPress={() => navigation.navigate('ConsultarErroresScreen')}>
              <FontAwesome name="exclamation-triangle" size={28} color="#fff" />
              <Text style={styles.squareButtonText}>Consultar Errores</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, activeIndex3 === 0 ? styles.activeDot : styles.inactiveDot]} />
            <View style={[styles.dot, activeIndex3 === 1 ? styles.activeDot : styles.inactiveDot]} />
          </View>
        </View>
      </View>

      {userRole === 'admin' && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserList')}>
          <Text style={styles.buttonText}>Servicio</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    width: '80%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  squareButtonContainer: {
    width: '48%',
    height: 140,
    backgroundColor: '#0303b5',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  squareButton: {
    width: 120,
    height: 100,
    backgroundColor: '#0303b5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  squareButtonText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  inactiveDot: {
    backgroundColor: '#aaa',
  },
});

export default HomeScreen;
