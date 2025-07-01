import { useStorageState } from "@hooks/useStorageState";
import { LoginRequest } from "@interfaces/auth/LoginRequest";
import { RegisterRequest } from "@interfaces/auth/RegisterRequest";
import Api from "@services/api";
import { login } from "@services/auth/login";
import { registerCliente, registerProveedor } from "@services/auth/register";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { AuthResponse } from "@interfaces/auth/AuthResponse";

interface AuthContextType {
	register: (SignupRequest: RegisterRequest, isClient: boolean) => Promise<void>;
	login: (loginRequest: LoginRequest) => Promise<void>;
	logout: () => void;
	session?: string | null;
	isLoading: boolean;
	userId?: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loginHandler(
	loginRequest: LoginRequest,
	setSession: (value: string) => void,
	setUserId: (value: string) => void
) {
	const response = await login(loginRequest);
	setSession(response.token);
	setUserId(response.id.toString());
}

async function signupHandler(
	signupRequest: RegisterRequest,
	isClient: boolean,
	setSession: (value: string) => void,
	setUserId: (value: string) => void
) {
	let response: AuthResponse;

	if (isClient) {
		response = await registerCliente(signupRequest);
	} else {
		response = await registerProveedor(signupRequest);
	}

	setSession(response.token);
	setUserId(response.id.toString());
}

export function AuthProvider(props: { children: ReactNode }) {
	const [[isLoading, session], setSession] = useStorageState("token");
	const [[, userId], setUserId] = useStorageState("userId");

	// Synchronize API authorization header whenever the session changes
	useEffect(() => {
		Api.getInstance().then((api) => {
			api.authorization = session ?? "";
		});
	}, [session]);

	return (
		<AuthContext.Provider
			value={{
				register: (signupRequest, isClient) => signupHandler(signupRequest, isClient, setSession, setUserId),
				login: (loginRequest) => loginHandler(loginRequest, setSession, setUserId),
				logout: () => {
					setSession(null);
					setUserId(null);
					Api.getInstance().then((api) => {
						api.authorization = "";
					});
				},
				session,
				isLoading,
				userId: userId ? parseInt(userId) : null,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined)
		throw new Error("useAuthContext must be used within a AuthProvider");
	return context;
}