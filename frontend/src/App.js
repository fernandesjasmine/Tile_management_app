import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ViewerDashboard from './components/ViewerDashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('App mounted');
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          console.log('Token expired');
          return;
        }
        setUser({ name: decoded.username, role: decoded.role });
        console.log('User logged in:', decoded);
      } catch (e) {
        console.error('Invalid token:', e);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <Router>
      <div className="app">
        {user && <Navbar user={user} setUser={setUser} />}
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} role="admin">
                <AdminDashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewer"
            element={
              <ProtectedRoute user={user} role="viewer">
                <ViewerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;