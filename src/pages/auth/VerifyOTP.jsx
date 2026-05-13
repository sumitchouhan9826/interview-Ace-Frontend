import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import OTPInput from '../../components/auth/OTPInput';
import { AuthContext } from '../../context/AuthContext';
import { Loader2, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const { login } = React.useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const type = location.state?.type || 'verification';

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleVerify = async (otp) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', {
        email,
        otp,
        type,
      });

      toast.success(res.data.message);

      if (type === 'reset') {
        navigate('/reset-password', { state: { email } });
      } else {
        login(res.data.data, res.data.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResending(true);
    try {
      const res = await api.post('/auth/resend-otp', {
        email,
        type,
      });
      toast.success(res.data.message);
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify Email" 
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <div className="mt-8 space-y-6">
        <div className="flex flex-col items-center space-y-8">
          <OTPInput onComplete={handleVerify} />
          
          {loading && (
            <div className="flex items-center text-indigo-400">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              <span>Verifying...</span>
            </div>
          )}

          <div className="text-center">
            <p className="text-slate-400 text-sm">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={timer > 0 || resending}
              className={`mt-2 flex items-center justify-center mx-auto text-sm font-semibold transition-all ${
                timer > 0 || resending 
                  ? 'text-slate-600 cursor-not-allowed' 
                  : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              {resending ? (
                <Loader2 className="animate-spin h-4 w-4 mr-1" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
