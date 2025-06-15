import React, { useEffect, useState, useRef } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { FiLogIn, FiArrowRight } from 'react-icons/fi';

document.title = 'Login';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  // Prevent logged-in users from accessing login page
  useEffect(() => {
    if (localStorage.getItem("User")) {
      navigate("/");
    }
  }, [navigate]);

  const submitForm = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      ref.current.staticStart();
      
      const response = await axiosClient.post('/auth/login', {
        email,
        password
      });

      if (response.data.statusCode !== 201) {
        toast.error(response.data.message);
        return;
      }

      toast.success("Login successful!");
      localStorage.setItem('User', JSON.stringify(response.data.message));
      ref.current.complete();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light flex flex-col lg:flex-row">
      <LoadingBar color="#FACC15" ref={ref} />

      {/* Left Side - Branding */}
      <div className="lg:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col justify-center items-center lg:items-end lg:pr-16">
        <div className="max-w-md text-center lg:text-right">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-secondary">Expense</span> Tracker
          </h1>
          <p className="text-lg text-gray-300">
            Track your expenses and manage your budget effectively
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-3/5 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <FiLogIn className="mx-auto text-4xl text-secondary mb-4" />
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400 mt-2">Please enter your details</p>
          </div>

          <form onSubmit={submitForm} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-white placeholder-gray-400 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-white placeholder-gray-400 transition-all"
                required
                minLength="6"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-dark font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70"
            >
              {isLoading ? (
                'Logging in...'
              ) : (
                <>
                  Login <FiArrowRight />
                </>
              )}
            </button>

            <div className="text-center text-gray-400">
              New user?{' '}
              <Link 
                to="/signup" 
                className="text-secondary hover:text-secondary-dark font-medium transition-colors"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;