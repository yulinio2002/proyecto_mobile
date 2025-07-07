import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TabNavigationProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="flex-row bg-gray-50">
      {/* Pestaña Iniciar Sesión */}
      <TouchableOpacity
        className={
          `flex-1 py-5 px-6 items-center justify-center transition-all duration-300 relative ${
            activeTab === 'login'
              ? 'text-blue-500 bg-white'
              : 'text-gray-500'
          }`
        }
        onPress={() => onTabChange('login')}
      >
        <Text className={
            `font-medium text-base ${
              activeTab === 'login' ? 'text-blue-500' : 'text-gray-500'
            }`
          }
        >
          Iniciar Sesión
        </Text>
        {activeTab === 'login' && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </TouchableOpacity>

      {/* Pestaña Registrarse */}
      <TouchableOpacity
        className={
          `flex-1 py-5 px-6 items-center justify-center transition-all duration-300 relative ${
            activeTab === 'register'
              ? 'text-blue-500 bg-white'
              : 'text-gray-500'
          }`
        }
        onPress={() => onTabChange('register')}
      >
        <Text className={
            `font-medium text-base ${
              activeTab === 'register' ? 'text-blue-500' : 'text-gray-500'
            }`
          }
        >
          Registrarse
        </Text>
        {activeTab === 'register' && (
          <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </TouchableOpacity>
    </View>
  );
};