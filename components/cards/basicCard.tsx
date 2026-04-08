import { StyleSheet, Text, View } from 'react-native';

type BasicCardProps = {
	heading: string;
	displayValue: string;
};

export default function BasicCard({ heading, displayValue }: BasicCardProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>{heading}</Text>
			<Text style={styles.displayValue}>{displayValue}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderRadius: 12,
		borderColor: '#111,',
		padding: 16,
		margin: 3,
		alignItems: 'center',
		backgroundColor: '#fff',
		elevation: 3,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	heading: {
		fontSize: 12,
		color: '#333',
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	displayValue: {
		fontSize: 12,
		color: '#111',
		fontWeight: '600',
	},
});
