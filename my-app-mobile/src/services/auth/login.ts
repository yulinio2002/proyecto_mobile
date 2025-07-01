import { LoginRequest } from "@interfaces/auth/LoginRequest";
import Api from "@services/api";
import { AuthResponse } from "@interfaces/auth/AuthResponse";

export async function login(
    loginRequest: LoginRequest
): Promise<AuthResponse> {
  const Apis = await Api.getInstance();
  const response = await Apis.post<LoginRequest, AuthResponse>(
      loginRequest,
      { url: "/auth/login" }
  );
  // Set authorization token for subsequent requests
  if (response.data.token) {
    Apis.authorization = response.data.token;
  }
  return response.data;
}