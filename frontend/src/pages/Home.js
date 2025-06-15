import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Items from '../components/Items';
import { Chartss } from '../components/Chartss';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LoadingBar from 'react-top-loading-bar';
import { createExpense, getUserExpenses } from '../utils/renders';
import NavBar from '../components/NavBar';



function Home() {
  const navigate = useNavigate();
  const [selectDate, setSelectedDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [userData] = useState(JSON.parse(localStorage.getItem('User')));
  const [userExp, setUserExp] = useState([]);
  const ref = useRef(null);

  document.title = 'Home';

  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);



const fetchExpenses = useCallback(async () => {
  try {
    setLoading(true);
    const data = await getUserExpenses(userData._id);
    setUserExp(data || []); // Ensure array
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [userData._id]);



  useEffect(() => {
    if (!userData) {
      navigate('/login');
      return;
    }
    fetchExpenses();
  }, [navigate, userData, fetchExpenses]);

  const getTotal = () => {
  return (userExp || []).reduce((sum, item) => sum + (item?.amount || 0), 0);
};
  

  const handleCreateExpense = () => {
    if (!amount || !category || !selectDate) return;

    const expInfo = {
      usersid: userData._id,
      category,
      date: selectDate,
      amount
    };

    ref.current.staticStart();
    createExpense(expInfo).then(() => {
      fetchExpenses();
      setAmount(0);
      setCategory('');
      setSelectedDate('');
      ref.current.complete();
    });
  };

  return (
    <div className="min-h-screen font-mont bg-dark text-light">
      <LoadingBar color="#FACC15" ref={ref} />
      <NavBar data={userExp} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="lg:sticky lg:top-8 h-full">
            <div className="bg-white/10 rounded-2xl p-6 h-full">
              <Chartss exdata={userExp} />
            </div>
          </div>

          {/* Transaction Section */}
          <div className="space-y-8">
            {/* Create Transaction Card */}
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 text-center">Create Transaction</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Amount"
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary text-dark"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-lg bg-purple/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary text-dark"
                >
                  <option value="">--Select Category--</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Food">Food</option>
                  <option value="Fun">Fun</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="relative w-full">
              
                <DatePicker
                  selected={selectDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary text-white"
                  placeholderText="Select Date"
                  showYearDropdown
                  popperPlacement="bottom-start"
  portalId="calendar-portal"
                  
    />
                 </div>
                <button
                  onClick={handleCreateExpense}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 "
                >
                  <span className="text-2xl">+</span>
                  <span>Add Expense</span>
                </button>
              </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white/5 rounded-2xl p-6 mt-4">
              <h2 className="text-2xl font-bold mb-6">Total Expense: ₹ {getTotal()}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {userExp.map((item) => (
                  <Items key={item._id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    
  );
}

export default Home;