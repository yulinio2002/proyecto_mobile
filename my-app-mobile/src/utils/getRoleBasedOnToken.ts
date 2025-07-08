import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DecodedToken {
	roles: string[];
	sub: string;
	exp: number;
}

export async function getRoleBasedOnToken(): Promise<string | null> {
        const token = await AsyncStorage.getItem("token");
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