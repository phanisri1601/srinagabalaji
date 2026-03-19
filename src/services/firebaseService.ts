import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Order, Review } from '@/types';

// User Services
export const userService = {
  async createUser(userData: { name: string; phone: string; uid: string }) {
    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('User created successfully:', userData);
      return userData;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserByPhone(phone: string) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phone', '==', phone));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error getting user by phone:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },
    async updateUser(uid: string, userData: Partial<User>) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

// Order Services
export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>) {
    try {
      const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const orderRef = doc(db, 'orders', orderId);
      
      const order: Order = {
        ...orderData,
        id: orderId,
        createdAt: new Date()
      };
      
      await setDoc(orderRef, {
        ...order,
        createdAt: serverTimestamp()
      });
      
      console.log('Order created successfully:', order);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
      console.log('Order status updated:', orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async getUserOrders(userId: string) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('user.id', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Order[];
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  },

  async getAllOrders() {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Order[];
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }
};

// Payment Services
export const paymentService = {
  async createPayment(paymentData: {
    orderId: string;
    userId: string;
    amount: number;
    method: 'upi';
    upiId: string;
    status: 'pending' | 'completed' | 'failed';
  }) {
    try {
      const paymentId = `PAY${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const paymentRef = doc(db, 'payments', paymentId);
      
      await setDoc(paymentRef, {
        ...paymentData,
        id: paymentId,
        createdAt: serverTimestamp()
      });
      
      console.log('Payment created successfully:', paymentId);
      return paymentId;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  async updatePaymentStatus(paymentId: string, status: 'pending' | 'completed' | 'failed') {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        status,
        updatedAt: serverTimestamp()
      });
      console.log('Payment status updated:', paymentId, status);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};

// Review Services
export const reviewService = {
  async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    try {
      const reviewId = `REV${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const reviewRef = doc(db, 'reviews', reviewId);
      
      const review: Review = {
        ...reviewData,
        id: reviewId,
        createdAt: new Date()
      };
      
      await setDoc(reviewRef, {
        ...review,
        createdAt: serverTimestamp()
      });
      
      console.log('Review created successfully:', review);
      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  async getAllReviews() {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Review[];
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  }
};
