import React, { useState } from 'react';
import { Plus, Search, X, IndianRupee, Store, Calendar } from 'lucide-react';
import { CATEGORIES, STORES, PRIORITIES, type Category, type ShoppingList } from '../types';

interface AddItemFormProps {
  onAddItem: (name: string, category: Category, price?: number, store?: string, dueDate?: number, quantity?: number, priority?: 'low' | 'medium' | 'high') => void;
  list: ShoppingList;
}

export function AddItemForm({ onAddItem, list }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const parsedPrice = price ? parseFloat(price) : undefined;
      const parsedDueDate = dueDate ? new Date(dueDate).getTime() : undefined;
      const parsedQuantity = parseInt(quantity, 10);
      onAddItem(
        name.trim(),
        category,
        parsedPrice,
        store,
        parsedDueDate,
        parsedQuantity,
        priority
      );
      setName('');
      setPrice('');
      setStore('');
      setDueDate('');
      setQuantity('1');
      setPriority('low');
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full mb-6 card p-4 flex items-center gap-3 text-gray-500 hover:text-gray-700 group"
      >
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="flex-1 text-left">Add new item...</span>
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Add New Item</h3>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name..."
            className="input-field"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              id="item-quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="item-priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="item-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="select-field"
            >
              {Object.entries(PRIORITIES).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="item-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="select-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="item-price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (INR)
          </label>
          <div className="relative">
            <IndianRupee size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="item-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price..."
              className="input-field pl-10"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="item-store" className="block text-sm font-medium text-gray-700 mb-1">
            Store
          </label>
          <div className="relative">
            <Store size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="item-store"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="select-field pl-10"
            >
              <option value="">Select store...</option>
              {STORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="item-due-date" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="item-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field pl-10"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Plus size={18} />
          Add Item
        </button>
      </div>
    </form>
  );
}