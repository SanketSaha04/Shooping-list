import React from 'react';
import { Download, Share2, Trash2 } from 'lucide-react';
import { generatePDF } from '../utils/pdf';
import type { ShoppingList } from '../types';

interface ListActionsProps {
  list: ShoppingList;
  onDelete: () => void;
}

export function ListActions({ list, onDelete }: ListActionsProps) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: list.name,
        text: `Check out my shopping list: ${list.name}`,
        url: window.location.href
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        onClick={() => generatePDF(list)}
        className="btn-secondary"
        title="Download PDF"
      >
        <Download size={18} />
        Export PDF
      </button>
      
      <button
        onClick={handleShare}
        className="btn-secondary"
        title="Share List"
      >
        <Share2 size={18} />
        Share
      </button>

      <button
        onClick={onDelete}
        className="btn-danger ml-auto"
        title="Delete List"
      >
        <Trash2 size={18} />
        Delete
      </button>
    </div>
  );
}