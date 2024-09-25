import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ email, password, username, role });
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-2xl w-1/2 p-8 bg-primary rounded-3xl shadow-2xl h-auto">
        <h2 className="text-3xl font-bold text-accent text-center mb-8">User Register</h2>
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
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
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
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="block w-full p-4 text-neutral bg-secondary border border-secondary rounded-2xl appearance-none"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button type="submit" className="py-3 px-6 bg-accent hover:bg-accent hover:bg-opacity-80 text-neutral font-bold rounded-2xl">
              Register
            </button>
            <p className="text-neutral">
              Already have an account? <a href="/login" className="text-accent hover:text-accent hover:text-opacity-80">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;