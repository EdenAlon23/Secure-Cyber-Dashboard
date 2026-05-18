import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../api/axiosClient';

interface SecurityEvent {
  id: number;
  eventType: string;
  ipAddress: string;
  description: string;
  timestamp: string;
}

export const Dashboard = () => {
  const [logs, setLogs] = useState<SecurityEvent[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Here we hit the endpoint protected by [Authorize(Roles = "Admin")]
        const response = await axiosClient.get('/SecurityLogs');
        setLogs(response.data);
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Access Denied. You must be an Admin to view this page.');
          // Redirect back to login after 3 seconds if not an admin
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError('Failed to fetch security logs.');
        }
      }
    };

    fetchLogs();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    navigate('/login');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">SOC Threat Dashboard</h1>
          <p className="text-slate-400 mt-1">Live feed of intercepted security events</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-800 rounded hover:bg-red-600/40 transition"
        >
          Logout
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-400 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-slate-300">
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">Event Type</th>
                <th className="p-4 font-semibold">IP Address</th>
                <th className="p-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No security threats detected recently.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                    <td className="p-4 text-sm text-slate-300">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-bold rounded bg-orange-900/50 text-orange-400 border border-orange-800">
                        {log.eventType}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono text-blue-300">{log.ipAddress}</td>
                    <td className="p-4 text-sm text-slate-400">{log.description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};