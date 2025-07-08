import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getMeInfo } from '../services/auth/me';
import { getRoleBasedOnToken } from '../utils/getRoleBasedOnToken';
import { AuthMeDto } from '../interfaces/auth/AuthMeDto';

interface ProfileProps {
  setUserId: (id: number | null) => void;
}

export default function Profile({ setUserId }: ProfileProps) {
  const [profileInfo, setProfileInfo] = useState<AuthMeDto | null>(null);
  const [isProveedor, setIsProveedor] = useState(false);

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  async function fetchProfileInfo() {
    try {
      const role = await getRoleBasedOnToken();
      const userData = await getMeInfo();
      if (role === 'ROLE_PROVEEDOR') {
        setIsProveedor(true);
        setUserId(userData.id);
      } else if (role === 'ROLE_CLIENTE') {
        setIsProveedor(false);
        setUserId(userData.id);
      }
      setProfileInfo(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  if (!profileInfo) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="space-y-3">
      <Text className="text-2xl font-bold">
        {isProveedor ? 'Proveedor de Servicios' : 'Cliente'}
      </Text>
      <View className="flex-row items-center">
        <Ionicons name="person-circle" size={72} color="gray" />
        <View className="ml-4 space-y-1">
          <Text className="text-lg font-semibold">{profileInfo.nombre}</Text>
          <Text className="text-gray-600">Email: {profileInfo.email}</Text>
          <Text className="text-gray-600">Teléfono: {profileInfo.telefono}</Text>
          {isProveedor && profileInfo.descripcion ? (
            <Text className="text-gray-600">Descripción: {profileInfo.descripcion}</Text>
          ) : null}
          <Text className="text-gray-600">Rol: {isProveedor ? 'Proveedor' : 'Cliente'}</Text>
        </View>
      </View>
    </View>
  );
}
