import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function RootLayout() {
	return (
		<View>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			/>
		</View>
	);
}
