import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BsSendFill, BsXLg } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { sendEmail } from '../utils/renders';
import LoadingBar from 'react-top-loading-bar';

function NavBar({ data }) {
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const ref = useRef(null);
  const navigate = useNavigate();

  const logoutHandle = async () => {
    try {
      ref.current.staticStart();
      localStorage.removeItem('User');
      toast.success('Logout Successful!');
      ref.current.complete();
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSendEmail = async () => {
    if (!userEmail) {
      toast.error('Please enter a valid email');
      return;
    }
    try {
      await sendEmail(userEmail, data);
      toast.success('Report sent successfully!');
      setIsEmailOpen(false);
      setUserEmail('');
    } catch (error) {
      toast.error('Failed to send report');
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-dark to-gray-800 shadow-md">
      <LoadingBar color="#FACC15" ref={ref} />
      
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo - Always visible */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-handjet tracking-wide">
            <span className="text-secondary">Expense</span> Tracker
          </h1>

          {/* Mobile Menu Button - Only shows on small screens */}
          <div className="md:hidden flex items-center gap-4 w-full justify-between">
            <button
              onClick={() => setIsEmailOpen(!isEmailOpen)}
              className="px-4 py-1.5 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors"
            >
              Report
            </button>
            
            <button
              onClick={logoutHandle}
              className="flex items-center gap-1 text-sm text-white bg-transparent border border-white/30 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors"
            >
              <FiLogOut className="text-xs" /> Logout
            </button>
          </div>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {/* Email Report Button */}
            <div className="relative">
              <button
                onClick={() => setIsEmailOpen(!isEmailOpen)}
                className="px-5 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors text-sm sm:text-base"
              >
                Send Report
              </button>

              {isEmailOpen && (
                <div className="absolute top-12 right-0 bg-gray-800 p-4 rounded-lg w-72 border border-gray-600 shadow-xl z-50">
                  <button
                    onClick={() => setIsEmailOpen(false)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <BsXLg />
                  </button>
                  <div className="flex flex-col gap-3 mt-1">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="p-2.5 rounded-lg bg-gray-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <button
                      onClick={handleSendEmail}
                      className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-dark font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      <BsSendFill /> Send
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-2 text-center">
                    * Get your monthly expenses report
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutHandle}
              className="flex items-center gap-2 text-white bg-transparent border border-white/30 rounded-full px-5 py-2 hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;