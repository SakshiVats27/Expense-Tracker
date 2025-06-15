import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { deleteExpense } from '../utils/renders';

function Items({ data: exp, onDeleteSuccess }) {
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDelete = async () => {
    try {
      const datar = {
        expenseId: exp._id,
        userId: exp.usersid,
      };
      await deleteExpense(datar);
      toast.success('Expense deleted successfully');
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error('Delete error:', error);
    }
  };

  // Category color mapping
  const categoryColors = {
    Grocery: 'bg-emerald-100 text-emerald-800',
    Vehicle: 'bg-blue-100 text-blue-800',
    Shopping: 'bg-purple-100 text-purple-800',
    Travel: 'bg-amber-100 text-amber-800',
    Food: 'bg-rose-100 text-rose-800',
    Fun: 'bg-fuchsia-100 text-fuchsia-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  const categoryClass = categoryColors[exp.category] || categoryColors.Other;

  return (
    <div className="w-full rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start gap-2 mb-3">
        <p className="text-xl font-bold text-white">₹{exp.amount.toLocaleString()}</p>
        <span className="text-xs font-medium bg-white/10 text-white/80 px-2 py-1 rounded-full">
          {formatDate(exp.date)}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryClass}`}>
          {exp.category}
        </span>

        <button
          onClick={handleDelete}
          aria-label="Delete expense"
          className="group relative p-1.5 rounded-md hover:bg-red-500/20 transition-colors duration-200"
        >
          <AiFillDelete className="text-red-400 group-hover:text-red-500 text-lg" />
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}

export default Items;