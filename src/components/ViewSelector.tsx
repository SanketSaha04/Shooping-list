import React from 'react';
import { List, Grid, Calendar } from 'lucide-react';
import type { ShoppingList } from '../types';
import { VIEW_OPTIONS } from '../types';

interface ViewSelectorProps {
  list: ShoppingList;
  onChangeView: (view: 'list' | 'grid' | 'calendar') => void;
}

export function ViewSelector({ list, onChangeView }: ViewSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        onClick={() => onChangeView('list')}
        className={`p-2 rounded-lg ${
          list.view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
        }`}
        title="List View"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => onChangeView('grid')}
        className={`p-2 rounded-lg ${
          list.view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
        }`}
        title="Grid View"
      >
        <Grid size={20} />
      </button>
      <button
        onClick={() => onChangeView('calendar')}
        className={`p-2 rounded-lg ${
          list.view === 'calendar' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
        }`}
        title="Calendar View"
      >
        <Calendar size={20} />
      </button>
    </div>
  );
}