import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Pin, PinOff, Loader } from 'lucide-react';
import api from '../services/api';

const QuestionAccordion = ({ question, onPinToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState(question.explanation);
  const [loading, setLoading] = useState(false);

  const handleGenerateExplanation = async (e) => {
    e.stopPropagation();
    if (explanation) return;
    
    setLoading(true);
    try {
      const { data } = await api.post('/question/explanation', { questionId: question._id });
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error generating explanation', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`glass-panel border rounded-xl overflow-hidden transition-all duration-300 ${question.isPinned ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-white/10 hover:border-blue-500/30'}`}>
      <div 
        className="p-5 flex justify-between items-start cursor-pointer hover:bg-slate-800/30 transition-colors gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            {question.isPinned && <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded flex items-center gap-1"><Pin size={12}/> Pinned</span>}
            <h3 className="text-lg font-medium text-slate-100">{question.question}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPinToggle(question._id);
            }}
            className={`p-2 rounded-lg transition-colors ${question.isPinned ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'}`}
            title={question.isPinned ? "Unpin question" : "Pin question"}
          >
            {question.isPinned ? <PinOff size={18} /> : <Pin size={18} />}
          </button>
          <div className="p-2 text-slate-400">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="p-5 pt-0 border-t border-white/5 animate-fade-in bg-slate-900/50">
          <div className="prose prose-invert max-w-none mt-4">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Suggested Answer:</h4>
            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{question.answer}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            {explanation ? (
              <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <Sparkles size={16} /> AI Explanation
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
              </div>
            ) : (
              <button 
                onClick={handleGenerateExplanation}
                disabled={loading}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {loading ? 'Generating...' : 'Request Deeper Explanation'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionAccordion;
