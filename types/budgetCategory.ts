export interface BudgetCategory {
	id: string;
	name: string;
	description: string;
	amount: number;
	spent: number;
	transactions: Transaction[];
	locations: StoreLocation[];
}

interface Transaction {
	id: string;
	date: string;
	store: string;
	spent: number;
	location: StoreLocation;
}

interface StoreLocation {
	id: string;
	name: string;
	coordinate: {
		longitude: number;
		latitude: number;
	};
}