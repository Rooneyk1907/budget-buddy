import { useEffect, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import uuid from 'react-native-uuid';

// HOOKS
import { useStorage } from '@/hooks/useStorage';

// TYPES
import ToastCard, { ToastVariant } from '@/components/cards/toastCard';
import BudgetCategory from '@/types/budgetCategory';

//  COMPONENTS
import Button from '@/components/button';
import DecimalInput from '@/components/inputs/decimals';
import TextBoxInput from '@/components/inputs/textBox';

type ToastState = {
	title: string;
	message?: string;
	variant: ToastVariant;
} | null;

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

	const [toast, setToast] = useState<ToastState>(null);
	// TODO: create state for locations

	useEffect(() => {
		if (!toast) return;

		const timeout = setTimeout(() => {
			setToast(null);
		}, 3000);

		return () => clearTimeout(timeout);
	}, [toast]);

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function handleSave() {
		console.log('Save Button Pressed!');

		const trimmedName = budgetName.trim();

		if (trimmedName === '') {
			setToast({
				title: 'Budget Not Saved',
				message: 'Budget category name is required',
				variant: 'error',
			});
			return;
		}

		const existingCategory = await checkCategory(budgetName);

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
			setToast({
				title: 'Budget Saved',
				message: `${trimmedName} was added successfully.`,
				variant: 'success',
			});

			console.log('budget saved!', newBudgetCategory);
		} else {
			// TODO: #5 add toast notification for error
			setToast({
				title: 'Budget Not Saved',
				message: 'Budget category already exists.',
				variant: 'error',
			});

			console.error('Budget category already exists');
			return;
		}
	}

	function handleClear() {
		console.log('Clear Button Pressed!');

		setBudgetName('');
		setBudgetDescription('');
		setBudgetAmount(0);

		setToast({
			title: 'Form Cleared',
			message: 'Budget inputs cleared',
			variant: 'info',
		});
	}

	function confirmDeleteAllBudgetData(): Promise<boolean> {
		if (Platform.OS === 'web') {
			return Promise.resolve(window.confirm('Delete ALL budget data?'));
		}

		return new Promise((resolve) => {
			Alert.alert(
				'Delete ALL Budget Data',
				'Do you really want to delete ALL budget data?',
				[
					{
						text: 'Cancel',
						style: 'cancel',
						onPress: () => resolve(false),
					},
					{
						text: 'DELETE',
						style: 'destructive',
						onPress: () => resolve(true),
					},
				],
				{ cancelable: true },
			);
		});
	}

	async function handleClearStorage() {
		console.log('Clear Storage Button Pressed!');

		setToast({
			title: 'Delete ALL Budget Data?',
			message: 'Please confirm that you wish to delete ALL stored budged data.',
			variant: 'warning',
		});

		await sleep(2000);

		const confirmed = await confirmDeleteAllBudgetData();

		if (!confirmed) {
			setToast({
				title: 'Delete Cancelled',
				message: 'Budget data was NOT deleted',
				variant: 'info',
			});

			return;
		}

		await clearStorage();

		setToast({
			title: 'Budget Data Deleted',
			message: 'All budget data delted from local storage.',
			variant: 'info',
		});
	}

	return (
		<View>
			{toast ? (
				<ToastCard
					title={toast.title}
					message={toast.message}
					variant={toast.variant}
				/>
			) : null}

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
					// TODO: #7 style text box so description text is justified to top of box instead of in the center
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
						onPress={handleClearStorage}
					/>
				</View>
			</View>
		</View>
	);
}
