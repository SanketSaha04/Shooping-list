import React from 'react';
import { Plus, ListPlus } from 'lucide-react';
import type { ShoppingList } from '../types';

interface ListSelectorProps {
  lists: ShoppingList[];
  selectedList: ShoppingList | null;
  onSelectList: (list: ShoppingList) => void;
  onCreateList: () => void;
}

export function ListSelector({ lists, selectedList, onSelectList, onCreateList }: ListSelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium text-gray-700">Your Lists</h2>
        <button onClick={onCreateList} className="btn-success">
          <ListPlus size={18} />
          New List
        </button>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {lists.map((list) => (
          <button
            key={list.id}
            onClick={() => onSelectList(list)}
            className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
              selectedList?.id === list.id
                ? 'bg-blue-600 text-white shadow-md hover:shadow-lg'
                : 'btn-secondary'
            }`}
          >
            {list.name}
          </button>
        ))}
        {lists.length === 0 && (
          <button onClick={onCreateList} className="btn-secondary">
            <Plus size={18} />
            Create First List
          </button>
        )}
      </div>
    </div>
  );
}