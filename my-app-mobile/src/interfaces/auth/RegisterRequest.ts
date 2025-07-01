
export interface RegisterRequest {
    nombre: string;
    apellido?: string;
    email: string;
    password: string;
    telefono: string;
    foto?: string;
    descripcion?: string;
}