'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Check, X, User, Shield, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { userService } from '@/services/firebaseService';
import { auth, db, functions } from '@/lib/firebase';
import { simpleEmailService } from '@/services/simpleEmailService';
import { httpsCallable } from 'firebase/functions';

interface RealEmailOTPAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; phone: string; uid: string }) => void;
}

export const RealEmailOTPAuthModal: React.FC<RealEmailOTPAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [step, setStep] = useState<'name' | 'email' | 'phone' | 'otp'>('name');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateName = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhone = () => {
    const newErrors: Record<string, string> = {};
    
    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleNameSubmit = async () => {
    if (!validateName()) return;
    
    console.log('Name validated, moving to email step');
    setStep('email');
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail()) return;
    
    setLoading(true);
    try {
      // Check if user already exists with this email
      const existingUser = await userService.getUserByEmail(email);
      
      if (existingUser) {
        // Email already exists, move directly to phone step
        console.log('Email already registered, moving to phone step');
        setStep('phone');
        return;
      }
      
      // Generate real OTP
      const otp = generateOTP();
      setGeneratedOTP(otp);
      
      console.log('Generated OTP for', email, ':', otp);
      
      // Call Simple Email Service to send real email
      const emailSent = await simpleEmailService.sendOTP(email, otp, name);
      
      if (emailSent) {
        console.log('Email sent successfully via Simple Email Service:', email);
        setStep('phone');
        
        // Show success message
        setErrors({ email: '✅ OTP sent to your email! Please check your inbox (including spam folder).' });
        setTimeout(() => setErrors({}), 5000); // Clear success message after 5 seconds
      } else {
        console.error('Failed to send OTP via Simple Email Service');
        setErrors({ email: 'Failed to send OTP. Please try again.' });
      }
      
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setErrors({ email: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!validatePhone()) return;
    
    setLoading(true);
    try {
      // Check if user already exists with this phone number
      const existingUser = await userService.getUserByPhone(phoneNumber);
      
      if (existingUser) {
        // User already exists, complete login
        console.log('Existing user login successful:', existingUser);
        onAuthSuccess({
          name: existingUser.name,
          phone: existingUser.phone,
          uid: existingUser.id
        });
        handleClose();
      } else {
        // New user, proceed to OTP step
        setStep('otp');
        console.log('New user, will create account after OTP verification');
      }
    } catch (error: any) {
      console.error('Error checking user:', error);
      setErrors({ phone: 'Failed to check user. Please try again.' });
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
      console.log('Verifying OTP:', otp);
      console.log('Expected OTP:', generatedOTP);
      
      if (otp !== generatedOTP) {
        setErrors({ otp: 'Invalid OTP. Please check your email and try again.' });
        return;
      }
      
      // OTP verified, create user account
      const userData = {
        name: name.trim(),
        phone: phoneNumber,
        uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      await userService.createUser(userData);
      console.log('New user created:', userData);
      
      onAuthSuccess(userData);
      handleClose();
      
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      // Generate new OTP
      const otp = generateOTP();
      setGeneratedOTP(otp);
      
      console.log('Resending OTP to', email, ':', otp);
      
      // Send real OTP to user's email
      const emailSent = await simpleEmailService.sendOTP(email, otp, name);
      
      if (emailSent) {
        console.log('OTP resent successfully to:', email);
        
        // Show success message
        setErrors({ otp: '✅ New OTP sent to your email! Please check your inbox.' });
        setTimeout(() => setErrors({}), 3000); // Clear success message after 3 seconds
      } else {
        console.error('Failed to resend OTP to email');
        setErrors({ otp: 'Failed to resend OTP. Please try again.' });
      }
      
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      setErrors({ otp: 'Failed to resend OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('name');
    setName('');
    setEmail('');
    setPhoneNumber('');
    setOtp('');
    setGeneratedOTP('');
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-rose-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Real Email OTP</h2>
                    <p className="text-sm text-gray-600">
                      {step === 'name' && 'Tell us your name'}
                      {step === 'email' && 'Enter your email address'}
                      {step === 'phone' && 'Enter your phone number'}
                      {step === 'otp' && 'Verify your OTP'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  size="sm"
                  className="p-2 border-emerald-200 text-gray-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'name' ? 'bg-emerald-500 text-white' : 
                      step === 'email' || step === 'phone' || step === 'otp' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'name' ? '1' : step === 'email' || step === 'phone' || step === 'otp' ? '✓' : '✓'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'email' || step === 'phone' || step === 'otp' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'email' ? 'bg-emerald-500 text-white' : 
                      step === 'phone' || step === 'otp' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'email' ? '2' : step === 'phone' || step === 'otp' ? '✓' : '2'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'phone' || step === 'otp' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'phone' ? 'bg-emerald-500 text-white' : 
                      step === 'otp' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'phone' ? '3' : step === 'otp' ? '✓' : '3'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'otp' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'otp' ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      4
                    </div>
                  </div>
                </div>

                {step === 'name' && (
                  <motion.div
                    key="name-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-gray-600">
                        Let's start with your name
                      </p>
                    </div>

                    <div>
                      <Input
                        label="Your Name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        className="text-center text-xl"
                      />
                    </div>

                    <Button
                      onClick={handleNameSubmit}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {step === 'email' && (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-gray-600">
                        Nice to meet you, {name}! Now enter your email address
                      </p>
                      <p className="text-xs text-amber-600 font-medium">
                        📧 We'll send a real OTP to your email
                      </p>
                    </div>

                    <div>
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        className="text-center text-xl"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setStep('name')}
                        variant="outline"
                        className="flex-1 border-emerald-200 text-gray-700"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleEmailSubmit}
                        loading={loading}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending OTP...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Send OTP
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 'phone' && (
                  <motion.div
                    key="phone-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-rose-500" />
                      </div>
                      <p className="text-gray-600">
                        OTP sent to {email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Enter your phone number to complete registration
                      </p>
                    </div>

                    <div>
                      <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter 10-digit phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        error={errors.phone}
                        maxLength={10}
                        className="text-center text-xl"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setStep('email')}
                        variant="outline"
                        className="flex-1 border-emerald-200 text-gray-700"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handlePhoneSubmit}
                        loading={loading}
                        className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-4"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Phone className="w-5 h-5 mr-2" />
                            Continue
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-gray-600 mb-2">
                        OTP sent to {email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Check your email and enter the 6-digit code
                      </p>
                      <p className="text-xs text-amber-600 font-medium">
                        📧 For testing: Check the alert popup for OTP
                      </p>
                    </div>

                    <div>
                      <Input
                        label="Verification Code"
                        type="text"
                        placeholder="Enter 6-digit OTP"
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
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Verify & Complete
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setStep('phone')}
                        variant="outline"
                        className="flex-1 border-rose-200 text-gray-700"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleResendOTP}
                        variant="outline"
                        className="flex-1 border-emerald-200 text-emerald-600"
                        disabled={loading}
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
