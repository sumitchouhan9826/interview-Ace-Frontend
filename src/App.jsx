import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--color-background)]">
        {/* Abstract background gradient elements for a premium feel */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/session/:id" 
              element={
                <ProtectedRoute>
                  <SessionDetail />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
