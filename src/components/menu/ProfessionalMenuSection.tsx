'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProfessionalMenuCard } from '@/components/menu/ProfessionalMenuCard';
import { getCurrentMenu } from '@/data/menu';

export const ProfessionalMenuSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'morning' | 'evening'>('morning');
  
  const allMenuItems = getCurrentMenu();
  const morningItems = allMenuItems.filter(item => item.category === 'morning');
  const eveningItems = allMenuItems.filter(item => item.category === 'evening');

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-emerald-50 via-white to-rose-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
            <Utensils className="w-4 h-4" />
            <span className="text-sm font-medium">Our Menu</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Fresh & Delicious
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-rose-400">
              {" "}South Indian Food
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience authentic flavors with our time-based menu. 
            Each item is prepared fresh with love and tradition.
          </p>

          {/* Time Tabs */}
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1 mb-8">
            <button
              onClick={() => setActiveTab('morning')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'morning'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>Morning Menu</span>
              <span className="text-xs opacity-75">(6AM - 11AM)</span>
            </button>
            <button
              onClick={() => setActiveTab('evening')}
              className={`px-8 py-3 rounded-md font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'evening'
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>Evening Menu</span>
              <span className="text-xs opacity-75">(4:30PM - 9:30PM)</span>
            </button>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === 'morning' ? morningItems : eveningItems).map((item: any, index: number) => (
            <ProfessionalMenuCard
              key={item.id}
              item={{
                ...item,
                description: item.description || `Delicious ${item.name} prepared with authentic ingredients`,
                prepTime: item.prepTime || '15-20 mins'
              }}
              delay={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {(activeTab === 'morning' ? morningItems : eveningItems).length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No items available
            </h3>
            <p className="text-gray-600 mb-8">
              {activeTab === 'morning' 
                ? 'Morning menu is not available at this time. Please check back during 6AM - 11AM.'
                : 'Evening menu is not available at this time. Please check back during 4:30PM - 9:30PM.'
              }
            </p>
            <Button
              onClick={() => setActiveTab(activeTab === 'morning' ? 'evening' : 'morning')}
              variant="outline"
              className="border-emerald-200 text-gray-700"
            >
              Switch to {activeTab === 'morning' ? 'Evening' : 'Morning'} Menu
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
