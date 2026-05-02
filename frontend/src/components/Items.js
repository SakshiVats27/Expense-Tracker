import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { deleteExpense } from '../utils/renders';

const DELETE_UNDO_MS = 5000;

function Items({ data: exp, onDeleteSuccess }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const deleteTimeoutRef = useRef(null);

  const performDelete = useCallback(async () => {
    try {
      await deleteExpense({ expenseId: exp._id });
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      setIsPendingDelete(false);
      toast.error(error.message || 'Failed to delete transaction');
    } finally {
      setIsDeleting(false);
      deleteTimeoutRef.current = null;
    }
  }, [exp._id, onDeleteSuccess]);

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDelete = async () => {
    if (isDeleting || isPendingDelete) return;

    setShowConfirm(false);
    setIsDeleting(true);
    setIsPendingDelete(true);

    deleteTimeoutRef.current = setTimeout(performDelete, DELETE_UNDO_MS);
  };

  const handleUndoDelete = () => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
    }

    setIsDeleting(false);
    setIsPendingDelete(false);
  };

  const handleDismissUndo = () => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }
    performDelete();
  };

  const categoryColors = {
    Salary: 'bg-green-100 text-green-800',
    Freelance: 'bg-emerald-100 text-emerald-800',
    Investment: 'bg-blue-100 text-blue-800',
    Gift: 'bg-indigo-100 text-indigo-900',
    Grocery: 'bg-orange-100 text-orange-800',
    Vehicle: 'bg-indigo-100 text-indigo-800',
    Shopping: 'bg-pink-100 text-pink-800',
    Travel: 'bg-cyan-100 text-cyan-800',
    Food: 'bg-rose-100 text-rose-800',
    Fun: 'bg-fuchsia-100 text-fuchsia-800',
    Rent: 'bg-violet-100 text-violet-800',
    Bills: 'bg-red-100 text-red-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  const categoryClass = categoryColors[exp.category] || categoryColors.Other;

  if (isPendingDelete) {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 px-3 sm:px-4">
        <div className="relative w-full max-w-md rounded-xl border border-emerald-400/25 bg-slate-900 p-4 sm:p-5 shadow-2xl shadow-black/40 overflow-hidden">
          {/* Progress Bar Timer */}
          <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 animate-undo-timer" />
          
          <button
            onClick={handleDismissUndo}
            className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
            aria-label="Dismiss and delete now"
          >
            <FiX size={20} />
          </button>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pr-8">
            <div>
              <p className="text-lg font-semibold text-white">Transaction deleted</p>
              <p className="mt-1 text-sm text-slate-300">
                You can undo this action for the next 5 seconds.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600"
              onClick={handleUndoDelete}
            >
              Undo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start gap-2 mb-2">
        <p className={`min-w-0 break-words text-lg sm:text-xl font-bold ${exp.type === 'income' ? 'text-green-400' : 'text-white'}`}>
          {exp.type === 'income' ? '+' : '-'} Rs. {exp.amount.toLocaleString()}
        </p>
        <span className="text-xs font-medium bg-white/10 text-white/80 px-2 py-1 rounded-full">
          {formatDate(exp.date)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${categoryClass}`}>
          {exp.category}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300">
          {exp.account || 'Cash'}
        </span>
      </div>

      {exp.notes && (
        <p className="text-sm text-gray-300 mb-3 line-clamp-1">
          <span className="text-gray-500 mr-1">Note:</span> {exp.notes}
        </p>
      )}

      {exp.tags && exp.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {exp.tags.map((tag, index) => (
            <span key={index} className="text-[10px] bg-white/10 text-white border border-white/10 px-2 py-0.5 rounded font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-white/10">
        <button
          onClick={() => setShowConfirm(true)}
          aria-label="Delete transaction"
          className="group relative p-1.5 rounded-md hover:bg-red-500/20 transition-colors duration-200"
        >
          <AiFillDelete className="text-red-400 group-hover:text-red-500 text-lg" />
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-lg border border-white/10 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Delete transaction?</h3>
            <p className="mt-2 text-sm text-slate-300">
              This will permanently remove the {exp.category} transaction for Rs. {exp.amount.toLocaleString()}.
            </p>
            <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Items;
