declare module 'react';
declare module 'react-native';
declare module 'expo-image-picker';
declare module 'expo-secure-store';
declare module '@expo/vector-icons';
declare module '@react-navigation/native-stack';
declare module '@react-navigation/native';
declare module '@react-navigation/stack';
declare module 'axios';
declare module 'jwt-decode';
declare module 'react-native-safe-area-context';
declare const __DEV__: boolean;
declare module '@expo/vector-icons';
declare module 'expo-image-picker' {
  export const requestMediaLibraryPermissionsAsync: () => Promise<{ granted: boolean }>;
  export const launchImageLibraryAsync: (options: any) => Promise<{ cancelled: boolean; base64?: string }>; 
  export const MediaTypeOptions: any;
}
declare module 'expo-secure-store' {
  export function setItemAsync(key: string, value: string): Promise<void>;
  export function getItemAsync(key: string): Promise<string | null>;
  export function deleteItemAsync(key: string): Promise<void>;
}
declare module 'axios';
declare module 'jwt-decode';

