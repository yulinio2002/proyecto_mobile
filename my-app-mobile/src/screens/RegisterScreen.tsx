import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../contexts/AuthContext';
import { RegisterRequest } from '../interfaces/auth/RegisterRequest';
import { RootStackParamList } from '../types/navigation';

export default function RegisterScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { register } = useAuthContext();
  const [formData, setFormData] = useState<RegisterRequest & { isClient: boolean }>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    descripcion: '',
    foto: '',
    isClient: true,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (name: keyof RegisterRequest | 'isClient', value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await register(formData, formData.isClient);
      navigation.replace('EditProfile');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <View className="p-10">
      <Text className="text-gray-900 mb-8 text-2xl font-semibold">Crear una cuenta</Text>
      <View className="space-y-4">
        <TextInput
          className="border px-4 py-3 rounded" placeholder="Nombre"
          value={formData.nombre}
          onChangeText={t => handleChange('nombre', t)}
        />
        <TextInput
          className="border px-4 py-3 rounded" placeholder="Apellido"
          value={formData.apellido}
          onChangeText={t => handleChange('apellido', t)}
        />
        <TextInput
          className="border px-4 py-3 rounded" placeholder="Correo electrónico"
          autoCapitalize="none"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={t => handleChange('email', t)}
        />
        <TextInput
          className="border px-4 py-3 rounded" placeholder="Celular"
          keyboardType="phone-pad"
          value={formData.telefono}
          onChangeText={t => handleChange('telefono', t)}
        />
        <TextInput
          className="border px-4 py-3 rounded" placeholder="Contraseña" secureTextEntry
          value={formData.password}
          onChangeText={t => handleChange('password', t)}
        />
        <TextInput
          className="border px-4 py-3 rounded" placeholder="Confirmar contraseña" secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <View className="flex-row space-x-4">
          <TouchableOpacity onPress={() => handleChange('isClient', true)} className="flex-row items-center">
            <View className={`w-4 h-4 mr-2 border rounded-full ${formData.isClient ? 'bg-blue-500' : ''}`} />
            <Text>Cliente</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleChange('isClient', false)} className="flex-row items-center">
            <View className={`w-4 h-4 mr-2 border rounded-full ${!formData.isClient ? 'bg-blue-500' : ''}`} />
            <Text>Proveedor</Text>
          </TouchableOpacity>
        </View>
        {!formData.isClient && (
          <TextInput
            className="border px-4 py-3 rounded" placeholder="Descripción de servicios"
            multiline
            value={formData.descripcion}
            onChangeText={t => handleChange('descripcion', t)}
          />
        )}
        <TouchableOpacity className="w-full py-3.5 bg-blue-500 rounded-lg mt-3" onPress={handleSubmit}>
          <Text className="text-white text-center font-semibold">Registrarse</Text>
        </TouchableOpacity>
        {error ? <Text className="mt-4 text-red-600">{error}</Text> : null}
      </View>
    </View>
  );
}
