import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '@contexts/AuthContext';
import { LoginRequest } from '@interfaces/auth/LoginRequest';
import { getRoleBasedOnToken } from '../../utils/getRoleBasedOnToken';

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const navigation = useNavigation();
  const { login, session } = useAuthContext();

  const handleChange = (name: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await login(formData);
      const role = getRoleBasedOnToken(session ?? null);
      if (role === 'ROLE_PROVEEDOR') {
        navigation.navigate('Home' as never);
      } else if (role === 'ROLE_CLIENTE') {
        navigation.navigate('Home' as never);
      } else {
        navigation.navigate('Home' as never);
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <View className="p-5">
      <Text className="text-2xl font-semibold text-gray-900 mb-8">Bienvenido a ServiMatch</Text>
      <View className="space-y-5">
        <View>
          <Text className="mb-2 text-gray-700 text-sm font-medium">Correo electrónico</Text>
          <TextInput
            className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text className="mb-2 text-gray-700 text-sm font-medium">Contraseña</Text>
          <TextInput
            className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
            value={formData.password}
            onChangeText={text => handleChange('password', text)}
            secureTextEntry
          />
        </View>
        <Pressable onPress={handleSubmit} className="w-full py-3.5 bg-blue-500 rounded-lg mt-3 items-center">
          <Text className="text-white font-semibold">Iniciar Sesión</Text>
        </Pressable>
        {error ? (
          <Text className="text-red-500 mt-4">{error}</Text>
        ) : null}
      </View>
    </View>
  );
}
