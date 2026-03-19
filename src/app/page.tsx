'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProfessionalMenuSection } from '@/components/menu/ProfessionalMenuSection';
import { SimpleCartSidebar } from '@/components/cart/SimpleCartSidebar';
import { SimpleLoginModal } from '@/components/auth/SimpleLoginModal';
import { CashfreePaymentModal } from '@/components/payment/FreePaymentModal';
import { FirebaseOrderSection } from '@/components/orders/FirebaseOrderSection';
import { ProfessionalContactSection } from '@/components/contact/ProfessionalContactSection';
import { ProfessionalReviewsSection } from '@/components/reviews/ProfessionalReviewsSection';
import { Order } from '@/types';
import { CartProvider, useCart } from '@/contexts/CartContext';

function HomeContent() {
  const [user, setUser] = useState<{ name: string; phone: string; uid: string } | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'menu' | 'orders'>('menu');
  const { getTotalItems, cart } = useCart();

  const handleLoginClick = () => {
    console.log('handleLoginClick called, user:', user);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (userData: { name: string; phone: string; uid: string }) => {
    console.log('handleAuthSuccess called with:', userData);
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    console.log('User logging out');
    setUser(null);
    setIsCartOpen(false);
    setIsPaymentOpen(false);
    setIsAuthOpen(false);
    setCurrentView('menu');
  };

  const handlePaymentComplete = (order: Order) => {
    console.log('Order placed:', order);
    setCurrentView('orders');
  };

  const handleCartClick = () => {
    console.log('handleCartClick called, isCartOpen:', isCartOpen);
    console.log('Current cart items:', cart);
    console.log('Total items:', getTotalItems());
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    console.log('handleCheckout called, user:', user);
    console.log('isAuthOpen before:', isAuthOpen);
    if (!user) {
      console.log('No user found, opening auth modal');
      setIsCartOpen(false);
      setIsAuthOpen(true);
      console.log('isAuthOpen after setting to true:', isAuthOpen);
    } else {
      console.log('User found, opening payment modal');
      setIsCartOpen(false);
      setIsPaymentOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onCartClick={handleCartClick} onLoginClick={handleLoginClick} user={user} onLogout={handleLogout} />

      <main>
        <HeroSection onCartClick={handleCartClick} />
        <AboutSection />

        {currentView === 'menu' ? (
          <>
            <ProfessionalMenuSection />
            <ProfessionalContactSection />
            <ProfessionalReviewsSection />
          </>
        ) : (
          user && <FirebaseOrderSection user={{ id: user.uid, name: user.name, phone: user.phone }} />
        )}
      </main>

      {/* Cart Sidebar */}
      <SimpleCartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        user={user}
      />

      {/* Auth Modal */}
      <SimpleLoginModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Payment Modal */}
      {user && (
        <CashfreePaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          user={user}
          onPaymentComplete={(order: any) => {
            console.log('Order completed:', order);
            setIsPaymentOpen(false);
          }}
        />
      )}

      {/* Mobile Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 md:hidden">
        <div className="flex">
          <button
            onClick={() => setCurrentView('menu')}
            className={`flex-1 py-3 text-center transition-colors ${currentView === 'menu'
              ? 'text-emerald-500 border-t-2 border-emerald-500'
              : 'text-gray-500'
              }`}
          >
            Menu
          </button>
          <button
            onClick={() => setCurrentView('orders')}
            className={`flex-1 py-3 text-center transition-colors ${currentView === 'orders'
              ? 'text-rose-500 border-t-2 border-rose-500'
              : 'text-gray-500'
              }`}
          >
            Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
}
