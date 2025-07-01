// src/pages/ServiciosPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ServiciosTable from "@components/servicios/ServiciosTable";
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";
import { ServicioRequest } from "@interfaces/servicio/ServicioRequest";
import { useAuthContext } from "@contexts/AuthContext";
import { Navbar } from "@components/Navbar";
import {
  obtenerServiciosProveedor,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  cambiarEstadoServicio
} from "@services/servicio/servicioService";

import { obtenerResenasPorServicio } from "@services/resena/resenaService";
import Footer from '@components/Footer';
import { ServiceForm } from '@components/ServiceForm';
import { crearHorarioDeServicio } from '@services/disponibilidad/horarioService';
import { HorarioRequest } from '@interfaces/disponibilidades/HorarioRequest';
import { ServiceScheduleForm } from '@components/HorarioForm';
import { ServiceReviews } from '@components/ServiceReviews';
import {getMeInfo} from "@services/auth/me.ts";
import {AuthMeDto} from "@interfaces/auth/AuthMeDto.ts";

const ServiciosPage: React.FC = () => {
  const { userId } = useAuthContext();
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthMeDto>();
  // Create form state
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  // Update form state
  const [editingServicio, setEditingServicio] = useState<ServicioResponse | null>(null);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  // Schedule form state
  const [scheduleServicioId, setScheduleServicioId] = useState<number | null>(null);
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  //Resenas
  const [viewingReviewsId, setViewingReviewsId] = useState<number | null>(null);

  useEffect(() => {
    fetchServicios();
  }, [userId]);

  const fetchServicios = async () => {
    const userget = await getMeInfo();
    setUser(userget);
    try {
      if (userId) {
        const data = await obtenerServiciosProveedor(userId);
        setServicios(data);
      }
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create handlers
  const handleNewService = () => setIsCreating(true);
  const handleCreateSubmit = async (data: ServicioRequest) => {
    setIsLoadingCreate(true);
    try {
      await crearServicio(userId!, data);
      await fetchServicios();
      setIsCreating(false);
    } catch (error) {
      console.error("Error al crear servicio:", error);
      alert("No se pudo crear el servicio");
    } finally {
      setIsLoadingCreate(false);
    }
  };

  // Update handlers
  const handleEdit = (id: number) => {
    const servicio = servicios.find(s => s.id === id) ?? null;
    setEditingServicio(servicio);
  };
  const handleUpdateSubmit = async (data: ServicioRequest) => {
    if (!editingServicio) return;
    setIsLoadingUpdate(true);
    try {
      await actualizarServicio(editingServicio.id, data);
      await fetchServicios();
      setEditingServicio(null);
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      alert("No se pudo actualizar el servicio");
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  // Delete & toggle
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar este servicio?")) return;
    try {
      await eliminarServicio(id);
      setServicios(s => s.filter(x => x.id !== id));
      alert("Servicio eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      alert("Error al eliminar el servicio");
    }
  };
  const handleToggleStatus = async (id: number, activo: boolean) => {
    try {
      const updated = await cambiarEstadoServicio(id, !activo);
      setServicios(s => s.map(x => x.id === id ? updated : x));
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del servicio");
    }
  };

  // // Reviews
  // const handleViewReviews = async (id: number) => {
  //   try {
  //     const resenas = await obtenerResenasPorServicio(id);
  //     console.log("Reseñas:", resenas);
  //   } catch (error) {
  //     console.error("Error al obtener reseñas:", error);
  //   }
  // };
  const handleViewReviews = (id: number) => {
  setViewingReviewsId(id);
  };

  // Schedule
  const handleViewSchedule = (id: number) => {
    setScheduleServicioId(id);
  };
  const handleScheduleSubmit = async (horarios: HorarioRequest[]) => {
  if (scheduleServicioId === null) return;
  setIsSubmittingSchedule(true);
  try {

    await crearHorarioDeServicio(scheduleServicioId, horarios);
    alert("Horarios guardados correctamente.");
    setScheduleServicioId(null);
  } catch (error) {
    console.error("Error al guardar horarios:", error);
    alert("No se pudieron guardar los horarios");
  } finally {
    setIsSubmittingSchedule(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando servicios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Navbar avatarUrl="#" userName={user == null? "User": user.nombre} badgeLabel = "Proveedor"/>
      <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Servicios</h1>
        <button
          onClick={handleNewService}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Servicio
        </button>
        </div>
      </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Create Form */}
      {isCreating && (
        <ServiceForm
        mode="create"
        isLoading={isLoadingCreate}
        onCancel={() => setIsCreating(false)}
        onSubmit={handleCreateSubmit}
        />
      )}

      {/* Update Form */}
      {editingServicio && (
        <ServiceForm
        mode="update"
        initialData={{
          nombre: editingServicio.nombre,
          descripcion: editingServicio.descripcion,
          precio: editingServicio.precio,
          categoria: editingServicio.categoria,
        }}
        isLoading={isLoadingUpdate}
        onCancel={() => setEditingServicio(null)}
        onSubmit={handleUpdateSubmit}
        />
      )}

      {/* Schedule Form */}
      {scheduleServicioId !== null && (
        <ServiceScheduleForm
        servicioId={scheduleServicioId}
        isLoading={isSubmittingSchedule}
        onCancel={() => setScheduleServicioId(null)}
        onSubmit={handleScheduleSubmit}
        />
      )}

      {/* Reviews */}
      {viewingReviewsId !== null && (
       <div className="mb-8">
         <ServiceReviews
           servicioId={viewingReviewsId}
           onClose={() => setViewingReviewsId(null)}
         />
       </div>
     )}

      {/* Services Table */}
      <ServiciosTable
        servicios={servicios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewSchedule={handleViewSchedule}
        onViewReviews={handleViewReviews}
        onToggleStatus={handleToggleStatus}
      />
      </div>

      {/* Footer */}
      <Footer />
    </div>
    
  );
};

export default ServiciosPage;
