import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white focus:ring-emerald-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white focus:ring-rose-500 shadow-sm hover:shadow-md',
    accent: 'bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white focus:ring-sky-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-emerald-500 bg-white',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white focus:ring-emerald-500 shadow-sm hover:shadow-md',
    error: 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};
