import { jwtDecode } from "jwt-decode";

interface DecodedToken {
	roles: string[];
	sub: string;
	exp: number;
}

export function getRoleBasedOnToken(token: string | null): string | null {
        if (!token) return null;

        try {
                const decodedToken = jwtDecode<DecodedToken>(token);
                // El backend envía los roles en un array
                if (decodedToken.roles && decodedToken.roles.length > 0) {
                        return decodedToken.roles[0];
                }
                return null;
        } catch (error) {
                console.error("Error decoding token:", error);
                return null;
        }
}