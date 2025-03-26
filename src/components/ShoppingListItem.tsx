import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, Save, IndianRupee, Store, Calendar, AlertTriangle } from 'lucide-react';
import type { ShoppingItem, Category } from '../types';
import { CATEGORIES, STORES, PRIORITIES, formatCurrency } from '../types';
import { format } from 'date-fns';

interface ShoppingListItemProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onEdit: (id: string, name: string, category: Category, price?: number, store?: string, dueDate?: number, quantity?: number, priority?: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  view?: 'list' | 'grid' | 'calendar';
}

export function ShoppingListItem({ item, onToggle, onEdit, onDelete, view = 'list' }: ShoppingListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editPrice, setEditPrice] = useState(item.price?.toString() || '');
  const [editStore, setEditStore] = useState(item.store || '');
  const [editDueDate, setEditDueDate] = useState(
    item.dueDate ? format(item.dueDate, 'yyyy-MM-dd') : ''
  );
  const [editQuantity, setEditQuantity] = useState(item.quantity?.toString() || '1');
  const [editPriority, setEditPriority] = useState(item.priority || 'low');

  const handleSave = () => {
    if (editName.trim()) {
      const price = editPrice ? parseFloat(editPrice) : undefined;
      const dueDate = editDueDate ? new Date(editDueDate).getTime() : undefined;
      const quantity = editQuantity ? parseInt(editQuantity, 10) : 1;
      onEdit(item.id, editName.trim(), editCategory as Category, price, editStore, dueDate, quantity, editPriority as 'low' | 'medium' | 'high');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="card p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Edit Item</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="input-field"
          placeholder="Item name"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              className="input-field"
              min="1"
              step="1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Priority</label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
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
        <select
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
          className="select-field w-full"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <div className="relative">
          <IndianRupee size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            className="input-field pl-10"
            placeholder="Price in INR"
            step="0.01"
            min="0"
          />
        </div>
        <div className="relative">
          <Store size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={editStore}
            onChange={(e) => setEditStore(e.target.value)}
            className="select-field w-full pl-10"
          >
            <option value="">Select store...</option>
            {STORES.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="input-field pl-10"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button onClick={handleSave} className="btn-primary w-full">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className={`card p-4 ${item.purchased ? 'bg-gray-50/80' : ''}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.purchased}
                onChange={() => onToggle(item.id)}
                className="w-5 h-5 rounded-lg border-2 border-gray-300"
              />
              <span className={`badge ${PRIORITIES[item.priority || 'low'].color}`}>
                {PRIORITIES[item.priority || 'low'].label}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <h3 className={`text-lg font-medium mb-2 ${item.purchased ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {item.name}
          </h3>
          <div className="flex-1">
            <div className="space-y-2 text-sm text-gray-600">
              <p>Quantity: {item.quantity || 1}</p>
              <p>{item.category}</p>
              {item.price && <p className="font-medium">{formatCurrency(item.price)}</p>}
              {item.store && (
                <p className="flex items-center gap-1">
                  <Store size={14} />
                  {item.store}
                </p>
              )}
              {item.dueDate && (
                <p className="flex items-center gap-1">
                  <Calendar size={14} />
                  {format(item.dueDate, 'MMM d')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-4 ${item.purchased ? 'bg-gray-50/80' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="checkbox"
            checked={item.purchased}
            onChange={() => onToggle(item.id)}
            className="w-5 h-5 rounded-lg border-2 border-gray-300 
              text-blue-600 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200 cursor-pointer"
          />
          {item.purchased && (
            <Check
              size={14}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                text-white pointer-events-none"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-gray-900 truncate ${item.purchased ? 'line-through text-gray-500' : ''}`}>
              {item.name}
            </p>
            <span className={`badge ${PRIORITIES[item.priority || 'low'].color}`}>
              {PRIORITIES[item.priority || 'low'].label}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Qty: {item.quantity || 1}</span>
            <span className="text-sm text-gray-500">{item.category}</span>
            {item.price !== undefined && (
              <span className="text-sm font-medium text-gray-700">
                {formatCurrency(item.price)}
              </span>
            )}
            {item.store && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Store size={14} />
                {item.store}
              </span>
            )}
            {item.dueDate && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar size={14} />
                {format(item.dueDate, 'MMM d')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}