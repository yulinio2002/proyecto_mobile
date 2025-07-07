export interface ServicioResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string; // "LIMPIEZA" | "PLOMERIA" | "ELECTRICISTA" | "CARPINTERIA" | "PINTURA" | "JARDINERIA" | "CUIDADOS" | "TECNOLOGIA" | "MARKETING";
    proveedorId: number;
    activo: boolean;
}