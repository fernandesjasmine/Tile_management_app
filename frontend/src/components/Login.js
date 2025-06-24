import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log('Response:', response.status, data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        const [, encodedPayload] = data.token.split('.');
        const decoded = JSON.parse(atob(encodedPayload));
        setUser({ name: decoded.username, role: decoded.role });
        navigate(decoded.role === 'admin' ? '/admin' : '/viewer');
      } else {
        alert('Login failed: ' + (data.message || 'No token received'));
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: Network error or server issue');
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;