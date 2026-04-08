import { Text, View } from 'react-native';

import BasicCard from '@/components/cards/basicCard';

export default function BudgetOverviewPage() {
	return (
		<View>
			<Text>Budget Overview Page</Text>
			<View style={{ flexDirection: 'row', minWidth: '100%' }}>
				<BasicCard
					heading='Groceries'
					displayValue='$600.00'
				/>
				<BasicCard
					heading='Food & Drink'
					displayValue='$100.00'
				/>
				<BasicCard
					heading='Coffee'
					displayValue='$50.00'
				/>
			</View>
		</View>
	);
}
