'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Check, X, User, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { userService } from '@/services/firebaseService';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { name: string; phone: string; uid: string }) => void;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedOtp, setGeneratedOtp] = useState('');

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

  const handleSendOTP = async () => {
    if (!validatePhone()) return;
    
    setLoading(true);
    try {
      // Check if user already exists
      const existingUser = await userService.getUserByPhone(phoneNumber);
      
      if (existingUser) {
        // User exists, just send OTP and skip name step
        const demoOtp = '123456';
        setGeneratedOtp(demoOtp);
        setStep('otp');
        console.log('Existing user found, will skip name step');
      } else {
        // New user, send OTP
        const demoOtp = '123456';
        setGeneratedOtp(demoOtp);
        setStep('otp');
        console.log('New user, will ask for name after OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrors({ phone: 'Failed to send OTP. Please try again.' });
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
      if (otp === generatedOtp) {
        // OTP verified, check if user exists
        const existingUser = await userService.getUserByPhone(phoneNumber);
        
        if (existingUser) {
          // Existing user, complete login
          console.log('Existing user login:', existingUser);
          onAuthSuccess({
            name: existingUser.name,
            phone: existingUser.phone,
            uid: existingUser.id
          });
        } else {
          // New user, ask for name
          console.log('New user, asking for name');
          setStep('name');
        }
      } else {
        setErrors({ otp: 'Invalid OTP. Use 123456 for demo.' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrors({ otp: 'Invalid verification code.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!name.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }

    setLoading(true);
    try {
      // Create new user in Firebase
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userData = {
        name: name.trim(),
        phone: phoneNumber,
        uid
      };

      await userService.createUser(userData);
      
      onAuthSuccess(userData);
      handleClose();
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ name: 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setName('');
    setErrors({});
    setGeneratedOtp('');
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
                    <h2 className="text-xl font-bold text-gray-800">Secure Login</h2>
                    <p className="text-sm text-gray-600">
                      {step === 'phone' && 'Enter your phone number'}
                      {step === 'otp' && 'Verify your OTP'}
                      {step === 'name' && 'Complete your profile'}
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
                      step === 'phone' ? 'bg-emerald-500 text-white' : 
                      step === 'otp' || step === 'name' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'phone' ? '1' : step === 'otp' ? '2' : '✓'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'otp' || step === 'name' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'otp' ? 'bg-emerald-500 text-white' : 
                      step === 'name' ? 'bg-emerald-500 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {step === 'otp' ? '2' : step === 'name' ? '✓' : '2'}
                    </div>
                    <div className={`w-16 h-1 ${
                      step === 'name' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 'name' ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      3
                    </div>
                  </div>
                </div>

                {step === 'phone' && (
                  <motion.div
                    key="phone-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-gray-600">
                        We'll send you a verification code via SMS
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

                    <Button
                      onClick={handleSendOTP}
                      loading={loading}
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Phone className="w-5 h-5 mr-2" />
                          Send OTP
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
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
                        OTP sent to +91 {phoneNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Enter the 6-digit code (Demo: 123456)
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
                          Verify OTP
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <button
                      onClick={() => setStep('phone')}
                      className="w-full text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Change phone number
                    </button>
                  </motion.div>
                )}

                {step === 'name' && (
                  <motion.div
                    key="name-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-rose-500" />
                      </div>
                      <p className="text-gray-600">
                        Welcome! Please tell us your name
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
                      />
                    </div>

                    <Button
                      onClick={handleFinalSubmit}
                      loading={loading}
                      className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-4"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <User className="w-5 h-5 mr-2" />
                          Complete Setup
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
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
