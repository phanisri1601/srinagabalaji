'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Review } from '@/types';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockReviews: Review[] = [
          {
            id: '1',
            userName: 'Ravi Kumar',
            rating: 5,
            comment: 'Amazing Punugulu! The taste is authentic and reminds me of home. Quick service and reasonable prices.',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            userName: 'Priya Sharma',
            rating: 4,
            comment: 'Great food quality and hygiene. The dosa was perfectly crispy. Would definitely recommend to friends.',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            userName: 'Suresh Reddy',
            rating: 5,
            comment: 'Best tiffin centre in Vijayawada! Their morning menu is fantastic. Punugulu is a must-try!',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: '4',
            userName: 'Anjali Nair',
            rating: 4,
            comment: 'Good variety and taste. The portion sizes are generous. Only suggestion - improve packaging for takeaways.',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
          },
          {
            id: '5',
            userName: 'Mahesh Babu',
            rating: 5,
            comment: 'Excellent quality and service. The chitti punugulu in evening menu is my favorite. Keep up the good work!',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          }
        ];
        
        setReviews(mockReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (!newReview.userName.trim() || !newReview.comment.trim()) {
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date()
    };

    setReviews([review, ...reviews]);
    setNewReview({ userName: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Customer Reviews
          </h2>
          <p className="text-gray-400 mb-6">
            See what our customers say about us
          </p>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-orange-500">{averageRating}</span>
              <div className="flex">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
            </div>
            <div className="text-gray-400">
              <span className="font-medium">{reviews.length}</span> reviews
            </div>
          </div>

          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
          >
            Write a Review
          </Button>
        </motion.div>

        {/* Review Form */}
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-white">Share Your Experience</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    label="Your Name"
                    type="text"
                    placeholder="Enter your name"
                    value={newReview.userName}
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  {renderStars(newReview.rating, true, (rating) =>
                    setNewReview({ ...newReview, rating })
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Share your experience with us..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleSubmitReview}>
                    Submit Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{review.userName}</h4>
                        <p className="text-sm text-gray-400">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <Quote className="w-5 h-5 text-gray-600" />
                  </div>

                  <div className="mb-3">
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Helpful</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {reviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Be the first to share your experience with us!
            </p>
            <Button onClick={() => setShowReviewForm(true)}>
              Write First Review
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
