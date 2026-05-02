import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Items from '../components/Items';
import { Chartss } from '../components/Chartss';
import BudgetCard from '../components/BudgetCard';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LoadingBar from 'react-top-loading-bar';
import { toast } from 'react-hot-toast';
import { createExpense, getExpensesPage, getTotalsSummary, getCategorySummary } from '../utils/renders';
import NavBar from '../components/NavBar';
import FilterBar from '../components/FilterBar';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';
import { AiOutlineFilePdf, AiOutlineFileExcel } from 'react-icons/ai';
import AnalyticsDashboard from '../components/AnalyticsDashboard';



function Home() {
  const navigate = useNavigate();
  const [selectDate, setSelectedDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const [account, setAccount] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [quickEntry, setQuickEntry] = useState('');
  const [quickEntryError, setQuickEntryError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('Monthly');
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    account: 'all',
    from: '',
    to: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date', // Default sort by date
    sortOrder: 'desc' // Default to newest first
  });
  const [userData] = useState(JSON.parse(localStorage.getItem('User')));
  const [listExp, setListExp] = useState([]);
  const [listPage, setListPage] = useState(1);
  const [listHasMore, setListHasMore] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [totals, setTotals] = useState({ income: 0, expense: 0, net: 0 });
  const [categorySummary, setCategorySummary] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const ref = useRef(null);
  const sentinelRef = useRef(null);

  document.title = 'Home';



  useEffect(() => {
    if (!userData) {
      navigate('/login');
      return;
    }
  }, [navigate, userData]);

  const buildQueryParams = useCallback((page) => {
    const queryParams = {
      page,
      limit: 20,
      search: filters.search?.trim() || undefined,
      type: filters.type !== 'all' ? filters.type : undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
      account: filters.account !== 'all' ? filters.account : undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      minAmount: filters.minAmount !== '' ? filters.minAmount : undefined,
      maxAmount: filters.maxAmount !== '' ? filters.maxAmount : undefined,
    };

    // Add sorting parameters if they are not the default values
    // Default is sortBy: 'date', sortOrder: 'desc'
    if (filters.sortBy && filters.sortBy !== 'date') {
      queryParams.sortBy = filters.sortBy;
    }
    // Pass sortOrder only if it's not the default 'desc' when sortBy is 'date',
    // or if sortBy is not 'date' (meaning a custom sort is selected)
    if (filters.sortOrder && (filters.sortBy !== 'date' || filters.sortOrder !== 'desc')) {
      queryParams.sortOrder = filters.sortOrder;
    }
    
    // Clean up undefined values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });

    return queryParams;

  }, [filters]);

  const refreshSummaries = useCallback(async () => {
    try {
      const params = buildQueryParams(1);
      const [totalsData, summaryData] = await Promise.all([
        getTotalsSummary(params),
        getCategorySummary({ type: 'expense' }),
      ]);
      if (totalsData) setTotals(totalsData);
      if (Array.isArray(summaryData)) setCategorySummary(summaryData);
    } catch (error) {
      toast.error(error.message || "Could not refresh dashboard totals");
    }
  }, [buildQueryParams]);

  const loadFirstPage = useCallback(async () => {
    setListLoading(true);
    try {
      const params = buildQueryParams(1);
      const data = await getExpensesPage(params);
      setListExp(data?.items || []);
      setListPage(1);
      setListHasMore(Boolean(data?.hasMore));
    } catch (error) {
      toast.error(error.message || "Could not load transactions");
    } finally {
      setListLoading(false);
    }
  }, [buildQueryParams]);

  const loadNextPage = useCallback(async () => {
    if (listLoading || !listHasMore) return;
    const nextPage = listPage + 1;
    setListLoading(true);
    try {
      const params = buildQueryParams(nextPage);
      const data = await getExpensesPage(params);
      
      setListExp(prev => {
        const existingIds = new Set(prev.map(item => item._id));
        const uniqueNewItems = (data?.items || []).filter(item => !existingIds.has(item._id));
        return [...prev, ...uniqueNewItems];
      });

      setListPage(nextPage);
      setListHasMore(Boolean(data?.hasMore));
    } catch (error) {
      toast.error(error.message || "Could not load more transactions");
    } finally {
      setListLoading(false);
    }
  }, [buildQueryParams, listHasMore, listLoading, listPage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadFirstPage();
      refreshSummaries();
    }, 250);
    return () => clearTimeout(timeout);
  }, [filters, refreshKey, loadFirstPage, refreshSummaries]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNextPage();
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadNextPage]);
  

  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
  const expenseCategories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Rent', 'Bills', 'Other'];

  const categoriesToDisplay = type === 'income' ? incomeCategories : expenseCategories;

const parseQuickExpense = () => {
    const cleaned = quickEntry
      .trim()
      .replace(/^\+\s*/, '')
      .replace(/^(rs\.?|inr|₹)\s*/i, '');
    const match = cleaned.match(/^(\d+(?:\.\d{1,2})?)\s+(.+)$/);

    if (!match) {
      return {
        error: "Use format like: + 250 Food"
      };
    }

    const amountValue = Number(match[1]);
    const categoryText = match[2].trim().toLowerCase();
    const matchedCategory = expenseCategories.find(cat => cat.toLowerCase() === categoryText);

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      return { error: "Amount must be greater than zero" };
    }

    if (!matchedCategory) {
      return { error: `Category must be one of: ${expenseCategories.join(', ')}` };
    }

    return {
      amount: amountValue,
      category: matchedCategory
    };
};

const handleQuickAddExpense = async () => {
    if (isSubmittingExpense) return;

    const parsed = parseQuickExpense();
    if (parsed.error) {
      setQuickEntryError(parsed.error);
      toast.error("Check your quick add entry");
      return;
    }

    setQuickEntryError('');
    setIsSubmittingExpense(true);
    ref.current.staticStart();

    try {
      await createExpense({
        amount: parsed.amount,
        category: parsed.category,
        date: new Date(),
        type: 'expense',
        account,
        notes: '',
        tags: ['quick-add'],
        isRecurring: false,
        recurringFrequency: frequency
      });
      toast.success("Expense added");
      setQuickEntry('');
      setRefreshKey((k) => k + 1);
      ref.current.complete();
    } catch (error) {
      toast.error(error.message || "Could not add expense");
      ref.current.complete();
    } finally {
      setIsSubmittingExpense(false);
    }
};

  const groupedTransactions = useMemo(() => {
    return listExp.reduce((groups, item) => {
      const date = new Date(item.date);
      const label = Number.isNaN(date.getTime())
        ? 'Unknown Date'
        : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!groups[label]) groups[label] = [];
      groups[label].push(item);
      return groups;
    }, {});
  }, [listExp]);

const validateTransaction = () => {
    const errors = {};
    const numericAmount = Number(amount);
    const parsedDate = selectDate ? new Date(selectDate) : null;

    if (amount === '') {
        errors.amount = "Amount is required";
    } else if (!Number.isFinite(numericAmount)) {
        errors.amount = "Amount must be a valid number";
    } else if (numericAmount <= 0) {
        errors.amount = "Amount cannot be zero or negative";
    }

    if (!category) {
        errors.category = "Category is required";
    }

    if (!selectDate) {
        errors.date = "Date is required";
    } else if (Number.isNaN(parsedDate.getTime())) {
        errors.date = "Please choose a valid date";
    }

    if (notes.length > 160) {
        errors.notes = "Notes must be 160 characters or less";
    }

    const tagList = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    if (tagList.some(tag => tag.length > 24)) {
        errors.tags = "Each tag must be 24 characters or less";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
};

const handleCreateExpense = async () => {
    if (isSubmittingExpense) return;

    if (!validateTransaction()) {
        toast.error("Please fix the highlighted fields");
        return;
    }

    const numericAmount = Number(amount);

    setIsSubmittingExpense(true);
    ref.current.staticStart();

    const expInfo = { 
      category, 
      date: selectDate, 
      amount: numericAmount, 
      type, 
      account, 
      notes, 
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      isRecurring,
      recurringFrequency: frequency
    };

    try {
      await createExpense(expInfo);
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added`);
        setRefreshKey((k) => k + 1);
        setAmount('');
        setCategory('');
        setSelectedDate('');
        setNotes('');
        setTags('');
        setFormErrors({});
        setIsRecurring(false);
        ref.current.complete();
    } catch (error) {
      toast.error(error.message || "Could not add transaction");
      ref.current.complete();
    } finally {
      setIsSubmittingExpense(false);
    }
};


  return (
      <div className="min-h-screen font-mont bg-dark text-light">
      <LoadingBar color="#FACC15" ref={ref} />
      <NavBar />

      {/* Main Content */}
      <main className="w-full min-h-screen overflow-x-hidden bg-slate-950 px-3 py-4 sm:p-5 md:p-6 lg:p-8">
        {/* Dashboard Grid - Sidebar (350px) + Main Content (Fluid) */}
        <div className="dashboard-layout grid grid-cols-1 xl:grid-cols-[minmax(0,350px),minmax(0,1fr)] gap-4 sm:gap-6 max-w-[1400px] mx-auto">
          
          {/* Left Panel - Budget & Chart */}
          <div className="flex min-w-0 flex-col gap-4 sm:gap-6 w-full">
            <BudgetCard monthSpent={totals.expense} expenses={[]} />
            <div className="w-full">
              <Chartss categorySummary={categorySummary} exdata={[]} />
            </div>
          </div>

          {/* Right Panel - Transactions Form & List */}
          <div className="flex min-w-0 flex-col gap-4 sm:gap-6 w-full">
            {/* Create Transaction Card */}
            <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-center text-white">Add Transaction</h2>
              <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr,auto]">
                  <input
                    type="text"
                    value={quickEntry}
                    onChange={(e) => {
                      setQuickEntry(e.target.value);
                      if (quickEntryError) setQuickEntryError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuickAddExpense();
                      }
                    }}
                    placeholder="+ 250 Food"
                    className={`w-full min-w-0 rounded-lg bg-white/10 border ${quickEntryError ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary'} p-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2`}
                  />
                  <button
                    type="button"
                    onClick={handleQuickAddExpense}
                    disabled={isSubmittingExpense}
                    className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Quick Add
                  </button>
                </div>
                {quickEntryError && (
                  <p className="mt-2 text-xs text-red-400">{quickEntryError}</p>
                )}
              </div>
              
              {/* Type Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-slate-800 p-1 rounded-xl flex w-full max-w-[300px]">
                  <button 
                    onClick={() => { setType('expense'); setCategory(''); }}
                    className={`flex-1 py-2 px-3 sm:px-4 rounded-lg transition-all ${type === 'expense' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Expense
                  </button>
                  <button 
                    onClick={() => { setType('income'); setCategory(''); }}
                    className={`flex-1 py-2 px-3 sm:px-4 rounded-lg transition-all ${type === 'income' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* ... (keep form fields, just ensure they are responsive) */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Amount <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (formErrors.amount) setFormErrors(prev => ({ ...prev, amount: '' }));
                    }}
                    placeholder="0"
                    className={`w-full min-w-0 p-3 rounded-lg bg-white/10 border ${formErrors.amount ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary'} focus:outline-none focus:ring-2 text-white`}
                  />
                  {formErrors.amount && <p className="text-xs text-red-400">{formErrors.amount}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Category <span className="text-red-500">*</span></label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      if (formErrors.category) setFormErrors(prev => ({ ...prev, category: '' }));
                    }}
                    className={`w-full min-w-0 p-3 rounded-lg bg-white/10 border ${formErrors.category ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary'} focus:outline-none focus:ring-2 text-white`}
                  >
                    <option value="" className="bg-dark text-white">--Select--</option>
                    {categoriesToDisplay.map(cat => (
                      <option key={cat} value={cat} className="bg-dark text-white">{cat}</option>
                    ))}
                  </select>
                  {formErrors.category && <p className="text-xs text-red-400">{formErrors.category}</p>}
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Account</label>
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full min-w-0 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  >
                    <option value="Cash" className="bg-dark text-white">Cash</option>
                    <option value="Bank" className="bg-dark text-white">Bank</option>
                    <option value="Wallet" className="bg-dark text-white">Wallet</option>
                    <option value="Credit card" className="bg-dark text-white">Credit card</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    selected={selectDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      if (formErrors.date) setFormErrors(prev => ({ ...prev, date: '' }));
                    }}
                    wrapperClassName="w-full"
                    className={`w-full min-w-0 p-3 rounded-lg bg-white/10 border ${formErrors.date ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary'} focus:outline-none focus:ring-2 text-white`}
                    placeholderText="Select Date"
                    showYearDropdown
                    popperPlacement="bottom-start"
                    portalId="calendar-portal"
                  />
                  {formErrors.date && <p className="text-xs text-red-400">{formErrors.date}</p>}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex flex-col gap-3 p-3 bg-white/5 rounded-lg border border-white/10 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="recurring" className="text-sm text-white cursor-pointer flex items-center gap-1">
                      Set as Recurring
                      <span 
                        title="Automatic tracking for regular payments like Rent or Netflix. The app will log these for you automatically."
                        className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center cursor-help"
                      >?</span>
                    </label>
                  </div>
                  
                  {isRecurring && (
                    <select 
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full min-w-0 rounded-lg bg-slate-900/80 p-2 text-sm text-primary focus:outline-none sm:flex-1 sm:bg-transparent sm:p-0"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => {
                      setTags(e.target.value);
                      if (formErrors.tags) setFormErrors(prev => ({ ...prev, tags: '' }));
                    }}
                    placeholder="e.g. food, holiday, office"
                    className={`w-full min-w-0 p-3 rounded-lg bg-white/10 border ${formErrors.tags ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary'} focus:outline-none focus:ring-2 text-white`}
                  />
                  {formErrors.tags && <p className="text-xs text-red-400">{formErrors.tags}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 ml-1">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      if (formErrors.notes) setFormErrors(prev => ({ ...prev, notes: '' }));
                    }}
                    placeholder="Description..."
                    rows="2"
                    maxLength={160}
                    className={`w-full min-w-0 p-3 rounded-lg bg-white/10 border ${formErrors.notes ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-primary'} focus:outline-none focus:ring-2 text-white`}
                  />
                  <div className="flex justify-between gap-3">
                    {formErrors.notes ? (
                      <p className="text-xs text-red-400">{formErrors.notes}</p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-gray-500">{notes.length}/160</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateExpense}
                disabled={isSubmittingExpense}
                className={`w-full ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary-dark'} text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isSubmittingExpense ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <span className="text-2xl">+</span>
                    <span>Add {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Transactions List */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 mt-2 sm:mt-4 min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold break-words">Net Balance: Rs. {Math.round(totals.net || 0)}</h2>
                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                  <button 
                    onClick={() => exportToPDF(listExp, Math.round(totals.net || 0))}
                    className="flex items-center justify-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 sm:py-1.5 rounded-lg text-xs hover:bg-red-500/30 transition-all"
                  >
                    <AiOutlineFilePdf size={16} /> PDF
                  </button>
                  <button 
                    onClick={() => exportToCSV(listExp)}
                    className="flex items-center justify-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-2 sm:py-1.5 rounded-lg text-xs hover:bg-green-500/30 transition-all"
                  >
                    <AiOutlineFileExcel size={16} /> CSV
                  </button>
                </div>
              </div>

              <AnalyticsDashboard refreshTrigger={refreshKey} />
              
              <FilterBar filters={filters} setFilters={setFilters} />

              <div className="space-y-6 sm:max-h-[500px] overflow-visible sm:overflow-y-auto sm:pr-2">
                {Object.entries(groupedTransactions).map(([month, transactions]) => (
                  <section key={month} className="min-w-0">
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="shrink-0 text-sm font-semibold uppercase tracking-wider text-slate-300">
                        {month}
                      </h3>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {transactions.map((item) => (
                        <Items
                          key={item._id}
                          data={item}
                          onDeleteSuccess={() => setRefreshKey((k) => k + 1)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
                <div ref={sentinelRef} />
              </div>
              {listLoading && listExp.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
                      <div className="flex justify-between mb-4">
                        <div className="h-6 w-28 rounded bg-white/10" />
                        <div className="h-5 w-16 rounded-full bg-white/10" />
                      </div>
                      <div className="mb-4 flex gap-2">
                        <div className="h-5 w-20 rounded bg-white/10" />
                        <div className="h-5 w-16 rounded bg-white/10" />
                      </div>
                      <div className="h-4 w-3/4 rounded bg-white/10" />
                    </div>
                  ))}
                </div>
              )}
              {listLoading && listExp.length > 0 && (
                <p className="text-center text-gray-500 py-6">Loading more transactions...</p>
              )}
              {!listLoading && listExp.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-10 text-center">
                  <p className="text-lg font-semibold text-white">No expenses yet. Add your first expense.</p>
                  <p className="mt-2 text-sm text-gray-400">Adjust your filters or add your first transaction above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
