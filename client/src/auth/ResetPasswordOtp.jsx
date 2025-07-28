import React, { useState, useRef } from 'react';
import { KeyRound, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPasswordOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const targetEmail = location.state?.email || "";

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await axios.post("http://localhost:5000/api/send-reset-otp", { email: targetEmail });
      toast.success("Kode OTP reset password dikirim!");
      setResendTimer(120);
      setCanResend(false);
    } catch {
      toast.error("Gagal mengirim OTP. Coba lagi.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const kode = otp.join('');
      const res = await axios.post("http://localhost:5000/api/verify-reset-otp", {
        email: targetEmail,
        otp: kode
      });
      if (res.data.verified) {
        toast.success("OTP valid. Silakan atur password baru.");
        navigate('/auth/set-new-password', { state: { email: targetEmail } });
      } else {
        setError("Kode OTP salah!");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-center max-w-sm mx-auto">
            Masukkan 6 digit kode OTP yang telah dikirim ke email kamu untuk reset password.
          </p>
          <div className="flex items-center justify-center mt-2 text-sm text-blue-600">
            <span className="font-medium">{targetEmail}</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className={`
                  w-12 h-12 text-center text-xl font-semibold border-2 rounded-xl
                  transition-all duration-200 focus:outline-none
                  border-blue-200 focus:border-blue-500 focus:bg-blue-50
                  ${digit ? 'bg-blue-50 border-blue-300' : ''}
                `}
                placeholder="•"
              />
            ))}
          </div>
          {error && (
            <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className={`
              w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memverifikasi...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verifikasi OTP
              </>
            )}
          </button>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Tidak menerima kode?</p>
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${canResend
                  ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                  : 'text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <RotateCcw
                className={`w-4 h-4 ${isResending ? 'animate-spin' : ''} ${canResend ? '' : 'opacity-50'}`}
              />
              {canResend ? (
                <span>{isResending ? 'Mengirim...' : 'Kirim Ulang'}</span>
              ) : (
                <span>Kirim ulang dalam {formatTime(resendTimer)}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordOtp;