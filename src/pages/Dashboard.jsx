import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ResumeUpload from '../components/ResumeUpload';
import { Plus, History, Briefcase, GraduationCap, ArrowRight, Loader, FileText } from 'lucide-react';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/session/all');
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { data } = await api.post('/session/create', { role, experienceLevel });
      navigate(`/session/${data._id}`);
    } catch (error) {
      console.error('Error creating session', error);
      setIsCreating(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-400">Start a new interview session or review past ones.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Session Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
            
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Plus className="text-blue-400" /> New Session
            </h2>

            <form onSubmit={handleCreateSession} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Briefcase size={16} className="text-slate-400"/> Job Role
                </label>
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="e.g., Frontend Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <GraduationCap size={16} className="text-slate-400"/> Experience Level
                </label>
                <select 
                  value={experienceLevel} 
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isCreating ? <Loader className="animate-spin" size={20} /> : 'Start Interview'}
              </button>
            </form>
          </div>
        </div>

        {/* Resume Upload Card */}
        <div className="lg:col-span-1">
          <ResumeUpload />
        </div>

        {/* Previous Sessions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <History className="text-slate-400" /> Past Sessions
          </h2>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader className="animate-spin text-blue-500" size={32} />
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass-panel border border-white/5 rounded-2xl p-12 text-center text-slate-400">
              No interview sessions yet. Create one to get started!
            </div>
          ) : (
            <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-1">
              {sessions.map((session) => (
                <div 
                  key={session._id} 
                  onClick={() => navigate(`/session/${session._id}`)}
                  className="glass-panel border border-white/5 hover:border-blue-500/30 p-5 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/50 group flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      {session.type === 'resume-based' && (
                        <FileText size={16} className="text-purple-400" />
                      )}
                      {session.role}
                    </h3>
                    <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{session.experienceLevel}</span>
                      {session.type === 'resume-based' && (
                        <span className="bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded text-xs border border-purple-500/20">Resume</span>
                      )}
                      <span>•</span>
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <ArrowRight className="text-slate-500 group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
