import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
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

type StoreLocation = BudgetCategory['locations'][number];

type GeoapifyFeature = {
	properties?: {
		place_id?: string;
		formatted?: string;
		name?: string;
		lat?: number;
		lon?: number;
	};
};

function normalizeGeoapifyFeature(
	feature: GeoapifyFeature,
): StoreLocation | null {
	const name = feature.properties?.name || feature.properties?.formatted;
	const latitude = feature.properties?.lat;
	const longitude = feature.properties?.lon;

	if (!name) return null;
	if (typeof latitude !== 'number' || typeof longitude !== 'number') {
		return null;
	}

	return {
		id: String(feature.properties?.place_id || uuid.v4()),
		name,
		coordinate: {
			latitude,
			longitude,
		},
	};
}

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

	const [locationSearch, setLocationSearch] = useState<string>('');
	const [locationResults, setLocationResults] = useState<StoreLocation[]>([]);
	const [selectedLocations, setSelectedLocations] = useState<StoreLocation[]>(
		[],
	);
	const [isSearchingLocations, setIsSearchingLocations] = useState(false);

	useEffect(() => {
		if (!toast) return;

		const timeout = setTimeout(() => {
			setToast(null);
		}, 3000);

		return () => clearTimeout(timeout);
	}, [toast]);

	useEffect(() => {
		const trimmedSearch = locationSearch.trim();
		const geoapifyApiKey = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

		if (trimmedSearch.length < 3) {
			setLocationResults([]);
			setIsSearchingLocations(false);
			return;
		}

		if (!geoapifyApiKey) {
			setLocationResults([]);
			setToast({
				title: 'API Error',
				message: 'Geoapify API key not valid.',
				variant: 'error',
			});
			return;
		}

		let isActive = true;
		setIsSearchingLocations(true);

		const timeout = setTimeout(() => {
			void searchLocations(trimmedSearch, geoapifyApiKey, isActive);
		}, 400);

		return () => {
			isActive = false;
			clearTimeout(timeout);
		};
	}, [locationSearch]);

	async function searchLocations(
		query: string,
		apiKey: string,
		isActive: boolean,
	) {
		try {
			const params = new URLSearchParams({
				text: query,
				limit: '5',
				format: 'json',
				apiKey,
			});

			const response = await fetch(
				`https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`,
			);

			if (!response.ok) {
				setToast({
					title: 'Geoapify Error',
					message: `Geoapify request failed: ${response.status}`,
					variant: 'error',
				});
				throw new Error(
					`Geoapify request failed with status ${response.status}`,
				);
			}

			const data = (await response.json()) as {
				results?: Array<{
					place_id?: string;
					formatted?: string;
					name?: string;
					lat?: number;
					lon?: number;
				}>;
				features?: GeoapifyFeature[];
			};

			const resultsFromJson = (data.results || []).map((result) =>
				normalizeGeoapifyFeature({
					properties: {
						place_id: result.place_id,
						formatted: result.formatted,
						name: result.name,
						lat: result.lat,
						lon: result.lon,
					},
				}),
			);

			const resultsFromFeatures = (data.features || []).map(
				normalizeGeoapifyFeature,
			);

			const normalized = [...resultsFromJson, ...resultsFromFeatures].filter(
				(location): location is StoreLocation => location !== null,
			);

			const uniqueResults = normalized.filter(
				(location, index, locations) =>
					locations.findIndex(
						(candidate) =>
							candidate.name === location.name &&
							candidate.coordinate.latitude === location.coordinate.latitude &&
							candidate.coordinate.longitude === location.coordinate.longitude,
					) === index,
			);

			if (!isActive) return;
			setLocationResults(uniqueResults);
		} catch (error) {
			console.error('Geoapify sarch failed!', error);

			if (!isActive) return;

			setLocationResults([]);
			setToast({
				title: 'Geoapify Search Failed',
				message: 'Unable to load store matches.',
				variant: 'error',
			});
		} finally {
			if (isActive) {
				setIsSearchingLocations(false);
			}
		}
	}

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	function addSelectedLocation(location: StoreLocation) {
		const alreadySelected = selectedLocations.some(
			(selectedLocations) =>
				selectedLocations.coordinate.latitude ===
					location.coordinate.latitude &&
				selectedLocations.coordinate.longitude ===
					location.coordinate.longitude,
		);

		if (alreadySelected) {
			setToast({
				title: 'Location Already Added',
				message: `${location.name} is already linked to this budget.`,
				variant: 'info',
			});
			return;
		}

		setSelectedLocations((currentLocations) => [...currentLocations, location]);
		setLocationSearch('');
		setLocationResults([]);
	}

	function removeSelectedLocation(locationId: string) {
		setSelectedLocations((currentLocations) =>
			currentLocations.filter((location) => location.id !== locationId),
		);
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
		setLocationSearch('');
		setLocationResults([]);
		setSelectedLocations([]);

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
				<TextBoxInput
					label='Store Search'
					value={locationSearch}
					onChangeText={setLocationSearch}
					placeholder='Search for a store or address'
					editable={true}
					expanded={false}
				/>

				{isSearchingLocations ? (
					<View style={styles.searchStatus}>
						<ActivityIndicator size='small' />
						<Text style={styles.searchStatusText}>Searching stores...</Text>
					</View>
				) : null}

				{locationResults.length > 0 ? (
					<View style={styles.resultsContainer}>
						<FlatList
							data={locationResults}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
							renderItem={({ item }) => (
								<Pressable
									style={styles.resultItem}
									onPress={() => addSelectedLocation(item)}>
									<Text style={styles.resultName}>{item.name}</Text>
									<Text style={styles.resultCoordinate}>
										Lat: {item.coordinate.latitude.toFixed(5)} | Lon:{' '}
										{item.coordinate.longitude.toFixed(5)}
									</Text>
								</Pressable>
							)}
						/>
					</View>
				) : null}

				{selectedLocations.length > 0 ? (
					<View style={styles.selectedContainer}>
						<Text style={styles.selectedTitle}>Selected Stores</Text>
						{selectedLocations.map((location) => (
							<View
								key={location.id}
								style={styles.selectedItem}>
								<View style={styles.selectedTextContainer}>
									<Text style={styles.selectedName}>{location.name}</Text>
									<Text style={styles.resultCoordinate}>
										Lat: {location.coordinate.latitude.toFixed(5)} | Lon:{' '}
										{location.coordinate.longitude.toFixed(5)}
									</Text>
								</View>
								<Pressable
									onPress={() => removeSelectedLocation(location.id)}
									style={styles.removeButton}>
									<Text style={styles.removeButton}>Rmove</Text>
								</Pressable>
							</View>
						))}
					</View>
				) : null}

				{/* BUTTONS */}
				<View style={styles.buttonRow}>
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

const styles = StyleSheet.create({
	page: {
		paddingBottom: 24,
	},
	searchStatus: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		marginTop: 8,
		gap: 8,
	},
	searchStatusText: {
		fontSize: 12,
		color: '#555',
	},
	resultsContainer: {
		marginHorizontal: 10,
		marginTop: 8,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		overflow: 'hidden',
	},
	resultItem: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		backgroundColor: '#fff',
	},
	resultName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#222',
	},
	resultCoordinate: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	selectedContainer: {
		marginHorizontal: 10,
		marginTop: 12,
		padding: 12,
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		backgroundColor: '#fafafa',
		gap: 10,
	},
	selectedTitle: {
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		color: '#444',
	},
	selectedItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	selectedTextContainer: {
		flex: 1,
	},
	selectedName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#222',
	},
	removeButton: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 6,
		backgroundColor: '#c62828',
	},
	removeButtonText: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 12,
		textTransform: 'uppercase',
	},
	buttonRow: {
		flexDirection: 'row',
		columnGap: 8,
		marginTop: 16,
	},
});
