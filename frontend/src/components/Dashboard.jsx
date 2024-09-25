import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      {user.role === 'admin' && (
        <div>
          <h2>Admin Panel</h2>
          {/* Admin-specific content */}
        </div>
      )}
      <div>
        <h2>User Content</h2>
        {/* General user content */}
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;