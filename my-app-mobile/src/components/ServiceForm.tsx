// src/components/ServiceForm.tsx
import React, { useState } from "react";
import {Plus, Edit } from "lucide-react";
import { ServicioRequest } from "@interfaces/servicio/ServicioRequest";
import Button from "./Button";  // <-- Importa tu botón reutilizable

interface ServiceFormProps {
  mode: "create" | "update";
  onSubmit: (data: ServicioRequest) => void;
  onCancel?: () => void;
  initialData?: Partial<ServicioRequest>;
  isLoading?: boolean;
}

const CATEGORIAS: { value: ServicioRequest["categoria"]; label: string }[] = [
  { value: "LIMPIEZA", label: "Limpieza" },
  { value: "PLOMERIA", label: "Plomería" },
  { value: "ELECTRICISTA", label: "Electricista" },
  { value: "CARPINTERIA", label: "Carpintería" },
  { value: "PINTURA", label: "Pintura" },
  { value: "JARDINERIA", label: "Jardinería" },
  { value: "CUIDADOS", label: "Cuidados" },
  { value: "TECNOLOGIA", label: "Tecnología" },
  { value: "MARKETING", label: "Marketing" },
];

export const ServiceForm: React.FC<ServiceFormProps> = ({
  mode,
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ServicioRequest>({
    nombre: initialData.nombre ?? "",
    descripcion: initialData.descripcion ?? "",
    precio: initialData.precio ?? 0,
    categoria: initialData.categoria ?? "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ServicioRequest, string>>>({});

  const config = {
    create: {
      title: "Crear Nuevo Servicio",
      subtitle: "Complete la información del servicio que desea ofrecer",
      buttonText: "Guardar Servicio",
      loadingText: "Guardando...",
      icon: Plus,
      colorBg: "bg-green-100",
      colorIcon: "text-green-600",
      colorBtn: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    },
    update: {
      title: "Actualizar Servicio",
      subtitle: "Modifique la información de su servicio",
      buttonText: "Actualizar Servicio",
      loadingText: "Actualizando...",
      icon: Edit,
      colorBg: "bg-blue-100",
      colorIcon: "text-blue-600",
      colorBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  }[mode];
  const IconComponent = config.icon;

  const validateForm = () => {
    const newErr: typeof errors = {};
    if (!formData.nombre.trim()) newErr.nombre = "El nombre es requerido";
    if (!formData.descripcion.trim()) newErr.descripcion = "La descripción es requerida";
    if (formData.precio <= 0) newErr.precio = "El precio debe ser mayor a 0";
    if (!formData.categoria) newErr.categoria = "Debe seleccionar una categoría";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: name === "precio" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof ServicioRequest]) {
      setErrors((p) => ({ ...p, [name as keyof ServicioRequest]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <header className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-full ${config.colorBg}`}>
            <IconComponent className={`w-6 h-6 ${config.colorIcon}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
        </div>
        <p className="text-gray-600">{config.subtitle}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* — Nombre — */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Servicio *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: Limpieza de Ventanas"
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
        </div>

        {/* — Descripción — */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={4}
            value={formData.descripcion}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.descripcion ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describa detalladamente el servicio que ofrece..."
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
          )}
        </div>

        {/* — Precio — */}
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
            Precio (S/.) *
          </label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.precio ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.precio && <p className="mt-1 text-sm text-red-600">{errors.precio}</p>}
        </div>

        {/* — Categoría — */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.categoria ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleccione una categoría</option>
            {CATEGORIAS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.categoria && (
            <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
          )}
        </div>

        {/* — Botones — */}
        <div className="flex justify-end space-x-4 pt-6">
          {onCancel && (
            <Button
              message="Cancelar"
              onClick={onCancel}
              disabled={isLoading}
            />
          )}
          <Button
            message={isLoading ? config.loadingText : config.buttonText}
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
)
}
