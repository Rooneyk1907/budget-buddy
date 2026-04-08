import { useState } from 'react';
import { View } from 'react-native';
import uuid from 'react-native-uuid';

// HOOKS
import { useStorage } from '@/hooks/useStorage';

// TYPES
import BudgetCategory from '@/types/budgetCategory';

//  COMPONENTS
import Button from '@/components/button';
import DecimalInput from '@/components/inputs/decimals';
import TextBoxInput from '@/components/inputs/textBox';

export default function CreateBudgetPage() {
	const storageFunctions = useStorage();
	const {
		checkForExistingCategory: checkCategory,
		addBudgetLine: addBudget,
		clearStorage: clearStorage,
	} = storageFunctions;

	const [budgetName, setBudgetName] = useState<string>('');
	const [budgetDescription, setBudgetDescription] = useState<string>('');
	const [budgetAmount, setBudgetAmount] = useState<number>(0.0);
	// TODO: create state for locations

	async function handleSave() {
		console.log('Save Button Pressed!');

		const existingCategory = await checkCategory(budgetName);
		// checkCategory returns 'true' if category already exists and 'false' if it does not

		if (!existingCategory && budgetName !== '') {
			const newBudgetCategory: BudgetCategory = {
				id: uuid.v4(),
				name: budgetName,
				description: budgetDescription,
				amount: budgetAmount,
				spent: 0,
				transactions: [],
				// TODO: put in locations
				locations: [],
			};

			await addBudget(newBudgetCategory);
			// TODO: #4 add toast notification for success
			console.log('budget saved!', newBudgetCategory);
		} else {
			// TODO: #5 add toas notification for error
			console.error('Budget category already exists');
			return;
		}

		// Check that budget name does not already exist
	}

	function handleClear() {
		console.log('Clear Button Pressed!');

		setBudgetName('');
		setBudgetDescription('');
		setBudgetAmount(0);
	}

	return (
		<View>
			{/* FORM */}
			<View>
				{/* BUDGET NAME */}
				<TextBoxInput
					label='Budget Category Name'
					value={budgetName}
					onChangeText={setBudgetName}
					placeholder='Groceries'
					editable={true}
					expanded={false}
				/>
				{/* BUDGET DESCRIPTION */}
				<TextBoxInput
					label='Budget Category Description'
					value={budgetDescription}
					onChangeText={setBudgetDescription}
					placeholder='Food and ingredients bought to prepare at home.'
					editable={true}
					expanded={true}
				/>
				{/* AMOUNT */}
				<DecimalInput
					label='Budget Amount'
					value={budgetAmount}
					onChangeText={setBudgetAmount}
					editable={true}
				/>
				{/* LOCATIONS  (Advanced feature: map pin selection)*/}
				{/* TODO: #1 Create location selector */}

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
					<Button
						buttonText='Clear All Storage'
						variant='cancel'
						onPress={clearStorage}
					/>
				</View>
			</View>
		</View>
	);
}
