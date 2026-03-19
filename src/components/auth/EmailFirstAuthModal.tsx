'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check, X, User, Shield, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { userService } from '@/services/firebaseService';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

interface EmailFirstAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; phone: string; uid: string }) => void;
}

export const EmailFirstAuthModal: React.FC<EmailFirstAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [step, setStep] = useState<'email' | 'phone' | 'otp'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
      
      // Generate demo OTP for now
      const demoOtp = '123456';
      
      console.log('Creating email account for:', email);
      console.log('Demo OTP:', demoOtp);
      
      // Create Firebase Auth account with email
      const result = await createUserWithEmailAndPassword(auth, email, demoOtp);
      
      if (result.user) {
        setOtp(demoOtp);
        setStep('phone');
        
        console.log('New email account created successfully');
      } else {
        console.log('Failed to create email account');
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered. Please try logging in or use a different email.' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ email: 'Password too weak. Try again.' });
      } else if (error.code === 'auth/configuration-not-found') {
        setErrors({ email: 'Firebase configuration error. Please check Firebase Console.' });
      } else {
        setErrors({ email: 'Failed to create account. Please try again.' });
      }
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
      
      // Generate demo OTP for now
      const demoOtp = '123456';
      const phoneEmail = `${phoneNumber.replace(/\D/g, '')}@nagabalaji.demo`;
      
      console.log('Creating phone-linked account for:', phoneEmail);
      console.log('Demo OTP:', demoOtp);
      
      if (existingUser) {
        // Phone number already exists, try to sign in directly
        console.log('Phone number already registered, attempting direct login');
        try {
          const result = await signInWithEmailAndPassword(auth, phoneEmail, demoOtp);
          if (result.user) {
            setOtp(demoOtp);
            setStep('otp');
            console.log('Successfully signed in with existing phone account');
          }
        } catch (signInError: any) {
          console.error('Direct sign in failed:', signInError);
          setErrors({ phone: 'Phone number already registered. Please try a different number or check your email.' });
        }
      } else {
        // Create new phone-linked account
        const result = await createUserWithEmailAndPassword(auth, phoneEmail, demoOtp);
        
        if (result.user) {
          setOtp(demoOtp);
          setStep('otp');
          
          console.log('New phone-linked account created successfully');
        }
      }
    } catch (error: any) {
      console.error('Error creating phone account:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ phone: 'This phone number is already registered. Please try a different number.' });
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
      
      // Sign in with the appropriate account (email or phone-based)
      let signInEmail;
      if (email.includes('@nagabalaji.demo')) {
        signInEmail = email; // Use email account
      } else {
        signInEmail = `${phoneNumber.replace(/\D/g, '')}@nagabalaji.demo`; // Use phone account
      }
      
      const result = await signInWithEmailAndPassword(auth, signInEmail, otp);
      
      if (result.user) {
        // OTP verified, check if user exists in our database
        const existingUser = await userService.getUserByPhone(phoneNumber);
        
        if (existingUser) {
          // Existing user, complete login
          console.log('Existing user login successful:', existingUser);
          onAuthSuccess({
            name: existingUser.name,
            phone: existingUser.phone,
            uid: existingUser.id
          });
        } else {
          // New user, create account with provided name and phone number
          const userData = {
            name: name.trim(),
            phone: phoneNumber, 
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
    if (email.includes('@nagabalaji.demo')) {
      await handleEmailSubmit();
    } else {
      await handlePhoneSubmit();
    }
  };

  const handleClose = () => {
    setStep('email');
    setName('');
    setEmail('');
    setPhoneNumber('');
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
                    <h2 className="text-xl font-bold text-gray-800">Complete Registration</h2>
                    <p className="text-sm text-gray-600">
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
                      step === 'email' ? 'bg-emerald-500 text-white' : 
                      step === 'phone' || step === 'otp' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'email' ? '1' : step === 'phone' ? '✓' : '✓'}
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
                        Let's start with your email address
                      </p>
                      <p className="text-xs text-amber-600 font-medium">
                        📧 We'll create a free account for OTP verification
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

                    <Button
                      onClick={handleEmailSubmit}
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
                        Thanks, {name}! Now enter your phone number
                      </p>
                      <p className="text-xs text-amber-600 font-medium">
                        📱 We'll create an account linked to your phone number
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
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <Phone className="w-5 h-5 mr-2" />
                            Create Account
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
                        OTP sent to your email
                      </p>
                      <p className="text-sm text-gray-500">
                        Check your email and enter the 6-digit code
                      </p>
                      <p className="text-xs text-amber-600 font-medium">
                        📧 Demo OTP: 123456
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
                          Complete Login
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
