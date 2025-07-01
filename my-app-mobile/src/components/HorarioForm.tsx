
import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import Button from "./Button";
import {
  obtenerHorariosPorServicio,
} from "@services/disponibilidad/horarioService";
import { HorarioRequest } from "@interfaces/disponibilidades/HorarioRequest";
import { HorarioResponse } from "@interfaces/disponibilidades/HorarioResponse";

interface ServiceScheduleFormProps {
  servicioId: number;
  onSubmit: (horarios: HorarioRequest[]) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const DIAS_SEMANA: { value: HorarioRequest["diaSemana"]; label: string }[] = [
  { value: "LUNES",    label: "Lunes" },
  { value: "MARTES",   label: "Martes" },
  { value: "MIERCOLES",label: "Miércoles" },
  { value: "JUEVES",   label: "Jueves" },
  { value: "VIERNES",  label: "Viernes" },
  { value: "SABADO",   label: "Sábado" },
  { value: "DOMINGO",  label: "Domingo" },
];

export const ServiceScheduleForm: React.FC<ServiceScheduleFormProps> = ({
  servicioId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  // Nuevos horarios que el usuario va agregando
  const [nuevos, setNuevos] = useState<HorarioRequest[]>([]);

  // Horarios existentes (se van a reemplazar)
  const [existentes, setExistentes] = useState<HorarioResponse[]>([]);
  const [loadingExistentes, setLoadingExistentes] = useState(true);

  useEffect(() => {
    // Carga los horarios actuales del servicio
    const load = async () => {
      try {
        const data = await obtenerHorariosPorServicio(servicioId);
        setExistentes(data);
      } catch (err) {
        console.error("No se pudieron cargar horarios existentes", err);
      } finally {
        setLoadingExistentes(false);
      }
    };
    load();
  }, [servicioId]);

  const addRow = () => {
    setNuevos([
      ...nuevos,
      { diaSemana: "", horaInicio: "", horaFin: "" },
    ]);
  };

  const removeRow = (idx: number) => {
    setNuevos(nuevos.filter((_, i) => i !== idx));
  };

  const handleChange = (
    idx: number,
    field: keyof HorarioRequest,
    value: string
  ) => {
    const copia = [...nuevos];
    copia[idx] = { ...copia[idx], [field]: value };
    setNuevos(copia);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nuevos);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-yellow-100">
          <Plus className="w-6 h-6 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Configura tus Horarios
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {nuevos.map((horario, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded"
          >
            {/* Día de la semana */}
            <div>
              <label
                htmlFor={`dia-${idx}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Día
              </label>
              <select
                id={`dia-${idx}`}
                value={horario.diaSemana}
                onChange={(e) =>
                  handleChange(idx, "diaSemana", e.target.value)
                }
                disabled={isLoading}
                className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Selecciona día</option>
                {DIAS_SEMANA.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hora Inicio */}
            <div>
              <label
                htmlFor={`inicio-${idx}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Desde
              </label>
              <input
                id={`inicio-${idx}`}
                type="time"
                step="1"
                value={horario.horaInicio}
                onChange={(e) =>
                  handleChange(idx, "horaInicio", e.target.value)
                }
                disabled={isLoading}
                className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Hora Fin */}
            <div>
              <label
                htmlFor={`fin-${idx}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hasta
              </label>
              <input
                id={`fin-${idx}`}
                type="time"
                step="1"
                value={horario.horaFin}
                onChange={(e) =>
                  handleChange(idx, "horaFin", e.target.value)
                }
                disabled={isLoading}
                className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="button"
              onClick={() => removeRow(idx)}
              disabled={isLoading}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}

        <div className="flex space-x-4">
          <Button
            message="Agregar Horario"
            onClick={addRow}
            disabled={isLoading}
          />
          <Button
            message={isLoading ? "Guardando..." : "Guardar Horarios"}
            type="submit"
            disabled={isLoading || nuevos.length === 0}
          />
          {onCancel && (
            <Button
              message="Cancelar"
              onClick={onCancel}
              disabled={isLoading}
            />
          )}
        </div>
      </form>

      {/* Mostrar existentes si los hay */}
      {!loadingExistentes && existentes.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="text-yellow-700 font-semibold">
            Tus horarios serán reemplazados:
          </p>
          <ul className="mt-2 list-disc list-inside text-gray-700">
            {existentes.map((h) => (
              <li key={h.id}>
                {h.diaSemana}: {h.horaInicio} - {h.horaFin}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
)
}
