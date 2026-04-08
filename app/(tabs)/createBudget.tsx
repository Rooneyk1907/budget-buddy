import { useState } from 'react';
import { View } from 'react-native';

import Button from '@/components/button';
import DecimalInput from '@/components/inputs/decimals';
import TextBoxInput from '@/components/inputs/textBox';

const [budgetName, setBudgetName] = useState<string>('');
const [budgetDescription, setBudgetDescription] = useState<string>('');
const [budgetAmount, setBudgetAmount] = useState<number>(0.0);

function handleSave() {
	console.log('Save Button Pressed!');
}

function handleClear() {
	console.log('Clear Button Pressed!');
}

export default function CreateBudgetPage() {
	return (
		<View>
			{/* FORM */}
			<View>
				{/* BUDGET NAME */}
				<TextBoxInput
					label='Budget Category Name'
					value={budgetName}
					onChangeText={setBudgetName}
					placeholder='Budget Category Name'
					editable={true}
					expanded={false}
				/>
				{/* BUDGET DESCRIPTION */}
				<TextBoxInput
					label='Budget Category Description'
					value={budgetDescription}
					onChangeText={setBudgetDescription}
					placeholder='Budget Category Description'
					editable={true}
					expanded={true}
				/>
				{/* AMOUNT */}
				<DecimalInput
					label='Budget Amount'
					value={budgetAmount}
					onChangeText={setBudgetAmount}
					editable={true}
					placeholder='0.00'
				/>
				{/* LOCATIONS  (Advanced feature: map pin selection)*/}
				{/* TODO: Create location selector */}

				{/* BUTTONS */}
				<View style={{ flexDirection: 'row' }}>
					<Button
						buttonText='save'
						variant='save'
						onPress={handleSave}
					/>
					<Button
						buttonText='clear'
						variant='warning'
						onPress={handleClear}
					/>
				</View>
			</View>
		</View>
	);
}
