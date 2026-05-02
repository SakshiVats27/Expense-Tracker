import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiLogOut } from 'react-icons/fi';
import LoadingBar from 'react-top-loading-bar';

function NavBar({ data }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  const logoutHandle = async () => {
    try {
      ref.current.staticStart();
      localStorage.removeItem('User');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      toast.success('Logout successful');
      ref.current.complete();
      setTimeout(() => navigate('/login'), 650);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="w-full bg-gradient-to-r from-dark to-gray-800 shadow-md">
      <LoadingBar color="#FACC15" ref={ref} />
      
      <div className="mx-auto w-full max-w-[1400px] px-3 sm:px-6 py-3">
        <div className="flex flex-row justify-between items-center gap-3">
          {/* Logo - Always visible */}
          <h1 className="min-w-0 text-xl xs:text-2xl sm:text-3xl font-bold text-white font-handjet tracking-wide leading-none">
            <span className="text-secondary">Expense</span> Tracker
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={logoutHandle}
              className="flex shrink-0 items-center gap-2 text-white bg-transparent border border-white/30 rounded-full px-3 py-2 sm:px-5 hover:bg-white/10 transition-colors text-sm sm:text-base"
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
