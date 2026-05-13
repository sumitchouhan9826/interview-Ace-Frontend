import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Sparkles, Brain, Target, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

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
              <p className="text-sm text-slate-400">Smart questions powered by AI</p>
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
          
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="text-blue-400" />
            Get Started
          </h2>
          <p className="text-slate-400 mb-8">
            Create an account or sign in to start preparing for your dream job with AI-powered interview practice.
          </p>

          <div className="space-y-4">
            <Link
              to="/sign-up"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Account
              <ArrowRight size={18} />
            </Link>
            
            <Link
              to="/sign-in"
              className="w-full flex items-center justify-center gap-2 bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 text-white font-semibold py-3 px-4 rounded-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-6 text-center text-slate-500 text-xs">
            Secure authentication powered by Clerk
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
