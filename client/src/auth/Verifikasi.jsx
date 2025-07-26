import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Shield, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import axios from "axios";

const Verifikasi = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  
  const inputRefs = useRef([]);
  const location = useLocation();
  const targetEmail = location.state?.email || "";

  // Timer countdown for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    
    // Focus last filled input or next empty one
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Masukkan kode verifikasi 6 digit');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", {
        email: targetEmail,
        otp: otpCode,
      });
      if (res.data.verified) {
        // Berhasil
        alert("Verifikasi berhasil!");
        // Redirect atau aksi lain
      } else {
        setError("Kode verifikasi salah.");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Gagal memverifikasi OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(120);
    setError('');
    try {
      await axios.post("http://localhost:5000/api/send-otp", { email: targetEmail });
      alert("Kode OTP baru dikirim!");
    } catch {
      setError("Gagal mengirim ulang kode.");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Email</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Masukkan 6 digit kode verifikasi yang telah dikirim ke email kamu
          </p>
          <div className="flex items-center justify-center mt-2 text-sm text-blue-600">
            <Mail className="w-4 h-4 mr-1" />
            <span className="font-medium">{targetEmail}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* OTP Input */}
          <div className={`flex justify-center gap-3 mb-6 ${isShaking ? 'animate-pulse' : ''}`}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`
                  w-12 h-12 text-center text-xl font-semibold border-2 rounded-xl
                  transition-all duration-200 focus:outline-none
                  ${error 
                    ? 'border-red-300 bg-red-50 text-red-600 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                  }
                  ${digit ? 'bg-blue-50 border-blue-300' : ''}
                  ${isShaking ? 'animate-bounce' : ''}
                `}
                placeholder="•"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded-xl font-semibold text-white
              transition-all duration-200 flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }
              shadow-lg hover:shadow-xl
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verifikasi</span>
              </>
            )}
          </button>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Tidak menerima kode?</p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${canResend 
                  ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700' 
                  : 'text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <RotateCcw className={`w-4 h-4 ${canResend ? '' : 'opacity-50'}`} />
              {canResend ? (
                <span>Kirim Ulang</span>
              ) : (
                <span>Kirim ulang dalam {formatTime(resendTimer)}</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Dengan melanjutkan, kamu menyetujui{' '}
            <button className="text-blue-600 hover:underline">Syarat & Ketentuan</button>
            {' '}dan{' '}
            <button className="text-blue-600 hover:underline">Kebijakan Privasi</button>
            {' '}NusaTanggap
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verifikasi;