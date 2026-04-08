import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: #3 use proper validation of .env values
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

	async function saveAll(budget: BudgetCategory[]) {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
		} catch (error) {
			console.error('useStorage: save failed', error);
		}
	}

	async function addBudgetLine(
		budgetLine: BudgetCategory,
	): Promise<BudgetCategory> {
		const budget = await loadAll();

		const stored: BudgetCategory = {
			...budgetLine,
		};

		budget.unshift(stored);

		await saveAll(budget);
		return stored;
	}

	async function getById(id: string): Promise<BudgetCategory | undefined> {
		const budget = await loadAll();

		return budget.find((budgetLine) => budgetLine.id === id);
	}

	async function update(
		id: string,
		patch: Partial<BudgetCategory>,
	): Promise<BudgetCategory | undefined> {
		const budget = await loadAll();
		const index = budget.findIndex((budgetLine) => budgetLine.id === id);
		if (index === -1) return undefined;

		const updated = { ...budget[index], ...patch };
		budget[index] = updated;

		await saveAll(budget);
		return updated;
	}

	async function clearStorage(): Promise<void> {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error('useStorage: clearStorage failed', error);
		}
	}

	return { loadAll, saveAll, addBudgetLine, getById, update, clearStorage };
}
