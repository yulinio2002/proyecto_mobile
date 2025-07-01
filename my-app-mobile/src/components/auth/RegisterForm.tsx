import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '@contexts/AuthContext';
import { RegisterRequest } from '@interfaces/auth/RegisterRequest';

interface RegisterFormProps {
  formData: RegisterRequest & { isClient: boolean };
  setFormData: React.Dispatch<React.SetStateAction<RegisterRequest & { isClient: boolean }>>;
}

export default function RegisterForm({ formData, setFormData }: RegisterFormProps) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuthContext();
  const navigation = useNavigation();

  const handleChange = (name: keyof RegisterRequest | 'isClient', value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value } as any));
  };

  const handleSubmit = async () => {
    if (formData.password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await register(formData, formData.isClient);
      navigation.navigate('Home' as never);
    } catch (error: any) {
      console.error('Error al registrar:', error);
      alert(error.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <ScrollView className="p-5" keyboardShouldPersistTaps="handled">
      <Text className="text-gray-900 mb-8 text-2xl font-semibold">Crear una cuenta</Text>
      <View className="space-y-5">
        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className="mb-2 text-gray-700 text-sm font-medium">Nombre</Text>
            <TextInput
              className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
              value={formData.nombre}
              onChangeText={text => handleChange('nombre', text)}
            />
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-gray-700 text-sm font-medium">Apellidos</Text>
            <TextInput
              className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
              value={formData.apellido || ''}
              onChangeText={text => handleChange('apellido', text)}
            />
          </View>
        </View>
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
          <Text className="mb-2 text-gray-700 text-sm font-medium">Celular</Text>
          <TextInput
            className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
            value={formData.telefono}
            onChangeText={text => handleChange('telefono', text)}
            keyboardType="phone-pad"
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
        <View>
          <Text className="mb-2 text-gray-700 text-sm font-medium">Confirmar contraseña</Text>
          <TextInput
            className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <View>
          <Text className="text-sm font-medium mb-2">Tipo de usuario</Text>
          <View className="flex-row space-x-4">
            <Pressable onPress={() => handleChange('isClient', true)} className="flex-row items-center">
              <View className={`w-4 h-4 mr-2 rounded-full border ${formData.isClient ? 'bg-blue-500' : 'border-gray-400'}`} />
              <Text>Cliente</Text>
            </Pressable>
            <Pressable onPress={() => handleChange('isClient', false)} className="flex-row items-center">
              <View className={`w-4 h-4 mr-2 rounded-full border ${!formData.isClient ? 'bg-blue-500' : 'border-gray-400'}`} />
              <Text>Proveedor</Text>
            </Pressable>
          </View>
        </View>
        {!formData.isClient && (
          <View>
            <Text className="mb-2 text-gray-700 text-sm font-medium">Descripción de servicios</Text>
            <TextInput
              multiline
              className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50"
              value={formData.descripcion || ''}
              onChangeText={text => handleChange('descripcion', text)}
            />
          </View>
        )}
        <Pressable onPress={handleSubmit} className="w-full py-3.5 bg-blue-500 rounded-lg mt-3 items-center">
          <Text className="text-white font-semibold">Registrarse</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
