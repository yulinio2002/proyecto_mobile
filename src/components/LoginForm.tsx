import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';
// import { getRoleBasedOnToken } from '../utils/getRoleBasedOnToken';
import Button from './Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      
      // La navegación se maneja automáticamente por el contexto
      // pero podrías hacer algo específico aquí si necesitas
      
    } catch (error: any) {
      Alert.alert(
        'Error de autenticación', 
        error.response?.data?.message || 'Credenciales incorrectas'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="p-6">
      <Text className="text-2xl font-semibold text-gray-900 mb-8 text-center">
        Bienvenido a ServiMatch
      </Text>
      
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </Text>
          <TextInput
            className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg bg-gray-50 text-base"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </Text>
          <TextInput
            className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg bg-gray-50 text-base"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            editable={!loading}
          />
        </View>

        <View className="mt-6">
          <Button
            message={loading ? "Iniciando..." : "Iniciar Sesión"}
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
}