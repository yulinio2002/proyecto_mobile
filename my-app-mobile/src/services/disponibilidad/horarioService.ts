import Api from "@services/api";
import { HorarioResponse } from "@interfaces/disponibilidades/HorarioResponse";
import { HorarioRequest } from "@interfaces/disponibilidades/HorarioRequest";

export async function crearHorarioDeServicio(
    servicioId: number,
    horario: HorarioRequest[]
): Promise<HorarioResponse> {
    const Apis = await Api.getInstance();
    const response = await Apis.post<HorarioRequest[], HorarioResponse>(
        horario,
        { url: `/api/servicios/${servicioId}/horarios` }
    );
    return response.data;
}
export async function obtenerHorariosPorServicio(
    servicioId: number
): Promise<HorarioResponse[]> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, HorarioResponse[]>({
        url: `/api/servicios/${servicioId}/horarios`,
    });
    return response.data;
}

