import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = ({
  children,
  className,
  variant = 'primary',
  isLoading,
  loadingText,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "w-full py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-100",
    secondary: "bg-transparent text-white border border-white hover:bg-white/10",
    ghost: "text-gray-400 hover:text-white text-xs tracking-wide"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {isLoading ? loadingText : children}
    </motion.button>
  );
}; 