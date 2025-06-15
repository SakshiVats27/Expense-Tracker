import React, { useEffect, useState, useRef } from 'react';
import { axiosClient } from '../utils/axiosClient';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

function Signup() {
  document.title = 'Sign Up';
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const ref = useRef(null);

  // Prevent logged-in users from accessing signup page
  useEffect(() => {
    if (localStorage.getItem("User")) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      ref.current.staticStart();
      
      const response = await axiosClient.post('/auth/signup', formData);

      if (response.data.statusCode !== 201) {
        toast.error(response.data.message || 'Registration failed');
        return;
      }

      toast.success("Registered successfully!");
      ref.current.complete();
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error("Signup error:", error);
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
            Start tracking your expenses and take control of your finances
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="lg:w-3/5 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mx-auto bg-white/5 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <FiUser className="text-2xl text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Fill in your details to get started</p>
          </div>

          <form onSubmit={submitForm} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.username ? 'border-red-500' : 'border-white/10'} focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-white placeholder-gray-400 transition-all`}
                />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-white placeholder-gray-400 transition-all`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-white placeholder-gray-400 transition-all`}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-dark font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-70"
            >
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  Sign Up <FiArrowRight />
                </>
              )}
            </button>

            <div className="text-center text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-secondary hover:text-secondary-dark font-medium transition-colors"
              >
                Log in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;