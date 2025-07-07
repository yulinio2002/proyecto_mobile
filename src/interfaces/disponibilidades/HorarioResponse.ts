export interface HorarioResponse {
    id: number;
    diaSemana: string; // Ejemplo: "LUNES", "MARTES", etc.
    horaInicio: string; // Formato "HH:mm:ss"  
    horaFin: string; // Formato "HH:mm:ss"
}