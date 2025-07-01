// src/components/ReservationForm.tsx
import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Button from "./Button";
import { obtenerHorariosPorServicio } from "@services/disponibilidad/horarioService";
import { ReservaRequest } from "@interfaces/reserva/ReservaRequest";
import { HorarioResponse } from "@interfaces/disponibilidades/HorarioResponse";

interface ReservationFormProps {
  servicioId: number;
  onSubmit: (reserva: ReservaRequest) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  servicioId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [horarios, setHorarios] = useState<HorarioResponse[]>([]);
  const [loadingHorarios, setLoadingHorarios] = useState(true);
  const [selectedHorarioId, setSelectedHorarioId] = useState<number | "">("");
  const [fecha, setFecha] = useState<string>(""); // formato YYYY-MM-DD
  const [direccion, setDireccion] = useState<string>("");
  const [errors, setErrors] = useState<{
    fecha?: string;
    horario?: string;
    direccion?: string;
  }>({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await obtenerHorariosPorServicio(servicioId);
        setHorarios(data);
      } catch (err) {
        console.error("No se pudieron cargar horarios", err);
      } finally {
        setLoadingHorarios(false);
      }
    };
    load();
  }, [servicioId]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!fecha) errs.fecha = "La fecha es requerida";
    if (!selectedHorarioId) errs.horario = "Seleccione un horario";
    if (!direccion.trim()) errs.direccion = "La dirección es requerida";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const horario = horarios.find(h => h.id === selectedHorarioId)!;
    const fechaReserva = `${fecha}T${horario.horaInicio}`;
    onSubmit({
      servicioId,
      fechaReserva,
      direccion: direccion.trim(),
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-green-100">
          <Plus className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Reservar Servicio</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fecha */}
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Reserva *
          </label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.fecha ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fecha && <p className="mt-1 text-sm text-red-600">{errors.fecha}</p>}
        </div>

        {/* Horario */}
        <div>
          <label htmlFor="horario" className="block text-sm font-medium text-gray-700 mb-1">
            Horario *
          </label>
          {loadingHorarios ? (
            <p className="text-gray-500">Cargando horarios...</p>
          ) : (
            <select
              id="horario"
              value={selectedHorarioId}
              onChange={e => setSelectedHorarioId(Number(e.target.value))}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.horario ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccione un horario</option>
              {horarios.map(h => (
                <option key={h.id} value={h.id}>
                  {h.diaSemana} {h.horaInicio} - {h.horaFin}
                </option>
              ))}
            </select>
          )}
          {errors.horario && <p className="mt-1 text-sm text-red-600">{errors.horario}</p>}
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección *
          </label>
          <input
            id="direccion"
            type="text"
            value={direccion}
            onChange={e => setDireccion(e.target.value)}
            disabled={isLoading}
            placeholder="Ingresa la dirección de la reserva"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.direccion ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button
              message="Cancelar"
              onClick={onCancel}
              disabled={isLoading}
            />
          )}
          <Button
            message={isLoading ? "Reservando..." : "Confirmar Reserva"}
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};
