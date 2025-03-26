export interface ShoppingItem {
  id: string;
  name: string;
  category: Category;
  purchased: boolean;
  createdAt: number;
  price?: number;
  quantity?: number;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: number;
  store?: string;
  recurring?: 'daily' | 'weekly' | 'monthly';
  reminder?: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: number;
  lastModified: number;
  description?: string;
  budget?: number;
  totalSpent?: number;
  store?: string;
  sharedWith?: string[];
  currency: 'INR';
  sortBy?: 'name' | 'category' | 'price' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
  view?: 'list' | 'grid' | 'calendar';
}

export const CATEGORIES = [
  'Fruits & Vegetables',
  'Dairy',
  'Meat & Fish',
  'Pantry',
  'Beverages',
  'Snacks',
  'Household',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];

export const PRIORITIES = {
  low: { label: 'Low', color: 'badge-blue' },
  medium: { label: 'Medium', color: 'badge-yellow' },
  high: { label: 'High', color: 'badge-green' }
} as const;

export const formatCurrency = (amount: number) => {
  return `₹${amount.toFixed(2)}`;
};

export const STORES = [
  'Big Bazaar',
  'Reliance Fresh',
  'DMart',
  'More',
  'Spencer\'s',
  'Local Market',
  'Other'
] as const;

export const RECURRING_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
] as const;

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
  { value: 'price', label: 'Price' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' }
] as const;

export const VIEW_OPTIONS = [
  { value: 'list', label: 'List View' },
  { value: 'grid', label: 'Grid View' },
  { value: 'calendar', label: 'Calendar View' }
] as const;