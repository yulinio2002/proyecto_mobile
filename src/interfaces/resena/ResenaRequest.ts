export interface ResenaRequest {
    servicioId: number;
    clienteId: number;
    calificacion: number;
    comentario: string;
    fecha?: string; // Fecha opcional, se puede generar en el servidor
}