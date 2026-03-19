'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ThumbsUp, MessageSquare, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const reviews = [
  {
    id: 1,
    name: "Priya",
    rating: 5,
    date: "2 weeks ago",
    review: "Amazing Punugulu! The taste is exactly like homemade. Fresh ingredients and perfect timing every day. Highly recommend!",
    avatar: "👩‍🦳"
  },
  {
    id: 2,
    name: "nagaraju",
    rating: 5,
    date: "1 month ago",
    review: "Best tiffin service in kodad. The dosas are crispy and the chutneys are authentic. Never disappointed!",
    avatar: "👨‍💼"
  },
  {
    id: 3,
    name: "seenu",
    rating: 4,
    date: "1 month ago",
    review: "Good quality food and timely delivery. The morning menu is perfect for office goers. Would love more variety in evening menu.",
    avatar: "👩‍🎓"
  }
];

export const ProfessionalReviewsSection: React.FC = () => {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Customer
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-emerald-400">
              {" "}Reviews
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            See what our happy customers have to say about our food and service
          </p>

          {/* Rating Summary */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-5xl font-bold text-gray-800">{averageRating.toFixed(1)}</div>
              <div className="flex flex-col">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">{reviews.length} Reviews</p>
              </div>
            </div>

            {/* Rating Bars */}
            <div className="w-full max-w-md space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 w-8">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <CardContent className="p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-rose-100 rounded-full flex items-center justify-center text-2xl">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <Quote className="w-8 h-8 text-emerald-200" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-4 leading-relaxed">{review.review}</p>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 text-gray-500 hover:text-emerald-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Helpful</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 text-gray-500 hover:text-rose-600 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">Reply</span>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Write Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-rose-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Experience</h3>
            <p className="text-gray-600 mb-6">
              Tried our food? We'd love to hear your thoughts and help others make the right choice!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-emerald-600 hover:from-rose-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300"
            >
              <Star className="w-5 h-5 inline mr-2" />
              Write a Review
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
