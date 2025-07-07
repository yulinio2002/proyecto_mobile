import {jwtDecode} from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

interface DecodedToken {
  roles: string[];
  sub: string;
  exp: number;
}

export async function getRoleBasedOnToken(): Promise<string | null> {
  // Lee el token desde SecureStore en lugar de localStorage
  const stored = await SecureStore.getItemAsync('auth');
  if (!stored) return null;

  // 'stored' es un JSON string con { token, id }
  try {
    const { token } = JSON.parse(stored);
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.roles && decoded.roles.length > 0) {
      return decoded.roles[0];
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  return null;
}