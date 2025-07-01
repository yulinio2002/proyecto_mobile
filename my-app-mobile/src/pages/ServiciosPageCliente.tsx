// src/pages/ServiciosClientePage.tsx
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { Search, Calendar, Star, X } from "lucide-react";
import { Navbar } from "@components/Navbar";
import Footer from "@components/Footer";
import { ReservaRequest } from "@interfaces/reserva/ReservaRequest";
import { BuscarParams } from "@interfaces/servicio/BuscarParams";
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";
import { HorarioResponse } from "@interfaces/disponibilidades/HorarioResponse";
import { ResenaResponse } from "@interfaces/resena/ResenaResponse";
import {
  obtenerServiciosActivos,
  buscarServicios,
} from "@services/servicio/servicioService";
import {
  obtenerHorariosPorServicio,
} from "@services/disponibilidad/horarioService";
import { obtenerResenasPorServicio } from "@services/resena/resenaService";
import { crearReserva } from "@services/reserva/reservaService";
import { format } from "date-fns";
import { ReservationForm } from "@components/ReservationForm";
import { useAuthContext } from "@contexts/AuthContext";
import {AuthMeDto} from "@interfaces/auth/AuthMeDto.ts";
import {getMeInfo} from "@services/auth/me.ts";

const ServiciosClientePage: React.FC = () => {
  const { userId } = useAuthContext();        // <-- extrae aquí el clienteId
  const [servicios, setServicios] = useState<ServicioResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [filters, setFilters] = useState<BuscarParams>({
    categoria: "",
    direccion: "",
    precioMin: "",
    precioMax: "",
    calificacionMin: "",
    page: 0,
    size: 10,
  });

  // cache de horarios y reseñas
  const [horariosMap, setHorariosMap] = useState<Record<number, HorarioResponse[]>>({});
  const [resenasMap, setResenasMap] = useState<Record<number, ResenaResponse[]>>({});

  // modales
  const [viewingResenasId, setViewingResenasId] = useState<number | null>(null);
  const [reservingServiceId, setReservingServiceId] = useState<number | null>(null);

  const [user, setUser] = useState<AuthMeDto>();

  // 1) carga inicial
  useEffect(() => {
    cargarActivos();
  }, []);

  // 2) al cambiar servicios carga horarios
  useEffect(() => {
    if (!servicios.length) return;
    (async () => {
      const m: Record<number, HorarioResponse[]> = {};
      await Promise.all(
        servicios.map(async (s) => {
          try {
            m[s.id] = await obtenerHorariosPorServicio(s.id);
          } catch {
            m[s.id] = [];
          }
        })
      );
      setHorariosMap(m);
    })();
  }, [servicios]);

  // 3) al abrir reseñas, carga si no está
  useEffect(() => {
    if (viewingResenasId == null || resenasMap[viewingResenasId]) return;
    (async () => {
      try {
        const data = await obtenerResenasPorServicio(viewingResenasId);
        setResenasMap(m => ({ ...m, [viewingResenasId]: data }));
      } catch {
        setResenasMap(m => ({ ...m, [viewingResenasId]: [] }));
      }
    })();
  }, [viewingResenasId]);

  async function cargarActivos() {
    const userget = await getMeInfo();
    setUser(userget);
    setLoading(true);
    try {
      const data = await obtenerServiciosActivos();
      setServicios(data);
    } catch {
      console.error("Error al cargar servicios activos");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(f => ({
      ...f,
      [name]: ["precioMin","precioMax","calificacionMin","page","size"].includes(name)
        ? Number(value)
        : value,
    }));
  };
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await buscarServicios(filters);
      setServicios(results);
    } catch {
      console.error("Error al buscar servicios");
    } finally {
      setLoading(false);
    }
  };

  // reservas
  const handleReserveClick = (id: number) => setReservingServiceId(id);
  const handleReserveSubmit = async (req: ReservaRequest) => {
    if (!userId) {
      alert("Necesitas iniciar sesión para reservar");
      return;
    }
    try {
      await crearReserva(userId, req);      // <-- usa directamente userId
      alert("Reserva creada exitosamente");
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la reserva");
    } finally {
      setReservingServiceId(null);
    }
  };

  const closeResenas = () => setViewingResenasId(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar avatarUrl="#" userName={user == null? "User": user.nombre} badgeLabel = "Cliente"/>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Servicios Disponibles</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            name="categoria"
            placeholder="Categoría"
            value={filters.categoria}
            onChange={handleChange}
            className="px-3 py-2 border rounded"
          />
          <div className="flex space-x-2">
            <input
              name="precioMin"
              type="number"
              placeholder="Precio Min"
              value={filters.precioMin}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded"
            />
            <input
              name="precioMax"
              type="number"
              placeholder="Precio Max"
              value={filters.precioMax}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded"
            />
          </div>
          <div className="flex space-x-2">
            <input
              name="calificacionMin"
              type="number"
              placeholder="Calif. Min"
              value={filters.calificacionMin}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-1/2 flex items-center justify-center bg-indigo-600 px-4 py-2 text-white rounded hover:bg-indigo-700"
            >
              <Search className="w-5 h-5 mr-1" /> Buscar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-500">Cargando servicios...</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Descripción</th>
                  <th className="px-6 py-3">Precio</th>
                  <th className="px-6 py-3">Categoría</th>
                  <th className="px-6 py-3">Horarios</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron servicios
                    </td>
                  </tr>
                ) : (
                  servicios.map(s => (
                    <tr key={s.id} className="border-t">
                      <td className="px-6 py-4">{s.nombre}</td>
                      <td className="px-6 py-4">{s.descripcion}</td>
                      <td className="px-6 py-4">S/ {s.precio.toFixed(2)}</td>
                      <td className="px-6 py-4">{s.categoria}</td>
                      <td className="px-6 py-4 space-y-1">
                        {(horariosMap[s.id] || []).length > 0 ? (
                          horariosMap[s.id].map(h => (
                            <div key={h.id} className="text-sm">
                              {h.diaSemana} {h.horaInicio}-{h.horaFin}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-400">Sin horarios</div>
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleReserveClick(s.id)}
                          className="inline-flex items-center hover:text-indigo-600"
                          title="Reservar"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setViewingResenasId(s.id)}
                          className="inline-flex items-center hover:text-yellow-500"
                          title="Ver reseñas"
                        >
                          <Star className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario de reserva */}
      {reservingServiceId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <ReservationForm
              servicioId={reservingServiceId}
              onCancel={() => setReservingServiceId(null)}
              onSubmit={handleReserveSubmit}
            />
          </div>
        </div>
      )}

      {/* Panel de reseñas */}
      {viewingResenasId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
            <button
              onClick={closeResenas}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Reseñas</h2>
            {resenasMap[viewingResenasId] == null ? (
              <p className="text-gray-500">Cargando reseñas...</p>
            ) : resenasMap[viewingResenasId].length === 0 ? (
              <p className="text-gray-600">Aún no hay reseñas.</p>
            ) : (
              <ul className="space-y-4 max-h-64 overflow-y-auto">
                {resenasMap[viewingResenasId].map(r => (
                  <li key={r.id} className="border-b pb-3">
                    <div className="flex items-center mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 mr-1 ${
                            i < r.calificacion ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {format(new Date(r.fecha), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <p className="text-gray-800">{r.comentario}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ServiciosClientePage;
