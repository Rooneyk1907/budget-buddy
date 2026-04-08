import { StyleSheet, Text, View } from 'react-native';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

interface ToastCardProps {
	title: string;
	message?: string;
	variant?: ToastVariant;
}

export default function ToastCard({
	title,
	message,
	variant = 'info',
}: ToastCardProps) {
	return (
		<View
			style={[
				styles.container,
				variant === 'success' && styles.success,
				variant === 'warning' && styles.warning,
				variant === 'error' && styles.error,
				variant === 'info' && styles.info,
			]}>
			<Text style={styles.title}>{title}</Text>
			{message ? <Text style={styles.message}>{message}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 10,
		marginBottom: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 10,
		borderWidth: 1,
	},
	title: {
		fontSize: 13,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	message: {
		marginTop: 4,
		fontSize: 13,
		lineHeight: 18,
	},
	success: {
		backgroundColor: '#e8f5e9',
		borderColor: '#2e7d32',
	},
	warning: {
		backgroundColor: '#fff3e0',
		borderColor: '#ff7900',
	},
	error: {
		backgroundColor: '#ffebee',
		borderColor: '#c62828',
	},
	info: {
		backgroundColor: '#e8f5e9',
		borderColor: '#222',
	},
});
