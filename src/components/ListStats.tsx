import React, { useState } from 'react';
import { PieChart, IndianRupee, Clock, Edit2 } from 'lucide-react';
import type { ShoppingList } from '../types';
import { format } from 'date-fns';
import { formatCurrency } from '../types';

interface ListStatsProps {
  list: ShoppingList;
  onUpdateBudget: (budget: number) => void;
}

export function ListStats({ list, onUpdateBudget }: ListStatsProps) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(list.budget?.toString() || '');
  
  const totalItems = list.items.length;
  const purchasedItems = list.items.filter(item => item.purchased).length;
  const completionPercentage = totalItems === 0 ? 0 : Math.round((purchasedItems / totalItems) * 100);
  const totalSpent = list.items.reduce((sum, item) => sum + (item.price || 0), 0);
  const remainingBudget = (list.budget || 0) - totalSpent;

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      onUpdateBudget(newBudget);
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Progress</p>
            <p className="text-xl font-semibold text-gray-900">{completionPercentage}%</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {purchasedItems} of {totalItems} items purchased
        </p>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Budget (INR)</p>
              <button
                onClick={() => setIsEditingBudget(true)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <Edit2 size={14} />
              </button>
            </div>
            {isEditingBudget ? (
              <form onSubmit={handleBudgetSubmit} className="mt-1">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-full px-2 py-1 text-lg font-semibold rounded border"
                  placeholder="Enter budget..."
                  step="0.01"
                  min="0"
                  autoFocus
                  onBlur={() => {
                    if (!budgetInput.trim()) {
                      setIsEditingBudget(false);
                    }
                  }}
                />
              </form>
            ) : (
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(list.budget || 0)}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Spent: {formatCurrency(totalSpent)}</span>
          <span className={remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}>
            Remaining: {formatCurrency(remainingBudget)}
          </span>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="text-xl font-semibold text-gray-900">
              {format(list.lastModified || list.createdAt, 'MMM d')}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Created: {format(list.createdAt, 'PPP')}
        </p>
      </div>
    </div>
  );
}