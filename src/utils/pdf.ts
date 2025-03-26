import jsPDF from 'jspdf';
import type { ShoppingList, ShoppingItem } from '../types';
import { format } from 'date-fns';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export const generatePDF = (list: ShoppingList) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.text(list.name, 20, 20);
  
  // Date and Info
  doc.setFontSize(10);
  doc.text(`Created: ${format(list.createdAt, 'PPP')}`, 20, 30);
  doc.text(`Last Modified: ${format(list.lastModified, 'PPP')}`, 20, 35);
  
  if (list.description) {
    doc.text(`Description: ${list.description}`, 20, 45);
  }

  // Budget Information
  let startY = list.description ? 55 : 45;
  if (list.budget !== undefined) {
    doc.text(`Budget: ₹${list.budget.toFixed(2)}`, 20, startY);
    const totalSpent = list.items.reduce((sum, item) => sum + (item.price || 0), 0);
    doc.text(`Total Spent: ₹${totalSpent.toFixed(2)}`, 20, startY + 5);
    doc.text(`Remaining: ₹${(list.budget - totalSpent).toFixed(2)}`, 20, startY + 10);
    startY += 20;
  }

  // Items Table
  const headers = ['Item', 'Category', 'Price', 'Store', 'Due Date', 'Status'];
  const data = list.items.map((item: ShoppingItem) => [
    item.name,
    item.category,
    item.price ? `₹${item.price.toFixed(2)}` : '-',
    item.store || '-',
    item.dueDate ? format(item.dueDate, 'MMM d, yyyy') : '-',
    item.purchased ? '✓' : '□'
  ]);

  doc.autoTable({
    head: [headers],
    body: data,
    startY,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [66, 133, 244] },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 15, halign: 'center' }
    }
  });

  // Summary
  const total = list.items.length;
  const purchased = list.items.filter(item => item.purchased).length;
  const totalSpent = list.items.reduce((sum, item) => sum + (item.price || 0), 0);
  
  doc.text(`Total Items: ${total}`, 20, doc.lastAutoTable.finalY + 10);
  doc.text(`Purchased: ${purchased}`, 20, doc.lastAutoTable.finalY + 15);
  doc.text(`Remaining: ${total - purchased}`, 20, doc.lastAutoTable.finalY + 20);
  doc.text(`Total Spent: ₹${totalSpent.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 25);

  // Save the PDF
  doc.save(`${list.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};