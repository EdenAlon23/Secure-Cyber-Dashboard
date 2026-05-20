import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosClient } from '../../api/axiosClient';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send registration payload to the C# secure Auth endpoint
      await axiosClient.post('/auth/register', { email, password });
      
      // Notify operator of successful creation and reroute to login
      alert('Operator account provisioned successfully! You can now log in.');
      navigate('/login');
    } catch (err: any) {
      // Extract specific identity/password policy errors from the backend context
      const backendMessage = err.response?.data?.errors?.Password?.[0]
        || err.response?.data?.message
        || 'Registration failed. Ensure your password complies with the SOC complexity rules.';
      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Create Operator Account</h2>
        <p className="text-slate-400 text-center text-sm mb-6">Provision credentials for the SOC Dashboard</p>
        
        {error && (
          <div className="p-3 bg-red-900/40 border border-red-800 text-red-300 text-sm rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min 8 chars, 1 uppercase, 1 special sign"
              className="w-full p-2.5 rounded bg-slate-900 text-white border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Provisioning Account...' : 'Register Operator'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-slate-400 text-sm">
          Already registered? <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign In</Link>
        </div>
      </div>
    </div>
  );
};