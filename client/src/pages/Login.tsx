import React, { useState } from 'react';    
import { Link, useNavigate } from 'react-router-dom';
import { axiosClient } from '../../api/axiosClient';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate user against the C# backend
      const response = await axiosClient.post('/auth/login', { email, password });
      
      // Store the JWT token securely in local storage
      localStorage.setItem('jwt_token', response.data.token);
      
      // Redirect to the SOC Dashboard upon successful authentication
      navigate('/dashboard'); 
    } catch (err: any) {
      // Handle specific rate-limiting or unauthorized errors
      if (err.response?.status === 429) {
        setError('Too many login attempts. You have been temporarily blocked.');
      } else {
        setError(err.response?.data?.message || 'Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login to Your Account</h2>
        
        {error && (
          <div className="p-3 bg-red-900/40 border border-red-800 text-red-300 text-sm rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        {/* Link to the Registration Page */}
        <div className="mt-6 text-center text-slate-400 text-sm">
          New operator? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Create account</Link>
        </div>
      </div>
    </div>
  );
};