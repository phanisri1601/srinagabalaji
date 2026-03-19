'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Shield, Loader2, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { userService } from '@/services/firebaseService';
import { simpleEmailService } from '@/services/simpleEmailService';

interface SimpleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; phone: string; uid: string }) => void;
}

export const SimpleLoginModal: React.FC<SimpleLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    otp?: string;
  }>({});

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateName = () => {
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Please enter your name' }));
      return false;
    }
    if (name.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: '' }));
    return true;
  };

  const validatePhone = () => {
    if (!phoneNumber.trim()) {
      setErrors(prev => ({ ...prev, phone: 'Please enter your phone number' }));
      return false;
    }
    if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid 10-digit phone number' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: '' }));
    return true;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Please enter your email' }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validateOTP = () => {
    if (!otp.trim()) {
      setErrors(prev => ({ ...prev, otp: 'Please enter the OTP' }));
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setErrors(prev => ({ ...prev, otp: 'OTP must be 6 digits' }));
      return false;
    }
    setErrors(prev => ({ ...prev, otp: '' }));
    return true;
  };

  const handleSendOTP = async () => {
    if (!validateName() || !validatePhone() || !validateEmail()) return;
    
    setLoading(true);
    try {
      // Check if user already exists
      const existingUser = await userService.getUserByEmail(email);
      
      if (existingUser) {
        // User exists, just send OTP for verification
        console.log('User already exists, sending OTP for verification');
      }
      
      // Generate OTP
      const otpCode = generateOTP();
      setGeneratedOTP(otpCode);
      
      console.log('Generated OTP for', email, ':', otpCode);
      
      // Send OTP via EmailJS
      const emailSent = await simpleEmailService.sendOTP(email, otpCode, name);
      
      if (emailSent) {
        setOtpSent(true);
        setErrors({ email: '✅ OTP sent to your email! Please check your inbox.' });
        setTimeout(() => setErrors({}), 5000);
      } else {
        setErrors({ email: 'Failed to send OTP. Please try again.' });
      }
      
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setErrors({ email: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateOTP()) return;
    
    setLoading(true);
    try {
      // Verify OTP
      if (otp !== generatedOTP) {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
        return;
      }
      
      // Check if user exists
      const existingUser = await userService.getUserByEmail(email);
      
      if (existingUser) {
        // Existing user - login
        console.log('Existing user logged in:', existingUser);
        onAuthSuccess({
          name: existingUser.name,
          phone: existingUser.phone,
          uid: existingUser.id
        });
      } else {
        // New user - create account
        const newUid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newUser = await userService.createUser({
          name,
          phone: phoneNumber,
          uid: newUid
        });
        console.log('New user created:', newUser);
        onAuthSuccess({
          name: newUser.name,
          phone: newUser.phone,
          uid: newUser.uid
        });
      }
      
      onClose();
      
    } catch (error: any) {
      console.error('Error during login:', error);
      setErrors({ otp: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPhoneNumber('');
    setEmail('');
    setOtp('');
    setGeneratedOTP('');
    setOtpSent(false);
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white border-0 shadow-2xl">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <User className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Naga Balaji Tiffin</h2>
                  <p className="text-gray-600 text-sm">Enter your details to login</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Name Field */}
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12"
                      disabled={loading}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      className="pl-12"
                      disabled={loading}
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12"
                      disabled={loading || otpSent}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* OTP Section */}
                  {otpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="pl-12"
                          disabled={loading}
                          maxLength={6}
                        />
                        {errors.otp && (
                          <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {!otpSent ? (
                      <Button
                        onClick={handleSendOTP}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>Send OTP</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <span>Login</span>
                            <Shield className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
