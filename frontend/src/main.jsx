import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { ExpenseProvider } from './contexts/ExpenseContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </ExpenseProvider>
  </StrictMode>,
)
