'use client';

import { motion } from 'framer-motion';
import { Heart, Utensils, Award } from 'lucide-react';

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content - Image/Creative Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-rose-200 rounded-[2rem] rotate-6 transform transition-transform hover:rotate-12 duration-500" />
                            <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl flex items-center justify-center p-8 overflow-hidden group">
                                {/* Creative composition inside the card */}
                                <div className="relative w-full h-full flex flex-col items-center justify-center space-y-6">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 opacity-10"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 3.33331C10.8 3.33331 3.33334 10.8 3.33334 20C3.33334 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM20 33.3333C12.6667 33.3333 6.66668 27.3333 6.66668 20C6.66668 12.6666 12.6667 6.66665 20 6.66665C27.3333 6.66665 33.3333 12.6666 33.3333 20C33.3333 27.3333 27.3333 33.3333 20 33.3333Z' fill='%2322c55e'/%3E%3C/svg%3E")`,
                                        }}
                                    />
                                    <div className="text-7xl group-hover:scale-110 transition-transform duration-300">🍲</div>
                                    <div className="text-center">
                                        <p className="font-bold text-2xl text-gray-800">20+ Years</p>
                                        <p className="text-emerald-600 font-medium">Of Culinary Love</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
                            >
                                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">1000+</p>
                                    <p className="text-sm text-gray-500">Happy Families</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Content - Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-emerald-500 font-semibold tracking-wider uppercase text-sm"
                            >
                                Our Story
                            </motion.span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mt-2 mb-6">
                                A Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-rose-400">Authentic Taste</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                            <p>
                                Serving authentic South Indian taste for <strong className="text-emerald-600 font-semibold">20+ years</strong>, now proudly in Kodad for <strong className="text-rose-500 font-semibold">5 years</strong> ❤️.
                            </p>
                            <p>
                                Started with a passion for <strong className="text-emerald-600 font-semibold">"inti ruchulu"</strong>, we bring you the feeling of <strong className="text-rose-500 font-semibold">amma chethi vantalu</strong> in every bite. From soft idly to crispy dosa and our famous <strong className="text-orange-500 font-semibold">punugulu 🔥</strong>, everything is made fresh with love.
                            </p>
                            <p className="font-medium text-gray-800 bg-gray-50 p-4 border-l-4 border-emerald-500 rounded-r-lg italic">
                                "Meeru customers kaadu… mana kutumbam."
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm mb-1">Fresh Daily</h3>
                                    <p className="text-gray-500 text-sm">Prepared from scratch every morning</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm mb-1">Traditional Recipe</h3>
                                    <p className="text-gray-500 text-sm">Passed down through generations</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};
