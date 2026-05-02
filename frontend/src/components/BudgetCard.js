import React, { useState, useEffect } from 'react';
import { getBudget, updateBudget } from '../utils/renders';

function BudgetCard({ expenses, monthSpent }) {
  const [budget, setBudget] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tempTotal, setTempTotal] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBudget();
  }, [expenses]);

  const totalSpent = typeof monthSpent === 'number'
    ? monthSpent
    : (expenses || []).filter(exp => {
        const date = new Date(exp.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && exp.type === 'expense';
      }).reduce((sum, exp) => sum + exp.amount, 0);
  const percentage = budget?.totalBudget > 0 ? Math.min((totalSpent / budget.totalBudget) * 100, 100) : 0;

  const getStatusLabel = () => {
    if (percentage >= 100) return { text: "Budget Exceeded", color: "text-red-500" };
    if (percentage >= 90) return { text: "High Usage", color: "text-red-400" };
    if (percentage >= 70) return { text: "Approaching Limit", color: "text-yellow-400" };
    return { text: "Healthy Spending", color: "text-green-400" };
  };

  const status = getStatusLabel();

  const fetchBudget = async () => {
    const data = await getBudget();
    if (data) {
      setBudget(data);
      setTempTotal(data.totalBudget || 0);
    }
  };

  const handleUpdate = async () => {
    const nextTotal = Number(tempTotal);
    if (!Number.isFinite(nextTotal) || nextTotal < 0) return;

    setIsSaving(true);
    const data = { 
        totalBudget: nextTotal, 
        categoryBudgets: [] 
    };

    try {
      const updatedData = await updateBudget(data);
      if (updatedData) {
          setBudget(updatedData);
          setTempTotal(updatedData.totalBudget);
          setShowModal(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4 sm:p-6 backdrop-blur-sm border border-white/10 min-w-0">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">Monthly Budget</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full xs:w-auto text-xs bg-primary/20 text-primary border border-primary/30 px-3 py-2 xs:py-1 rounded-full hover:bg-primary/30 transition-all"
        >
          Set Budget
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col xs:flex-row xs:justify-between gap-1 text-sm mb-1">
          <span className="text-gray-400">Total Spent: Rs. {totalSpent}</span>
          <span className="text-white font-bold">Rs. {budget?.totalBudget || 0}</span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <p className="text-xs text-center text-gray-500">
          {percentage.toFixed(1)}% of your monthly budget used - <span className={`font-bold ${status.color}`}>{status.text}</span>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-dark border border-white/20 p-5 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-white text-center">Set Monthly Limit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Maximum Spending (Rs.)</label>
                <input 
                  type="number" 
                  value={tempTotal}
                  onChange={(e) => setTempTotal(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-primary text-xl font-bold"
                  placeholder="Enter amount"
                />
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="py-3 px-4 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetCard;
