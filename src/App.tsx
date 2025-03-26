import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Plus, ArrowUpDown } from 'lucide-react';
import { AddItemForm } from './components/AddItemForm';
import { ShoppingListItem } from './components/ShoppingListItem';
import { ListSelector } from './components/ListSelector';
import { ListStats } from './components/ListStats';
import { ListActions } from './components/ListActions';
import { ViewSelector } from './components/ViewSelector';
import type { ShoppingList, ShoppingItem, Category } from './types';
import { CATEGORIES, SORT_OPTIONS } from './types';
import { format, startOfDay, endOfDay, isSameDay } from 'date-fns';

function App() {
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const saved = localStorage.getItem('shoppingLists');
    if (saved) {
      const parsedLists = JSON.parse(saved);
      return parsedLists.map((list: ShoppingList) => ({
        ...list,
        currency: 'INR',
        sortBy: list.sortBy || 'name',
        sortOrder: list.sortOrder || 'asc',
        view: list.view || 'list'
      }));
    }
    return [];
  });
  
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    if (lists.length > 0 && !selectedList) {
      setSelectedList(lists[0]);
    }
  }, [lists, selectedList]);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList: ShoppingList = {
        id: crypto.randomUUID(),
        name: newListName.trim(),
        items: [],
        createdAt: Date.now(),
        lastModified: Date.now(),
        budget: 0,
        totalSpent: 0,
        currency: 'INR',
        sortBy: 'name',
        sortOrder: 'asc',
        view: 'list'
      };
      setLists([...lists, newList]);
      setSelectedList(newList);
      setNewListName('');
      setIsNewListDialogOpen(false);
    }
  };

  const handleDeleteList = () => {
    if (!selectedList) return;
    if (confirm('Are you sure you want to delete this list?')) {
      const newLists = lists.filter(list => list.id !== selectedList.id);
      setLists(newLists);
      setSelectedList(newLists.length > 0 ? newLists[0] : null);
    }
  };

  const handleUpdateBudget = (budget: number) => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      budget,
      lastModified: Date.now()
    };
    setLists(lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const addItem = (
    name: string,
    category: Category,
    price?: number,
    store?: string,
    dueDate?: number,
    quantity: number = 1,
    priority: 'low' | 'medium' | 'high' = 'low'
  ) => {
    if (!selectedList) return;
    
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name,
      category,
      purchased: false,
      createdAt: Date.now(),
      price,
      store,
      dueDate,
      quantity,
      priority
    };

    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, newItem],
      lastModified: Date.now()
    };

    setLists(lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const toggleItem = (itemId: string) => {
    if (!selectedList) return;

    const updatedList = {
      ...selectedList,
      items: selectedList.items.map(item =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      ),
      lastModified: Date.now()
    };

    setLists(lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const editItem = (
    itemId: string,
    name: string,
    category: Category,
    price?: number,
    store?: string,
    dueDate?: number,
    quantity?: number,
    priority?: 'low' | 'medium' | 'high'
  ) => {
    if (!selectedList) return;

    const updatedList = {
      ...selectedList,
      items: selectedList.items.map(item =>
        item.id === itemId ? { ...item, name, category, price, store, dueDate, quantity, priority } : item
      ),
      lastModified: Date.now()
    };

    setLists(lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const deleteItem = (itemId: string) => {
    if (!selectedList) return;

    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter(item => item.id !== itemId),
      lastModified: Date.now()
    };

    setLists(lists.map(list => 
      list.id === selectedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const handleChangeView = (view: 'list' | 'grid' | 'calendar') => {
    if (!selectedList) return;
    const updatedList = {
      ...selectedList,
      view
    };
    setLists(lists.map(list =>
      list.id === selectedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const handleSort = (sortBy: ShoppingList['sortBy']) => {
    if (!selectedList) return;
    const newSortOrder = selectedList.sortBy === sortBy && selectedList.sortOrder === 'asc' ? 'desc' : 'asc';
    const updatedList = {
      ...selectedList,
      sortBy,
      sortOrder: newSortOrder
    };
    setLists(lists.map(list =>
      list.id === selectedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const getSortedItems = (items: ShoppingItem[]) => {
    if (!selectedList?.sortBy) return items;

    return [...items].sort((a, b) => {
      const order = selectedList.sortOrder === 'asc' ? 1 : -1;
      
      switch (selectedList.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * order;
        case 'category':
          return a.category.localeCompare(b.category) * order;
        case 'price':
          return ((a.price || 0) - (b.price || 0)) * order;
        case 'dueDate':
          return ((a.dueDate || Infinity) - (b.dueDate || Infinity)) * order;
        case 'priority': {
          const priorities = { low: 0, medium: 1, high: 2 };
          return ((priorities[a.priority || 'low'] - priorities[b.priority || 'low']) * order);
        }
        default:
          return 0;
      }
    });
  };

  const sortedItems = selectedList ? getSortedItems(selectedList.items) : [];

  const groupedItems = sortedItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<Category, ShoppingItem[]>);

  const renderCalendarView = () => {
    if (!selectedList) return null;

    const today = new Date();
    const itemsByDate: Record<string, ShoppingItem[]> = {};
    
    // Group items by date
    sortedItems.forEach(item => {
      if (item.dueDate) {
        const dateKey = format(item.dueDate, 'yyyy-MM-dd');
        if (!itemsByDate[dateKey]) {
          itemsByDate[dateKey] = [];
        }
        itemsByDate[dateKey].push(item);
      }
    });

    // Get unique dates and sort them
    const dates = Object.keys(itemsByDate).sort();

    return (
      <div className="space-y-6">
        {dates.map(dateKey => {
          const date = new Date(dateKey);
          const isToday = isSameDay(date, today);
          
          return (
            <div key={dateKey} className={`p-4 rounded-xl ${isToday ? 'bg-blue-50 border border-blue-100' : 'bg-white'}`}>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {isToday ? 'Today' : format(date, 'EEEE, MMMM d')}
              </h3>
              <div className="space-y-2">
                {itemsByDate[dateKey].map(item => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    onToggle={toggleItem}
                    onEdit={editItem}
                    onDelete={deleteItem}
                    view={selectedList.view}
                  />
                ))}
              </div>
            </div>
          );
        })}
        
        {dates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No items with due dates
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24">
        <header className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>
        </header>

        <ListSelector
          lists={lists}
          selectedList={selectedList}
          onSelectList={setSelectedList}
          onCreateList={() => setIsNewListDialogOpen(true)}
        />

        {selectedList && (
          <>
            <ListStats 
              list={selectedList} 
              onUpdateBudget={handleUpdateBudget}
            />
            <ListActions list={selectedList} onDelete={handleDeleteList} />
            
            <div className="flex items-center justify-between mb-6">
              <ViewSelector
                list={selectedList}
                onChangeView={handleChangeView}
              />
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedList.sortBy || 'name'}
                  onChange={(e) => handleSort(e.target.value as ShoppingList['sortBy'])}
                  className="select-field"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleSort(selectedList.sortBy || 'name')}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                  title={`Order: ${selectedList.sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  <ArrowUpDown size={20} className={selectedList.sortOrder === 'desc' ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>

            <AddItemForm onAddItem={addItem} list={selectedList} />

            {selectedList.view === 'calendar' ? (
              renderCalendarView()
            ) : (
              <div className="space-y-8">
                {CATEGORIES.map(category => {
                  const items = groupedItems[category];
                  if (!items?.length) return null;

                  return (
                    <section key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <h2 className="text-lg font-medium text-gray-700">
                          {category}
                        </h2>
                        <span className="text-sm text-gray-400">
                          ({items.length})
                        </span>
                      </div>
                      <div className={selectedList.view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-2'}>
                        {items.map(item => (
                          <ShoppingListItem
                            key={item.id}
                            item={item}
                            onToggle={toggleItem}
                            onEdit={editItem}
                            onDelete={deleteItem}
                            view={selectedList.view}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* New List Dialog */}
        {isNewListDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New List</h2>
              <form onSubmit={handleCreateList}>
                <div className="mb-4">
                  <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
                    List Name
                  </label>
                  <input
                    type="text"
                    id="listName"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="input-field"
                    placeholder="Enter list name..."
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewListDialogOpen(false);
                      setNewListName('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={!newListName.trim()}
                  >
                    Create List
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!selectedList && (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Lists Yet
              </h2>
              <p className="text-gray-500 mb-6">
                Create your first shopping list to get started
              </p>
              <button onClick={() => setIsNewListDialogOpen(true)} className="btn-success mx-auto">
                <Plus size={18} />
                Create New List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;