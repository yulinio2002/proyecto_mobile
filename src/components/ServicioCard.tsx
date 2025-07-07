import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ServicioResponse } from '../interfaces/servicio/ServicioResponse';

interface ServicioCardProps {
  servicio: ServicioResponse;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServicioCard({ servicio, onEdit, onDelete }: ServicioCardProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{servicio.nombre}</Text>
          <Text className="text-gray-600 mt-1" numberOfLines={2}>
            {servicio.descripcion}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${
          servicio.activo ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Text className={`text-xs font-medium ${
            servicio.activo ? 'text-green-800' : 'text-red-800'
          }`}>
            {servicio.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-3">
        <View>
          <Text className="text-2xl font-bold text-blue-600">
            S/ {servicio.precio.toFixed(2)}
          </Text>
          <Text className="text-sm text-gray-500">{servicio.categoria}</Text>
        </View>
        
        <View className="flex-row space-x-2">
          <TouchableOpacity 
            className="bg-blue-50 p-2 rounded-lg"
            onPress={onEdit}
          >
            <Ionicons name="pencil" size={20} color="#3B82F6" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-red-50 p-2 rounded-lg"
            onPress={onDelete}
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}