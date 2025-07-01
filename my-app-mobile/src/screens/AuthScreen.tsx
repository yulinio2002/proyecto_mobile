import { useState } from 'react';
import { View } from 'react-native';
import { TabNavigation } from '@components/TabNavigation';
import LoginForm from '@components/auth/LoginForm';
import RegisterForm from '@components/auth/RegisterForm';
import { RegisterRequest } from '@interfaces/auth/RegisterRequest';

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState<RegisterRequest & { isClient: boolean }>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    descripcion: '',
    isClient: true,
  });

  return (
    <View className="flex-1 items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <View className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'login' ? (
          <LoginForm />
        ) : (
          <RegisterForm formData={formData} setFormData={setFormData} />
        )}
      </View>
    </View>
  );
}
