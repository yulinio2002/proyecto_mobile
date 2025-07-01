import { useCallback, useEffect, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
	initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
	return useReducer(
		(_: [boolean, T | null], action: T | null = null): [boolean, T | null] => [
			false,
			action,
		],
		initialValue,
	);
}

export async function setStorageItemAsync(key: string, value: string | null) {
        try {
                if (value === null) await AsyncStorage.removeItem(key);
                else await AsyncStorage.setItem(key, value);
        } catch (error) {
                console.error("Error setting storage item: ", error);
        }
}

export function useStorageState(key: string): UseStateHook<string> {
	const [state, setState] = useAsyncState<string>();

        useEffect(() => {
                AsyncStorage.getItem(key)
                        .then((value) => setState(value))
                        .catch((error) =>
                                console.error("Error getting storage item: ", error),
                        );
        }, [key]);

	const setValue = useCallback(
		(value: string | null) => {
			setState(value);
			setStorageItemAsync(key, value);
		},
		[key],
	);

	return [state, setValue];
}
