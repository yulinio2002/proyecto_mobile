import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthPage from '@pages/AuthPage';
import ServiciosPage from '@pages/ServiciosPage';
import ReservasPage from '@pages/ReservasPage';
import ServiciosPageCliente from '@pages/ServiciosPageCliente';
import ReservasPageCliente from '@pages/ReservasPageCliente';
import EditProfilePage from '@pages/EditProfilePage';
import NotFoundPage from '@pages/NotFoundPage';

export type RootStackParamList = {
  Auth: undefined;
  Servicios: undefined;
  Reservas: undefined;
  ServiciosCliente: undefined;
  ReservasCliente: undefined;
  EditProfile: undefined;
  NotFound: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthPage} />
        <Stack.Screen name="Servicios" component={ServiciosPage} />
        <Stack.Screen name="Reservas" component={ReservasPage} />
        <Stack.Screen name="ServiciosCliente" component={ServiciosPageCliente} />
        <Stack.Screen name="ReservasCliente" component={ReservasPageCliente} />
        <Stack.Screen name="EditProfile" component={EditProfilePage} />
        <Stack.Screen name="NotFound" component={NotFoundPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
