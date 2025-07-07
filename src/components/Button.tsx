// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  message: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ 
  message, 
  onPress, 
  disabled = false, 
  loading = false,
  variant = 'primary' 
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`px-6 py-3 rounded-lg items-center justify-center ${
        variant === 'primary' ? 'bg-blue-500' : 'bg-gray-300'
      } ${disabled || loading ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`font-medium ${
          variant === 'primary' ? 'text-white' : 'text-gray-700'
        }`}>
          {message}
        </Text>
      )}
    </TouchableOpacity>
  );
}