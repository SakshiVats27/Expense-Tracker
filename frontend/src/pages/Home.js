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

  // Function to fetch user expenses
  const fetchExpenses = useCallback(async () => {
    const data = await getUserExpenses(userData._id);
    setUserExp(data);
  }, [userData._id]);

  // Redirect if not logged in and fetch user data
  useEffect(() => {
    if (!userData) {
      navigate('/login');
      return;
    }
    fetchExpenses();
  }, [navigate, userData, fetchExpenses]);

  const getTotal = () => {
    return userExp.reduce((sum, item) => sum + item.amount, 0);
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
    <div className="h-screen font-mont w-full bg-zinc-900">
      <LoadingBar color="orange" ref={ref} />
      <NavBar data={userExp} />

      {/* Feed */}
      <div className="Feed w-4/5 left-[calc(100%-90%)] relative h-[calc(100%-6rem)] flex">
        {/* Left: Chart */}
        <div className="leftbox w-1/2 h-full p-6">
          <Chartss exdata={userExp} />
        </div>

        {/* Right: Create + List */}
        <div className="rightbox flex flex-col gap-10 items-center w-1/2">
          {/* Create Transaction */}
          <div className="createnew bg-gray-800 rounded-3xl p-10 pt-6 pb-6 flex flex-col justify-center items-center gap-2 relative top-5">
            <div className="font-bold text-3xl text-white">Create Transaction</div>
            <div className="flex flex-row gap-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Amount"
                className="h-12 text-base placeholder-black p-4 rounded-xl outline-none focus:focus-animation"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl p-2.5 focus:focus-animation"
              >
                <option value="">--Select--</option>
                <option value="Grocery">Grocery</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Shopping">Shopping</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Fun">Fun</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-flow-col w-full gap-4 mt-2">
              <DatePicker
                selected={selectDate}
                onChange={(date) => setSelectedDate(date)}
                className="p-3 placeholder-black w-full rounded-xl outline-none bg-white px-4 text-black"
                placeholderText="Date"
                showYearDropdown
              />
              <button
                onClick={handleCreateExpense}
                className="relative text-center w-full rounded-xl px-5 py-2 overflow-hidden group bg-gray-800 border-2 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-600 text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-600 transition-all ease-out duration-300"
              >
                <span className="absolute right-0 w-8 h-10 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                <span className="relative font-bold text-2xl">+</span>
              </button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="w-5/6 p-7 relative rounded-xl h-auto border-white border-2 grid gap-7 overflow-y-scroll max-h-[400px]">
            <div className="text-3xl text-white font-bold">Total Expense: ₹ {getTotal()}</div>
            <div className="grid grid-cols-2 listrr gap-7">
              {userExp.map((item) => (
                <Items key={item._id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
