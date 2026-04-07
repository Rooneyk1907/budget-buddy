import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: use proper validation of .env values
const STORAGE_KEY =
	process.env.EXPO_PUBLIC_LONG_TERM_STORAGE_KEY || '@long_term_storage_v1';

import { BudgetCategory } from '@/types/budgetCategory';

export async function useStorage() {
	async function loadAll(): Promise<BudgetCategory[]> {
		try {
			const raw = await AsyncStorage.getItem(STORAGE_KEY);
			if (!raw) return [];

			return JSON.parse(raw) as BudgetCategory[];
		} catch (error) {
			console.error('useStorage: loadAll failed', error);
			return [];
		}
	}
}
