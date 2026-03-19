import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={`bg-gray-800 rounded-xl border border-gray-700 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};
