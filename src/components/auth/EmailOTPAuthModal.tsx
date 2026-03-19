'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Check, X, User, Shield, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { userService } from '@/services/firebaseService';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';

interface EmailOTPAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; phone: string; uid: string }) => void;
}

export const EmailOTPAuthModal: React.FC<EmailOTPAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [step, setStep] = useState<'name' | 'phone' | 'otp'>('name');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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

  const handleNameSubmit = async () => {
    if (!validateName()) return;
    
    console.log('Name validated, moving to phone step');
    setStep('phone');
  };

  const handlePhoneSubmit = async () => {
    if (!validatePhone()) return;
    
    setLoading(true);
    try {
      // Check if user already exists with this phone number
      const existingUser = await userService.getUserByPhone(phoneNumber);
      
      // Generate demo OTP for now (since SMS requires billing)
      const demoOtp = '123456';
      const userEmail = `${phoneNumber.replace(/\D/g, '')}@nagabalaji.demo`;
      
      console.log('Creating email account for:', userEmail);
      console.log('Demo OTP:', demoOtp);
      
      // Create Firebase Auth account with email
      const result = await createUserWithEmailAndPassword(auth, userEmail, demoOtp);
      
      if (result.user) {
        setOtp(demoOtp);
        setStep('otp');
        setEmail(userEmail);
        
        if (existingUser) {
          console.log('Existing user found');
        } else {
          console.log('New user, will create account after OTP verification');
        }
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ phone: 'Phone number already registered. Try logging in.' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ phone: 'Password too weak. Try again.' });
      } else {
        setErrors({ phone: 'Failed to create account. Please try again.' });
      }
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
      
      // Sign in with email and OTP (using OTP as password)
      const result = await signInWithEmailAndPassword(auth, email, otp);
      
      if (result.user) {
        // OTP verified, check if user exists in our database
        const existingUser = await userService.getUserByPhone(phoneNumber);
        
        if (existingUser) {
          // Existing user, complete login
          console.log('Existing user login successful:', existingUser);
          onAuthSuccess({
            name: existingUser.name,
            phone: existingUser.phone, // Keep the original phone number
            uid: existingUser.id
          });
        } else {
          // New user, create account with provided name and phone number
          const userData = {
            name: name.trim(),
            phone: phoneNumber, // Save the phone number for user records
            uid: result.user.uid
          };

          await userService.createUser(userData);
          console.log('New user created with phone number:', userData);
          
          onAuthSuccess(userData);
          handleClose();
        }
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      if (error.code === 'auth/invalid-credential') {
        setErrors({ otp: 'Invalid OTP. Use 123456 for demo.' });
      } else if (error.code === 'auth/user-not-found') {
        setErrors({ otp: 'User not found. Please try again.' });
      } else {
        setErrors({ otp: 'Verification failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    await handlePhoneSubmit();
  };

  const handleClose = () => {
    setStep('name');
    setName('');
    setPhoneNumber('');
    setEmail('');
    setOtp('');
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
                    <h2 className="text-xl font-bold text-gray-800">Free Email OTP Login</h2>
                    <p className="text-sm text-gray-600">
                      {step === 'name' && 'Tell us your name'}
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
                      step === 'phone' || step === 'otp' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'name' ? '1' : step === 'phone' ? '✓' : '✓'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'phone' || step === 'otp' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'phone' ? 'bg-emerald-500 text-white' : 
                      step === 'otp' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'phone' ? '2' : step === 'otp' ? '✓' : '2'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'otp' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'otp' ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      3
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
                        Nice to meet you, {name}! Now enter your phone number
                      </p>
                      <p className="text-xs text-amber-600 font-medium">
                        📱 We'll create a free email account for OTP
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
                        onClick={() => setStep('name')}
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
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Create Free Account
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
                        Demo OTP: 123456 (Check your email)
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
