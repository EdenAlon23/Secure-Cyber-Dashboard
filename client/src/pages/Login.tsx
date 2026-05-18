import React, { useState } from 'react';
import { axiosClient } from '../../api/axiosClient';
import { useNavigate } from 'react-router-dom'; // 1. נוודא שהייבוא קיים

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. ה-Hook חייב להיות כאן! מחוץ לכל פונקציה פנימית וברמה העליונה של Login
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      
      localStorage.setItem('jwt_token', response.data.token);
      
      // 3. כאן אנחנו רק משתמשים במשתנה שיצרנו למעלה
      navigate('/dashboard'); 

    } catch (err: any) {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-slate-700 text-slate-300 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-slate-700 text-slate-300 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};