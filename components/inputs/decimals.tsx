import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface DecimalInputProps {
	label?: string;
	value?: number;
	onChangeText: (text: number) => void;
	onBlur?: () => void;
	placeholder?: string;
	editable: boolean;
}

export default function DecimalInput({
	label,
	value,
	onChangeText,
	onBlur,
	placeholder = '0.00',
	editable,
}: DecimalInputProps) {
	const [text, setText] = useState<string>(String(value));

	useEffect(() => setText(String(value)), [value]);

	const formatDecimalInput = (text: string) => {
		let formatted = text.replace(/[^0-9.]/g, '');
		const parts = formatted.split('.');

		if (parts.length > 2) {
			formatted = parts[0] + '.' + parts.slice(1).join('');
		}

		const [integer = '0', fractional = ''] = formatted.split('.');
		if (formatted.endsWith('.')) return `${integer}.`;

		const fracLimited = fractional.slice(0, 2);
		return fracLimited ? `${integer}.${fracLimited}` : integer;
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={styles.inputBox}
				editable={editable}
				value={text}
				onChangeText={(text) => {
					const formatted = formatDecimalInput(text);
					setText(formatted);

					const parsed = Number(formatted);
					if (Number.isFinite(parsed)) onChangeText(parsed);
				}}
				onBlur={() => {
					const normalized = Number.isFinite(Number(text))
						? Number(text).toFixed(2)
						: '0.00';
					setText(normalized);
					onChangeText(Number(normalized));
					onBlur?.();
				}}
				placeholder={placeholder}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 10,
		marginVertical: 6,
	},
	label: {
		fontSize: 10,
		fontWeight: '600',
		marginBottom: 6,
		textTransform: 'uppercase',
	},
	inputBox: {
		fontSize: 14,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
	},
});
