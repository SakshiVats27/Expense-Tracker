import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BsSendFill } from 'react-icons/bs';
import { sendEmail } from '../utils/renders';
import LoadingBar from 'react-top-loading-bar';

function NavBar({ data }) {
  const [isPressed, setIsPressed] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const ref = useRef(null);
  const navigate = useNavigate();

  const logoutHandle = async () => {
    try {
      ref.current.staticStart();
      localStorage.removeItem('User');
      toast.success('Logout Successfully!!');
      ref.current.complete();
      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="w-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl">
      <LoadingBar color="#f97316" ref={ref} />
      
      <div className="flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <h1 className="text-4xl font-bold text-white font-Handjet tracking-wider">
          <span className="text-yellow-400">Expense</span> Tracker
        </h1>

        {/* Email Button & Popup */}
        <div className="relative">
          <button
            onClick={() => setIsPressed(!isPressed)}
            className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-600 transition-all duration-300 shadow-md"
          >
            Send Report
          </button>

          {isPressed && (
            <div className="absolute top-14 right-0 bg-white/20 backdrop-blur-md p-5 rounded-xl w-80 border border-purple-200 shadow-xl z-50 transition-all duration-300">
              <button
                onClick={() => setIsPressed(false)}
                className="absolute top-2 right-2 text-white text-sm bg-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
              <div className="flex flex-col gap-3 mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="p-3 rounded-lg outline-none w-full text-sm"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <button
                  onClick={() => sendEmail(userEmail, data)}
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                >
                  <BsSendFill /> Send
                </button>
              </div>
              <p className="text-white text-xs mt-2 text-center">
                * Get your monthly expenses in email
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logoutHandle}
          className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-indigo-600 border-2 border-purple-500 rounded-full group transition duration-300"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white bg-purple-600 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0 ease-in-out">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">
            Logout
          </span>
          <span className="relative invisible">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default NavBar;
