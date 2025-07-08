import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '../contexts/AuthContext';
import { obtenerServiciosProveedor, eliminarServicio } from '../services/servicio/servicioService';
import { ServicioResponse } from '../interfaces/servicio/ServicioResponse';
import ServicioCard from '../components/ServicioCard';
import Button from '../components/Button';

export default function ServiciosScreen({ navigation }: any) {
  const { userId } = useAuthContext();
  const [servicios, setServicios] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServicios();
  }, [userId]);

  const fetchServicios = async () => {
    try {
      if (userId) {
        const data = await obtenerServiciosProveedor(userId);
        setServicios(data);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudieron cargar los servicios');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este servicio?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarServicio(id);
              setServicios(prev => prev.filter(s => s.id !== id));
              Alert.alert('Éxito', 'Servicio eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el servicio');
            }
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchServicios();
  };

  const renderServicio = ({ item }: { item: ServicioResponse }) => (
    <ServicioCard 
      servicio={item} 
      onEdit={() => navigation.navigate('EditServicio', { servicio: item })}
      onDelete={() => handleDelete(item.id)}
    />
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200 pt-12">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-900">Mis Servicios</Text>
          <TouchableOpacity 
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => navigation.navigate('CreateServicio')}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-medium ml-1">Nuevo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de servicios */}
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderServicio}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="briefcase-outline" size={80} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">No tienes servicios</Text>
            <Text className="text-gray-400 text-sm mt-2">Crea tu primer servicio</Text>
          </View>
        }
      />
    </View>
  );
}