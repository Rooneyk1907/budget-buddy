import { StyleSheet, Text, TextInput, View } from 'react-native';

// Text input component that receives a prop (expanded)
// Expanded prop indicates if large text box or single line text box
interface TextBoxInputProps {
	label?: string;
	value?: string;
	onChangeText: (text: string) => void;
	onBlur?: () => void;
	placeholder?: string;
	editable: boolean;
	expanded: boolean;
}

export default function TextBoxInput({
	label,
	value,
	onChangeText,
	onBlur,
	placeholder,
	editable,
	expanded,
}: TextBoxInputProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				editable={editable}
				value={value}
				style={[
					styles.inputBox,
					expanded ? styles.inputBoxExpanded : styles.inputBoxSingleLine,
				]}
				onChangeText={onChangeText}
				onBlur={onBlur}
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
	inputBoxSingleLine: {
		height: 44,
	},
	inputBoxExpanded: {
		minHeight: 120,
	},
	// TODO: #6 Style placeholder text
});
