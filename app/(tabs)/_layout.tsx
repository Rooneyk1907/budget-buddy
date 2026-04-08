import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Dashboard',
					tabBarButton: (props) => (
						<TabButton
							{...props}
							label='Dashboard'
							icon='stats-chart'
							iconOutline='stats-chart-outline'
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='createBudget'
				options={{
					title: 'Create Budget',
					tabBarButton: (props) => (
						<TabButton
							{...props}
							label='Create Budget'
							icon='add-circle'
							iconOutline='add-circle-outline'
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='budgetOverview'
				options={{
					title: 'Budget Overview',
					tabBarButton: (props) => (
						<TabButton
							{...props}
							label='Budget Overview'
							icon='cash'
							iconOutline='cash-outline'
						/>
					),
				}}
			/>
		</Tabs>
	);
}

function TabButton({
	accessibilityState,
	onPress,
	label,
	icon,
	iconOutline,
	...rest
}: any) {
	const focused = accessibilityState?.selected;

	return (
		<Pressable
			onPress={onPress}
			{...rest}>
			<View style={{ alignItems: 'center' }}>
				<Ionicons
					name={focused ? icon : iconOutline}
					size={20}
					color={focused ? '#fff' : '#bbb'}
					style={{ marginBottom: 4 }}
				/>
				<Text>{label}</Text>
			</View>
		</Pressable>
	);
}
