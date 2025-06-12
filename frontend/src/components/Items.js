import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { deleteExpense } from '../utils/renders';

function Items({ data: exp }) {
  function getDate() {
    let dater = new Date(Date.parse(exp.date));
    return dater.toDateString().substring(4, 10); // e.g., "Jun 12"
  }

  const handleDelete = () => {
    const datar = {
      expenseId: exp._id,
      userId: exp.usersid,
    };
    deleteExpense(datar);
  };

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/10 backdrop-blur-md text-white p-5 flex flex-col gap-4 shadow-md transition-all duration-300 hover:scale-[1.01]">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-2xl font-bold tracking-wide">₹ {exp.amount}</p>
        <span className="text-sm bg-white text-black font-semibold px-3 py-1 rounded-full shadow">
          {getDate()}
        </span>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <span className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {exp.category}
        </span>

        <button
          onClick={handleDelete}
          className="relative inline-flex items-center justify-center p-2 text-red-500 hover:text-white border border-red-500 rounded-md transition duration-300 group overflow-hidden"
        >
          <span className="absolute inset-0 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          <AiFillDelete className="relative z-10" />
        </button>
      </div>
    </div>
  );
}

export default Items;
