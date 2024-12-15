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
    primary: "bg-black text-white hover:bg-black/90",
    secondary: "bg-transparent border-2 border-black text-black hover:bg-black/5",
    ghost: "text-black hover:text-black/80 text-xs tracking-wide"
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