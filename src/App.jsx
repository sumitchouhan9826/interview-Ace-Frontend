import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SessionDetail from './pages/SessionDetail';
import { Toaster } from 'react-hot-toast';

/**
 * ProtectedRoute — waits for Clerk to load, then checks authentication.
 * Shows nothing while loading, redirects to /sign-in if not signed in.
 */
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // Clerk is still initializing
  if (!isSignedIn) return <Navigate to="/sign-in" />;

  return children;
};

/**
 * Centered wrapper for Clerk's SignIn/SignUp components
 * so they appear centered on the page with the app's background.
 */
const AuthPage = ({ children }) => (
  <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--color-background)]">
        {/* Abstract background gradient elements for a premium feel */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Clerk's built-in SignIn handles: login, OTP, forgot password, session activation */}
            <Route
              path="/sign-in/*"
              element={
                <AuthPage>
                  <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    fallbackRedirectUrl="/dashboard"
                  />
                </AuthPage>
              }
            />

            {/* Clerk's built-in SignUp handles: registration, email verification, session activation */}
            <Route
              path="/sign-up/*"
              element={
                <AuthPage>
                  <SignUp
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    fallbackRedirectUrl="/dashboard"
                  />
                </AuthPage>
              }
            />

            {/* Legacy routes redirect to new Clerk routes */}
            <Route path="/login" element={<Navigate to="/sign-in" replace />} />
            <Route path="/register" element={<Navigate to="/sign-up" replace />} />
            <Route path="/forgot-password" element={<Navigate to="/sign-in" replace />} />

            {/* Protected routes */}
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
    </AuthProvider>
  );
}

export default App;
