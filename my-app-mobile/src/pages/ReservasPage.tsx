// src/pages/ReservasPage.tsx
import React, { useState, useEffect } from 'react';
import { Navbar } from "@components/Navbar";
import Footer from "@components/Footer";
import Button from "@components/Button";
import { useAuthContext } from "@contexts/AuthContext";
import { ReservaResponse } from "@interfaces/reserva/RerservaResponse";
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";
import { ClienteResponse } from "@interfaces/cliente/ClienteResponse";
import {
  obtenerReservasProveedor,
  aceptarReserva,
  completarReserva
} from "@services/reserva/reservaService";
import { obtenerServiciosProveedor } from "@services/servicio/servicioService";
import { obtenerCliente } from "@services/cliente/ClienteService";
import { format } from "date-fns";

const ReservasPage: React.FC = () => {
  const { userId } = useAuthContext();
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [serviciosMap, setServiciosMap] = useState<Record<number, ServicioResponse>>({});
  const [clientesMap, setClientesMap]   = useState<Record<number, ClienteResponse>>({});
  const [loading, setLoading]           = useState(true);
  const [actingId, setActingId]         = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      try {
        // 1) Cargar reservas
        const reservasData = await obtenerReservasProveedor(userId);
        setReservas(reservasData);

        // 2) Cargar todos los servicios del proveedor
        const serviciosData = await obtenerServiciosProveedor(userId);
        const servMap: Record<number, ServicioResponse> = {};
        serviciosData.forEach(s => { servMap[s.id] = s });
        setServiciosMap(servMap);

        // 3) Cargar datos de cliente para cada clienteId único
        const clienteIds = Array.from(new Set(reservasData.map(r => r.clienteId)));
        const clientesArr = await Promise.all(
          clienteIds.map(id => obtenerCliente(id))
        );
        const cliMap: Record<number, ClienteResponse> = {};
        clientesArr.forEach(c => { cliMap[c.id] = c });
        setClientesMap(cliMap);

      } catch (err) {
        console.error("Error cargando datos de reservas:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleAccept = async (id: number) => {
    setActingId(id);
    try {
      await aceptarReserva(id);
      const updated = await obtenerReservasProveedor(userId!);
      setReservas(updated);
    } catch {
      alert("No se pudo aceptar la reserva");
    } finally {
      setActingId(null);
    }
  };

  const handleComplete = async (id: number) => {
    setActingId(id);
    try {
      await completarReserva(id);
      const updated = await obtenerReservasProveedor(userId!);
      setReservas(updated);
    } catch {
      alert("No se pudo completar la reserva");
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar avatarUrl="#" userName="Usuario" />

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-sm font-medium text-gray-700">Cliente</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-700">Servicio</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-700">Dirección</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-700">Precio</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-700">Estado</th>
                <th className="px-6 py-3 text-sm font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No hay reservas
                  </td>
                </tr>
              ) : (
                reservas.map((r) => {
                  const cliente  = clientesMap[r.clienteId];
                  const servicio = serviciosMap[r.servicioId];
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-6 py-4 text-gray-800">
                        {cliente?.nombre ?? `ID ${r.clienteId}`}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {servicio?.nombre ?? `ID ${r.servicioId}`}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {r.direccion || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {format(new Date(r.fechaReserva), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        ${servicio?.precio.toFixed(2) ?? '0.00'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            r.estado === 'PENDIENTE'
                              ? 'bg-yellow-100 text-yellow-800'
                              : r.estado === 'ACEPTADA'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {r.estado === 'PENDIENTE' && (
                          <Button
                            message="Aceptar"
                            onClick={() => handleAccept(r.id)}
                            disabled={actingId === r.id}
                          />
                        )}
                        {r.estado === 'ACEPTADA' && (
                          <Button
                            message="Completar"
                            onClick={() => handleComplete(r.id)}
                            disabled={actingId === r.id}
                          />
                        )}
                        {r.estado === 'COMPLETADA' && (
                          <span className="text-gray-500">Finalizada</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReservasPage;
