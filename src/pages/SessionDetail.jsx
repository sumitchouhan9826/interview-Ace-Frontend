import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionAccordion from '../components/QuestionAccordion';
import { ArrowLeft, BrainCircuit, Loader } from 'lucide-react';

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSessionData();
  }, [id]);

  const fetchSessionData = async () => {
    try {
      const [sessionRes, questionsRes] = await Promise.all([
        api.get(`/session/${id}`),
        api.get(`/question/${id}`)
      ]);
      setSession(sessionRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error('Error fetching session data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/question/generate', { sessionId: id });
      setQuestions([...questions, ...data]);
    } catch (error) {
      console.error('Error generating questions', error);
    } finally {
      setGenerating(false);
    }
  };

  const handlePinToggle = async (questionId) => {
    try {
      const { data } = await api.patch(`/question/pin/${questionId}`);
      setQuestions(questions.map(q => q._id === questionId ? data : q));
    } catch (error) {
      console.error('Error pinning question', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!session) {
    return <div className="text-center text-slate-400 mt-12">Session not found.</div>;
  }

  const pinnedQuestions = questions.filter(q => q.isPinned);
  const regularQuestions = questions.filter(q => !q.isPinned);
  const sortedQuestions = [...pinnedQuestions, ...regularQuestions];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">{session.role} Interview</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-sm text-emerald-400 border border-emerald-500/20">{session.experienceLevel}</span>
            {session.type === 'resume-based' && (
              <span className="bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded text-sm border border-purple-500/20">Resume-Based</span>
            )}
            <span>•</span>
            <span>Started {new Date(session.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
        
        <button 
          onClick={handleGenerateQuestions}
          disabled={generating}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 whitespace-nowrap"
        >
          {generating ? <Loader className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
          {generating ? 'AI Generating...' : 'Generate Questions'}
        </button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center p-12 glass-panel border border-dashed border-slate-700 rounded-2xl">
            <BrainCircuit size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-300 mb-2">No Questions Yet</h3>
            <p className="text-slate-500">Click "Generate Questions" to have our AI create mock interview questions tailored for this role.</p>
          </div>
        ) : (
          sortedQuestions.map((question) => (
            <QuestionAccordion 
              key={question._id} 
              question={question} 
              onPinToggle={handlePinToggle} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SessionDetail;
