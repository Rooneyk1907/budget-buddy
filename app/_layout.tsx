import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
	return (
		<View style={styles.appBase}>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	appBase: {
		flex: 1,
		margin: 0,
		padding: 15,
		backgroundColor: '#222',
		fontFamily: 'sans-serif',
	},
});
