//Bibliotecas necesarias.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider
import { ThemeProvider } from './context/ThemeContext';
import HomeTabs from './navigation/HomeTabs';
import 'react-native-gesture-handler';

// Importamos todas las pantallas.
import LoginScreen from './navigation/LoginScreen';
import UserList from './user/UserList';
import CreateUserScreen from './user/CreateUserScreen';
import UserDetailScreen from './user/UserDetailScreen';
import ReportesScreen from './reports/ReportesScreen';
import ReporteViaticosScreen from './reports/ReporteViaticosScreen';
import ConsultarReportesScreen from './querys/ConsultarReportesScreen';
import ConfigScreen from './utils/ConfigScreen';
import ProcesoReparacionScreen from './reports/ProcesoReparacionScreen';
import ConsultarProcesoReparacionesScreen from './querys/ConsultarProcesoReparacionesScreen';
import ReportarErrorScreen from './utils/ReportarErrorScreen';
import ConsultarErroresScreen from './querys/ConsultarErrores';
import CostosReparacionesScreen from './reports/CostoReparacionesScreen';
import Chat from './utils/Chat';
import ChatRoom from './utils/ChatRoom';
import ViaticosScreen from './reports/ViaticosScreen';
import LicenciasTecnicosScreen from './utils/LicenciasTecnicosScreen.js';
import EquipoConfiguradoScreen from './reports/EquipoConfiguradoScreen';
import ConsultarEquiposConfiguradosScreen from './querys/ConsultarEquiposConfiguradosScreen';

//_______________________________________________________________________________________________________________________________

// Crea el navegador de pila
const Stack = createNativeStackNavigator();

// Define la pila de navegación
function MyStack() {
  return (
    <ThemeProvider>
      <Stack.Navigator initialRouteName="LoginScreen">
        {/* Pantalla de inicio de sesión */}
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }} // Oculta el header en LoginScreen
        />
        {/* Pantalla principal */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeTabs} // ahora usa el Bottom Tabs
          options={{ headerShown: false }}
        />
        {/* Otras pantallas */}
        <Stack.Screen
          name="UserList"
          component={UserList}
          options={{ title: 'Lista de Usuarios' }}
        />
        <Stack.Screen
          name="EquipoConfiguradoScreen"
          component={EquipoConfiguradoScreen}
          options={{ title: 'Equipo configurado' }}
        />
        <Stack.Screen
          name="ConsultarEquiposConfiguradosScreen"
          component={ConsultarEquiposConfiguradosScreen}
          options={{ title: 'Consulta de equipos configurados' }}
        />
        <Stack.Screen
          name="LicenciasTecnicosScreen"
          component={LicenciasTecnicosScreen}
          options={{ title: 'Licencias Tecnicos' }}
        />
        <Stack.Screen
          name="ViaticosScreen"
          component={ViaticosScreen}
          options={{ title: 'Viaticos' }}
        />
        <Stack.Screen
          name="CostoReparacionesScreen"
          component={CostosReparacionesScreen}
          options={{ title: 'Costo de reparaciones' }}
        />
        <Stack.Screen
          name="CreateUserScreen"
          component={CreateUserScreen}
          options={{ title: 'Crear Usuario' }}
        />
        <Stack.Screen
          name="UserDetailScreen"
          component={UserDetailScreen}
          options={{ title: 'Detalle del Usuario' }}
        />
        <Stack.Screen
          name="ReportesScreen"
          component={ReportesScreen}
          options={{ title: 'Reportes de Servicio' }}
        />
        <Stack.Screen
          name="ConsultarReportesScreen"
          component={ConsultarReportesScreen}
          options={{ title: 'Consultar Reportes' }}
        />
        {/* Nueva pantalla de reporte de viáticos */}
        <Stack.Screen
          name="ReporteViaticosScreen" // Registra la pantalla de reporte de viáticos
          component={ReporteViaticosScreen}
          options={{ title: 'Reporte de Viáticos' }}
        />
        {/* Pantalla de configuración */}
        <Stack.Screen
          name="ConfigScreen"
          component={ConfigScreen}
          options={{ title: 'Configuración' }}
        />
        {/* Pantalla de PROCESO DE REPARACION */}
        <Stack.Screen
          name="ProcesoReparacionScreen"
          component={ProcesoReparacionScreen}
          options={{ title: 'Proceso de Reparación' }}
        />
        {/* Pantalla de CONSULTAR PROCESO DE REPARACION */}
        <Stack.Screen
          name="ConsultarProcesoReparacionesScreen"
          component={ConsultarProcesoReparacionesScreen}
          options={{ title: 'Consultar Reportes de Reparación' }}
        />

        {/* Pantalla de Reportar Error */}
        <Stack.Screen
          name="ReportarErrorScreen"
          component={ReportarErrorScreen}
          options={{ title: 'Reportar Error' }}
        />
        {/* Pantalla de CONULTAR Error */}
        <Stack.Screen
          name="ConsultarErroresScreen"
          component={ConsultarErroresScreen}
          options={{ title: 'Consultar Errores' }}
        />
        {/* Pantalla de CHAT */}
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{ title: 'Chat' }}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoom}
          options={{ title: 'Sala de Chat' }}
        />
      </Stack.Navigator>
    </ThemeProvider>
  );
}

// Componente principal de la aplicación
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </AuthProvider>
  );
}
//Buenas buenas, ¿puedes verlo?dfdfdfdfdfdf algo bien es 100% tiempo real
// se rifó mi compa que me lo recomendó ajajajjajajaja
