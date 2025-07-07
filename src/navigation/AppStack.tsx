// src/navigation/AppStack.tsx (ROUTE)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from './src/contexts/AuthContext';
import { getRoleBasedOnToken } from './src/utils/getRoleBasedOnToken';

// Screens
import AuthScreen from './src/screens/AuthScreen';
import ServiciosScreen from './src/screens/ServiciosScreen';
import ReservasScreen from './src/screens/ReservasScreen';
import ServiciosClienteScreen from './src/screens/ServiciosClienteScreen';
import ReservasClienteScreen from './src/screens/ReservasClienteScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ProveedorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          
          if (route.name === 'Servicios') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Reservas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Servicios" component={ServiciosScreen} />
      <Tab.Screen name="Reservas" component={ReservasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

function ClienteTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          
          if (route.name === 'Servicios') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Reservas') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Servicios" component={ServiciosClienteScreen} />
      <Tab.Screen name="Reservas" component={ReservasClienteScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

function AppTabs() {
  const role = getRoleBasedOnToken();
  
  return role === 'ROLE_PROVEEDOR' ? <ProveedorTabs /> : <ClienteTabs />;
}

export default function AppNavigator() {
  const { session, isLoading } = useAuthContext();

  if (isLoading) {
    return null; // O un loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}