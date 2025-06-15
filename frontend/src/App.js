import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="app-container min-h-screen bg-light">
      {/* Responsive Toaster Configuration */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'font-mont',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1E293B',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '0.75rem',
            padding: '1rem',
            fontSize: '0.875rem',
            maxWidth: '100%',
            width: 'auto'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      
      <Routes>
        <Route 
          path='/' 
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          } 
        />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  );
}

export function ProtectedRoutes({ children }) {
  if (localStorage.getItem("User")) {
    return children;
  }
  return <Navigate to='/login' replace />;
}



export default App;