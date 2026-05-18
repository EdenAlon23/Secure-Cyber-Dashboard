import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard.tsx';
import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-50">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;