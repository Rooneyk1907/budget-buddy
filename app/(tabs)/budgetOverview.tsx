import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

// HOOKS
import { useStorage } from '@/hooks/useStorage';

// TYPES
import BudgetCategory from '@/types/budgetCategory';

// COMPONENTS
import BasicCard from '@/components/cards/basicCard';

export default function BudgetOverviewPage() {
	const storageFunctions = useStorage();
	const { loadAll: loadBudget } = storageFunctions;

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [budget, setBudget] = useState<BudgetCategory[]>([]);

	useEffect(() => {
		(async () => {
			const loadedBudget = await loadBudget();

			if (loadedBudget != null) setBudget(loadedBudget);
			setIsLoading(false);
		})();
	}, [loadBudget]);

	return (
		<View>
			<Text>Budget Overview Page</Text>
			{isLoading ? (
				<Text>Loading...</Text>
			) : (
				<FlatList
					data={budget}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<BasicCard
							heading={item.name}
							displayValue={String(item.amount)}
						/>
					)}
					ListEmptyComponent={<Text>No budget lines</Text>}
				/>
			)}
		</View>
	);
}
