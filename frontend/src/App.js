import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { useEffect } from 'react';

function App() {
  const location = useLocation();

  useEffect(() => {
    toast.dismiss();

    const dismissToasts = () => toast.dismiss();
    window.addEventListener('scroll', dismissToasts, true);

    return () => {
      window.removeEventListener('scroll', dismissToasts, true);
    };
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Responsive Toaster Configuration */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-mont cursor-pointer',
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.5rem',
            padding: '0.75rem 0.85rem',
            fontSize: '0.875rem',
            boxShadow: '0 18px 40px rgba(0,0,0,0.3)',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <div
                className="flex items-start gap-3"
                onClick={() => toast.dismiss(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') toast.dismiss(t.id);
                }}
              >
                <span className="mt-0.5">{icon}</span>
                <span className="pr-1">{message}</span>
                {t.type !== 'loading' && (
                  <button
                    type="button"
                    aria-label="Close notification"
                    className="ml-2 rounded text-slate-300 hover:text-white"
                    onClick={(event) => {
                      event.stopPropagation();
                      toast.dismiss(t.id);
                    }}
                  >
                    x
                  </button>
                )}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      
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