import React from 'react';

function FilterBar({ filters, setFilters }) {
  return (
    <div className="bg-white/5 rounded-2xl p-3 sm:p-4 mb-6 backdrop-blur-sm border border-white/10 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 items-end">
      <div className="space-y-1 xs:col-span-2 lg:col-span-2 xl:col-span-2 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Search Tags/Notes</label>
        <input 
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          placeholder="Search..."
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">From</label>
        <input
          type="date"
          value={filters.from || ''}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">To</label>
        <input
          type="date"
          value={filters.to || ''}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Type</label>
        <select 
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none appearance-none"
        >
          <option value="all" className="bg-dark">All Types</option>
          <option value="expense" className="bg-dark">Expense</option>
          <option value="income" className="bg-dark">Income</option>
        </select>
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Category</label>
        <select 
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none appearance-none"
        >
          <option value="all" className="bg-dark">All Categories</option>
          <option value="Salary" className="bg-dark">Salary</option>
          <option value="Freelance" className="bg-dark">Freelance</option>
          <option value="Investment" className="bg-dark">Investment</option>
          <option value="Gift" className="bg-dark">Gift</option>
          <option value="Grocery" className="bg-dark">Grocery</option>
          <option value="Vehicle" className="bg-dark">Vehicle</option>
          <option value="Shopping" className="bg-dark">Shopping</option>
          <option value="Travel" className="bg-dark">Travel</option>
          <option value="Food" className="bg-dark">Food</option>
          <option value="Fun" className="bg-dark">Fun</option>
          <option value="Rent" className="bg-dark">Rent</option>
          <option value="Bills" className="bg-dark">Bills</option>
          <option value="Other" className="bg-dark">Other</option>
        </select>
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Account</label>
        <select 
          value={filters.account}
          onChange={(e) => setFilters({...filters, account: e.target.value})}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none appearance-none"
        >
          <option value="all" className="bg-dark">All Accounts</option>
          <option value="Cash" className="bg-dark">Cash</option>
          <option value="Bank" className="bg-dark">Bank</option>
          <option value="Wallet" className="bg-dark">Wallet</option>
          <option value="Credit card" className="bg-dark">Credit card</option>
        </select>
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Min (Rs.)</label>
        <input
          type="number"
          value={filters.minAmount || ''}
          onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
          placeholder="0"
        />
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Max (Rs.)</label>
        <input
          type="number"
          value={filters.maxAmount || ''}
          onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
          placeholder="Any"
        />
      </div>

      {/* Sorting Controls */}
      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Sort By</label>
        <select 
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none appearance-none"
        >
          <option value="date" className="bg-dark">Date</option>
          <option value="amount" className="bg-dark">Amount</option>
        </select>
      </div>

      <div className="space-y-1 min-w-0">
        <label className="text-[10px] text-gray-500 uppercase ml-1">Order</label>
        <select 
          value={filters.sortOrder}
          onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
          className="w-full min-w-0 p-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none appearance-none"
        >
          <option value="desc" className="bg-dark">Descending</option>
          <option value="asc" className="bg-dark">Ascending</option>
        </select>
      </div>

      <button 
        onClick={() => setFilters({search: '', type: 'all', category: 'all', account: 'all', from: '', to: '', minAmount: '', maxAmount: '', sortBy: 'date', sortOrder: 'desc'})}
        className="h-10 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary/20 xs:col-span-2 lg:col-span-1"
      >
        Reset
      </button>
    </div>
  );
}

export default FilterBar;
