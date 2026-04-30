import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Upload, FileText, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    validateAndSet(selected);
  };

  const validateAndSet = (selected) => {
    setError('');
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setError('Only PDF files are accepted');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('File must be under 5 MB');
      return;
    }
    setFile(selected);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSet(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate(`/session/${data.session._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="text-purple-400" /> Resume Interview
      </h2>
      <p className="text-sm text-slate-400 mb-5">
        Upload your resume and let AI craft personalized interview questions.
      </p>

      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
          ${dragActive
            ? 'border-purple-400 bg-purple-500/10'
            : file
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-slate-700 hover:border-slate-500'
          }`}
        onClick={() => document.getElementById('resume-file-input').click()}
      >
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="text-emerald-400" size={32} />
            <p className="text-emerald-400 font-medium truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-xs text-slate-500 hover:text-red-400 mt-1 underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Upload size={32} className={dragActive ? 'text-purple-400' : ''} />
            <p className="text-sm">
              <span className="text-purple-400 font-medium">Click to browse</span> or drag & drop
            </p>
            <p className="text-xs text-slate-600">PDF only • Max 5 MB</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-4 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full mt-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <Loader className="animate-spin" size={18} />
            Analyzing Resume…
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload & Generate
          </>
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;
