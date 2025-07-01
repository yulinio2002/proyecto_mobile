import Api from "@services/api";
import { ResenaResponse } from "@interfaces/resena/ResenaResponse";
import { ResenaRequest } from "@interfaces/resena/ResenaRequest";

export async function obtenerResenasPorServicio(
    servicioId: number
): Promise<ResenaResponse[]> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, ResenaResponse[]>({
        url: `/api/servicios/${servicioId}/resenas`,
    });
    return response.data;
}

export async function crearResena(
    resena: ResenaRequest
): Promise<ResenaResponse> {
    const Apis = await Api.getInstance();
    const response = await Apis.post<ResenaRequest, ResenaResponse>(
        resena,
        { url: `/api/resenas` }
    );
    return response.data;
}