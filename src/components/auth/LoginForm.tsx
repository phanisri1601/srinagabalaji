'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, User, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User as UserType } from '@/types';

interface LoginFormProps {
  onLogin: (user: UserType) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrors({ otp: 'Please enter a 6-digit OTP' });
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp === '123456') {
        const user: UserType = {
          id: Date.now().toString(),
          name: formData.name,
          phone: formData.phone
        };
        onLogin(user);
      } else {
        setErrors({ otp: 'Invalid OTP. Try 123456 for demo' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-3xl">🍽️</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to Nagabalaji
            </h2>
            <p className="text-gray-400">
              Sign in to order delicious South Indian food
            </p>
          </div>

          {!otpSent ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <Input
                  label="Your Name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />
              </div>

              <div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                  maxLength={10}
                />
              </div>

              <Button
                onClick={handleSendOTP}
                loading={loading}
                className="w-full"
                size="lg"
              >
                <Phone className="w-5 h-5" />
                Send OTP
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="bg-orange-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-orange-500" />
                </div>
                <p className="text-gray-300 mb-2">
                  OTP sent to {formData.phone}
                </p>
                <p className="text-sm text-gray-500">
                  Demo OTP: <span className="text-orange-500 font-mono">123456</span>
                </p>
              </div>

              <div>
                <Input
                  label="Enter OTP"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  error={errors.otp}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                loading={loading}
                className="w-full"
                size="lg"
              >
                <Check className="w-5 h-5" />
                Verify OTP
                <ArrowRight className="w-5 h-5" />
              </Button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setErrors({});
                }}
                className="w-full text-gray-400 hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
