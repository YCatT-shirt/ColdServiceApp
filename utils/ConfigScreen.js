import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const ConfigScreen = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false); // Estado para el interruptor de notificaciones

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState); // Cambiar el estado del interruptor de notificaciones

  const handleReportError = () => {
    // Aquí puedes agregar la lógica para reportar un error
    console.log("Reportar un error");
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
        Pantalla de Configuración
      </Text>

      {/* Interruptor para notificaciones */}
      <View style={styles.switchContainer}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          Notificaciones
        </Text>
        <Switch 
          value={isNotificationsEnabled} 
          onValueChange={toggleNotifications} 
        />
      </View>

      {/* Interruptor para cambiar el tema */}
      <View style={styles.switchContainer}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText]}>
          {isDarkMode ? "Modo Oscuro" : "Modo Claro"}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      {/* Botón para reportar un error */}
      <TouchableOpacity onPress={handleReportError}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText, styles.marginTop]}>
          Reportar un error
        </Text>
      </TouchableOpacity>

      {/* Botón para cuenta */}
      <TouchableOpacity onPress={handleReportError}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText, styles.marginTop]}>
          Cuenta
        </Text>
      </TouchableOpacity>

      {/* Botón para estadísticas */}
      <TouchableOpacity onPress={handleReportError}>
        <Text style={[styles.text, isDarkMode ? styles.darkText : styles.lightText, styles.marginTop]}>
          Estadísticas
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  switchContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  marginTop: {
    marginTop: 35,  // Agregar un espacio entre los textos
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  darkContainer: {
    backgroundColor: '#222',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
});

export default ConfigScreen;
