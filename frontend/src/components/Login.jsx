import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-2xl w-1/2 p-8 bg-primary rounded-3xl shadow-2xl h-auto">
        <h2 className="text-3xl font-bold text-accent text-center mb-8">User Login</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="block w-full p-4 text-neutral bg-secondary border border-secondary rounded-2xl"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="block w-full p-4 text-neutral bg-secondary border border-secondary rounded-2xl"
          />
          <div className="flex justify-between items-center">
            <button type="submit" className="py-3 px-6 bg-accent hover:bg-accent hover:bg-opacity-80 text-neutral font-bold rounded-2xl">
              Login
            </button>
            <p className="text-neutral">
              Don&#39;t have an account? <a href="/register" className="text-accent hover:text-accent hover:text-opacity-80">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;