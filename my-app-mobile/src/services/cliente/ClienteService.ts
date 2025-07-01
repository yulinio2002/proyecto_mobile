import Api from "@services/api";
import { ClienteResponse } from "@interfaces/cliente/ClienteResponse";

export async function obtenerCliente(
  clienteId: number
): Promise<ClienteResponse> {
  const Apis = await Api.getInstance();
  const { data } = await Apis.get<null, ClienteResponse>({
    url: `/api/servicios/clientes/${clienteId}`,
  });
  return data;
}