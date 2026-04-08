import { Pressable, StyleSheet, Text } from 'react-native';

type ButtonVariant = 'save' | 'cancel' | 'warning';

interface ButtonProps {
	buttonText: string;
	variant?: ButtonVariant;
	onPress?: () => void;
	disabled?: boolean;
}

export default function Button({
	buttonText,
	variant,
	onPress,
	disabled = false,
}: ButtonProps) {
	return (
		<Pressable
			style={[
				styles.container,
				variant === 'save' && styles.save,
				variant === 'cancel' && styles.cancel,
				variant === 'warning' && styles.warning,
				!variant && styles.default,
			]}
			onPress={onPress}
			disabled={disabled}>
			<Text style={styles.buttonText}>{buttonText}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	save: { backgroundColor: '#2e7d32' },
	cancel: { backgroundColor: '#c62828' },
	warning: { backgroundColor: '#ff7900' },
	default: { backgroundColor: '#666' },
	// TODO: created style for disabled button
});
