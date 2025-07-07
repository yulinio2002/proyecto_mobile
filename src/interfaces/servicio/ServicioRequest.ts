export interface ServicioRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string; //"LIMPIEZA" | "PLOMERIA" | "ELECTRICISTA" | "CARPINTERIA" | "PINTURA" | "JARDINERIA" | "CUIDADOS" | "TECNOLOGIA" | "MARKETING";
}