import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { FiArrowLeft, FiMail, FiSend } from 'react-icons/fi';
import { axiosClient } from '../utils/axiosClient';

function ForgotPassword() {
  document.title = 'Forgot Password';
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  const submitForm = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setIsLoading(true);
      ref.current.staticStart();
      const response = await axiosClient.post('/auth/forgot-password', { email });

      if (response.data.statusCode !== 200) {
        toast.error(response.data.message || 'Could not send reset link');
        return;
      }

      toast.success(response.data.message);
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send reset link. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      ref.current.complete();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light flex flex-col lg:flex-row">
      <LoadingBar color="#FACC15" ref={ref} />

      <div className="lg:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col justify-center items-center lg:items-end lg:pr-16">
        <div className="max-w-md text-center lg:text-right">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-secondary">Expense</span> Tracker
          </h1>
          <p className="text-lg text-gray-300">
            Reset your password and get back to tracking
          </p>
        </div>
      </div>

      <div className="lg:w-3/5 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mx-auto bg-white/5 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <FiMail className="text-2xl text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-white">Forgot Password</h2>
            <p className="text-gray-400 mt-2">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={submitForm} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-white placeholder-gray-400 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-dark font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70"
            >
              {isLoading ? 'Sending...' : <>Send reset link <FiSend /></>}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark font-medium transition-colors"
              >
                <FiArrowLeft /> Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
