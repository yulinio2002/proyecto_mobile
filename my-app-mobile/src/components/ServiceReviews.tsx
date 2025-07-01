// src/components/ServiceReviews.tsx
import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import Button from "./Button";
import { obtenerResenasPorServicio } from "@services/resena/resenaService";
import { ResenaResponse } from "@interfaces/resena/ResenaResponse";

interface ServiceReviewsProps {
  servicioId: number;
  onClose?: () => void;
}

export const ServiceReviews: React.FC<ServiceReviewsProps> = ({
  servicioId,
  onClose,
}) => {
  const [reviews, setReviews] = useState<ResenaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await obtenerResenasPorServicio(servicioId);
        setReviews(data);
      } catch (err) {
        console.error("Error al cargar reseñas:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [servicioId]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Cerrar reseñas"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">Aún no hay reseñas para este servicio.</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((r) => (
            <li key={r.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                {/* Muestra estrellas según la calificación */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 mr-1 ${
                      i < r.calificacion ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(r.fecha).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800">{r.comentario}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Si quieres un botón para cerrar en pie de lista, puedes usar: */}
      {/* {onClose && <Button message="Cerrar" onClick={onClose} />} */}
    </div>
  );
};
