import Api from "@services/api";
import {ProveedorResponseDto} from "@interfaces/users/ProveedorResponseDto.ts";
import {ProveedorUpdateRequest} from "@interfaces/users/ProveedorUpdateRequest.ts";

export async function eliminarProveedor(proveedorId: number): Promise<number> {
    const Apis = await Api.getInstance();
    const response = await Apis.delete(
        {
        url: `/api/proveedor/${proveedorId}`,
    });
    return response.status;
}

export async function updateProveedor(id: number, data: ProveedorUpdateRequest) {
    try {
        const api = await Api.getInstance();
        const response = await api.put<ProveedorUpdateRequest, ProveedorResponseDto>(
            data,
            {url: `/api/proveedores/${id}`});
        return response.data;
    } catch (error) {
        console.error("Error updating proveedor:", error);
        throw error;
    }
}