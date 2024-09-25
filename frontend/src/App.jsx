import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'; // Updated import
import Login from './components/Login';
import DashboardLayoutBranding from './components/DashboardLayoutBranding';
import { useAuth } from './contexts/AuthContext';
import Register from './components/Register';
    
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter> {/* Changed Router to BrowserRouter */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
              <DashboardLayoutBranding />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
