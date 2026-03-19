'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, Navigation, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export const ProfessionalContactSection: React.FC = () => {
  const googleMapsUrl = 'https://maps.app.goo.gl/13YYoDFPx8PjVcY88';
  const phoneNumber = '+919293948339';

  const handleCall = () => {
    // On mobile, open phone dialer; on desktop, open tel link
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      window.open(`tel:${phoneNumber}`, '_blank');
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-emerald-50 via-white to-rose-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Visit Our
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-rose-400">
              {" "}Tiffin Centre
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Come and experience the authentic taste of South Indian cuisine at our cozy location
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <CardContent className="p-0">
                {/* Map Section */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-rose-100 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center cursor-pointer"
                    onClick={() => window.open(googleMapsUrl, '_blank')}
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
                      <MapPin className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click for Directions</p>
                  </motion.div>
                </div>

                {/* Location Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Our Location</h3>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 font-medium">Sri Nagabalaji Tiffin Centre</p>
                        <p className="text-gray-600">Near SV Junior College, Nayanagar,Kodad</p>
                        <p className="text-gray-600">Telangana - 508206</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Navigation className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 font-medium">Landmark</p>
                        <p className="text-gray-600">Opposite SV Junior College</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Get Directions
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <CardContent className="p-0">
                {/* Contact Header */}
                <div className="relative h-48 bg-gradient-to-br from-rose-100 to-emerald-100 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
                      <Phone className="w-8 h-8 text-rose-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Get in Touch</p>
                  </motion.div>
                </div>

                {/* Contact Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 font-medium">Phone</p>
                        <p className="text-gray-600">+91 9292948339</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 font-medium">Email</p>
                        <p className="text-gray-600">polishettyramesh@gmail.com</p>
                        <p className="text-gray-600">orders@nagabalaji.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 font-medium">Business Hours</p>
                        <p className="text-gray-600">Morning: 7AM - 10:30AM</p>
                        <p className="text-gray-600">Evening: 4:30PM - 7:30PM</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCall}
                    className="w-full mt-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <CardContent className="p-0">
                {/* Features Header */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-rose-100 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-3">
                      <Star className="w-8 h-8 text-emerald-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Why Choose Us</p>
                  </motion.div>
                </div>

                {/* Features List */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Our Specialties</h3>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">Fresh Ingredients Daily</p>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-rose-50 rounded-lg">
                      <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">Authentic Recipes</p>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <p className="text-gray-700 font-medium">Hygienic Preparation</p>
                    </div>


                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-rose-600 hover:from-emerald-600 hover:to-rose-700 text-white py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Order Online
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Order?</h3>
            <p className="text-gray-600 mb-6">
              Call us now or visit our location to taste the best South Indian tiffin in town!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCall}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Phone className="w-5 h-5 inline mr-2" />
                <span className="text-sm">Call</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Navigation className="w-5 h-5 inline mr-2" />
                Get Directions
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
