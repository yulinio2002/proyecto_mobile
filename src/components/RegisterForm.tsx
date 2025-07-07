import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthContext } from '../contexts/AuthContext';
import type { RegisterRequest } from '../interfaces/auth/RegisterRequest';

interface RegisterFormProps {
  formData: RegisterRequest & { isClient: boolean };
  setFormData: React.Dispatch<React.SetStateAction<RegisterRequest & { isClient: boolean }>>;
}

export default function RegisterForm({ formData, setFormData }: RegisterFormProps) {
  const [confirmPassword, setConfirmPassword] = useState<string>('');
// const { register } = useAuthContext();

  const handleChange = (name: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    } as any));
  };

  const handlePhotoChange = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });
    // if (!result.cancelled) {
    //   handleChange('foto', `data:image/jpeg;base64,${result.base64}`);
    // }
  };

  const handleSubmit = async () => {
    if (formData.password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
    //   await register(formData);
      // Navegación tras registro (usar navigation.navigate dentro del hook si lo deseas)
    } catch (error: any) {
      Alert.alert('Error al registrar', error.message);
    }
  };

  return (
    <View className="p-4 space-y-4">
      <Text className="text-2xl font-semibold text-gray-900">Crear una cuenta</Text>
      <View className="flex-row space-x-2">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700">Nombre</Text>
          <TextInput
            value={formData.nombre}
            onChangeText={text => handleChange('nombre', text)}
            placeholder="Tu nombre"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700">Apellidos</Text>
          <TextInput
            value={formData.apellido}
            onChangeText={text => handleChange('apellido', text)}
            placeholder="Tus apellidos"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
          />
        </View>
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700">Correo electrónico</Text>
        <TextInput
          value={formData.email}
          onChangeText={text => handleChange('email', text)}
          placeholder="ejemplo@correo.com"
          keyboardType="email-address"
          className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700">Celular</Text>
        <TextInput
          value={formData.telefono}
          onChangeText={text => handleChange('telefono', text)}
          placeholder="Tu número de celular"
          keyboardType="phone-pad"
          className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
        />
      </View>

      <TouchableOpacity onPress={handlePhotoChange} className="bg-blue-50 py-2 rounded-lg items-center">
        <Text className="text-blue-600">Seleccionar foto</Text>
      </TouchableOpacity>

      <View>
        <Text className="text-sm font-medium text-gray-700">Contraseña</Text>
        <TextInput
          value={formData.password}
          onChangeText={text => handleChange('password', text)}
          placeholder="••••••••"
          secureTextEntry
          className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
        />
      </View>

      <View>
        <Text className="text-sm font-medium text-gray-700">Confirmar contraseña</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          secureTextEntry
          className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
        />
      </View>

      {/* Roles */}
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className={`flex-1 py-2 rounded-lg items-center ${formData.isClient ? 'bg-blue-500' : 'bg-gray-200'}`}
          onPress={() => handleChange('isClient', true)}
        >
          <Text className={formData.isClient ? 'text-white' : 'text-gray-700'}>Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-lg items-center ${!formData.isClient ? 'bg-blue-500' : 'bg-gray-200'}`}
          onPress={() => handleChange('isClient', false)}
        >
          <Text className={!formData.isClient ? 'text-white' : 'text-gray-700'}>Proveedor</Text>
        </TouchableOpacity>
      </View>

      {!formData.isClient && (
        <View>
          <Text className="text-sm font-medium text-gray-700">Descripción de servicios</Text>
          <TextInput
            value={formData.descripcion || ''}
            onChangeText={text => handleChange('descripcion', text)}
            placeholder="Describe los servicios que ofreces..."
            multiline
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 h-24"
          />
        </View>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="w-full py-3 bg-blue-500 rounded-lg items-center"
      >
        <Text className="text-white font-semibold">Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}