import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMeInfo } from '../services/auth/me';
import { eliminarProveedor, updateProveedor } from '../services/proveedor/proveedor';
import { eliminarCliente, updateCliente } from '../services/cliente/cliente';
import { useAuthContext } from '../contexts/AuthContext';
import { getRoleBasedOnToken } from '../utils/getRoleBasedOnToken';
import Profile from '../components/Profile';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    descripcion: '',
  });
  const { logout } = useAuthContext();

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const user = await getMeInfo();
      setUserId(user.id);
      const currentRole = await getRoleBasedOnToken();
      setRole(currentRole);
      if (currentRole === 'ROLE_CLIENTE') {
        const partes = (user.nombre || '').trim().split(' ');
        setFormData({
          nombre: partes[0] || '',
          apellido: partes.slice(1).join(' ') || '',
          telefono: user.telefono,
          descripcion: '',
        });
      } else {
        setFormData({
          nombre: user.nombre,
          apellido: '',
          descripcion: user.descripcion || '',
          telefono: user.telefono,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function fetchDeleteUser() {
    if (!userId) return;
    try {
      const currentRole = role ?? (await getRoleBasedOnToken());
      if (currentRole === 'ROLE_PROVEEDOR') {
        await eliminarProveedor(userId);
      } else if (currentRole === 'ROLE_CLIENTE') {
        await eliminarCliente(userId);
      }
      logout();
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async function fetchUpdateUser() {
    if (!userId) return;
    try {
      const currentRole = role ?? (await getRoleBasedOnToken());
      if (currentRole === 'ROLE_PROVEEDOR') {
        await updateProveedor(userId, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          telefono: formData.telefono,
        });
      } else if (currentRole === 'ROLE_CLIENTE') {
        await updateCliente(userId, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          foto: '',
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  const handleSubmit = async () => {
    await fetchUpdateUser();
    navigation.goBack();
  };

  return (
    <ScrollView className="p-6 space-y-6">
      <Text className="text-3xl font-bold mb-4">Editar Perfil</Text>
      <View className="space-y-4">
        <TextInput
          className="border px-4 py-3 rounded"
          placeholder="Nombre"
          value={formData.nombre}
          onChangeText={t => handleChange('nombre', t)}
        />
        {role === 'ROLE_CLIENTE' && (
          <TextInput
            className="border px-4 py-3 rounded"
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={t => handleChange('apellido', t)}
          />
        )}
        {role === 'ROLE_PROVEEDOR' && (
          <TextInput
            className="border px-4 py-3 rounded"
            placeholder="Descripción"
            multiline
            value={formData.descripcion}
            onChangeText={t => handleChange('descripcion', t)}
          />
        )}
        <TextInput
          className="border px-4 py-3 rounded"
          placeholder="Teléfono"
          keyboardType="phone-pad"
          value={formData.telefono}
          onChangeText={t => handleChange('telefono', t)}
        />
        <TouchableOpacity className="bg-indigo-600 py-3 rounded" onPress={handleSubmit}>
          <Text className="text-center text-white font-bold">Actualizar</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-6">
        <Profile setUserId={setUserId} />
      </View>
      <TouchableOpacity className="bg-red-500 py-3 rounded" onPress={fetchDeleteUser}>
        <Text className="text-center text-white font-bold">Eliminar cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
