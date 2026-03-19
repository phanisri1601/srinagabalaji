'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  onCartClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCartClick }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-rose-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-20 w-32 h-32 bg-rose-200 rounded-full opacity-20"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-1/4 w-16 h-16 bg-sky-200 rounded-full opacity-20"
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">4.8 Rating • 1000+ Happy Customers</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight"
            >
              Sri Nagabalaji
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-rose-400">
                {" "}Tiffin Centre
              </span>
              <br />
              Authentic South Indian
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Experience the true taste of South India.
              <br />
              <span className="font-semibold text-gray-700">Fresh | Hot | Traditional Taste</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >

              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg"
              >
                Order Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start space-x-8 text-gray-600"
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-semibold">Morning</p>
                  <p className="text-sm">6AM - 11AM</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-rose-500" />
                <div>
                  <p className="font-semibold">Evening</p>
                  <p className="text-sm">4:30PM - 9:30PM</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Wide Hero Video */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-4xl mx-auto lg:mr-0 z-10 mt-12 lg:mt-0"
          >
            {/* The Video Container seamlessly fading out */}
            <div
              className="relative w-full aspect-video z-10 group"
              style={{
                maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
              >
                <source src="/PixVerse_V5.5_Modify_360P_bro_flip_the_dosa_an (2).mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none z-10" />
            </div>

            {/* Beautiful Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-emerald-400/20 via-rose-300/10 to-emerald-300/20 blur-3xl rounded-[3rem] -z-10 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};
