import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';
import { getRoleBasedOnToken } from '../utils/getRoleBasedOnToken';
import { LoginRequest } from '../interfaces/auth/LoginRequest';
import { RootStackParamList } from '../types/navigation';

export default function LoginScreen() {
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { login } = useAuthContext();

  const handleChange = (name: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await login(formData);
      const role = await getRoleBasedOnToken();
      if (role) {
        navigation.replace('EditProfile');
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <View className="p-10">
      <Text className="text-gray-900 mb-8 text-2xl font-semibold">Bienvenido a ServiMatch</Text>

      <View className="space-y-5">
        <View>
          <Text className="mb-2 text-gray-700 font-medium text-sm">Correo electrónico</Text>
          <TextInput
            className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-gray-50"
            autoCapitalize="none"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
          />
        </View>

        <View>
          <Text className="mb-2 text-gray-700 font-medium text-sm">Contraseña</Text>
          <TextInput
            className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-base bg-gray-50"
            secureTextEntry
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
          />
        </View>

        <TouchableOpacity
          className="w-full py-3.5 bg-blue-500 rounded-lg mt-3"
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold">Iniciar Sesión</Text>
        </TouchableOpacity>

        {error ? <Text className="mt-4 text-red-600">{error}</Text> : null}
      </View>
    </View>
  );
}
