'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export const ContactSection: React.FC = () => {
  const phoneNumber = '+919293948339';
  const whatsappNumber = '+919293948339';
  const address = 'Sri Nagabalaji Tiffin Centre,Near SV Junior College Kodad';
  const googleMapsUrl = 'https://maps.app.goo.gl/4WV5gLAn8xB1K5mW9';

  const handleCall = () => {
    // On mobile, open phone dialer; on desktop, open tel link
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      window.open(`tel:${phoneNumber}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hi! I'm interested in ordering from Sri Nagabalaji Tiffin Centre.`);
  };

  const handleDirections = () => {
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Visit Us
          </h2>
          <p className="text-gray-400">
            Find us easily and get in touch for fresh, delicious food
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <p className="text-gray-300">{phoneNumber}</p>
                      <Button
                        onClick={handleCall}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Call Now
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">WhatsApp</p>
                      <p className="text-gray-300">Chat with us on WhatsApp</p>
                      <Button
                        onClick={handleWhatsApp}
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat on WhatsApp
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Address</p>
                      <p className="text-gray-300">{address}</p>
                      <Button
                        onClick={handleDirections}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Opening Hours</p>
                      <div className="text-gray-300 space-y-1">
                        <p className="text-sm">Morning: 6:00 AM – 11:00 AM</p>
                        <p className="text-sm">Evening: 4:30 PM – 9:30 PM</p>
                        <p className="text-sm text-orange-500">Closed on Sundays</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleCall}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Phone className="w-6 h-6" />
                    <span className="text-sm">Call</span>
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4 bg-green-500/10 border-green-500/30 text-green-500 hover:bg-green-500/20"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm">WhatsApp</span>
                  </Button>
                  <Button
                    onClick={handleDirections}
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Navigation className="w-6 h-6" />
                    <span className="text-sm">Directions</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <ExternalLink className="w-6 h-6" />
                    <span className="text-sm">Website</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full min-h-[400px]">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[400px] bg-gray-700 rounded-lg overflow-hidden">
                  {/* Google Maps Embed */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.8!2d80.6480!3d16.5062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMwJzIyLjQiTiA4MMKwMzgnNTguOCJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                  
                  {/* Map Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent pointer-events-none" />
                  
                  {/* Location Marker */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full"
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* WhatsApp Floating Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-30"
        >
          <Button
            onClick={handleWhatsApp}
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
