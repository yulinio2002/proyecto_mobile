import Api from "@services/api";
import {ClienteUpdateRequest} from "@interfaces/users/ClienteUpdateRequest.ts";
import {ClienteResponseDto} from "@interfaces/users/ClienteResponseDto.ts";
export async function eliminarCliente(clienteid: number): Promise<number> {
    const Apis = await Api.getInstance();
    const response = await Apis.delete(
        {
            url: `/api/clientes/${clienteid}`,
        });
    return response.status;
}

export async function updateCliente(id: number, data: ClienteUpdateRequest) {
    try {
        const api = await Api.getInstance();
        const response = await api.put<ClienteUpdateRequest, ClienteResponseDto>(
            data,
            {url: `/api/clientes/${id}`});
        return response.data;
    } catch (error) {
        console.error("Error updating cliente:", error);
        throw error;
    }
}