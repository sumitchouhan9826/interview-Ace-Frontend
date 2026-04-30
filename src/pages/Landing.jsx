import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Brain, Target } from 'lucide-react';

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-100px)] gap-12">
      <div className="lg:w-1/2 space-y-8 animate-fade-in">
        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
          Master Your Next <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Technical Interview
          </span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          AI-powered mock interviews tailored to your role and experience. Get instant feedback, detailed explanations, and track your progress.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Brain size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">AI Q&A</h3>
              <p className="text-sm text-slate-400">Smart questions powered by Gemini AI</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Target size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Tailored Prep</h3>
              <p className="text-sm text-slate-400">Customized to your experience level</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-5/12 w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="text-blue-400" />
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-400 font-semibold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
