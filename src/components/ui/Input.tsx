import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          ref={ref}
          className={cn(
            "w-full bg-transparent border-b text-sm py-2.5 focus:outline-none transition-colors disabled:opacity-50",
            "text-black dark:text-white",
            error 
              ? 'border-red-500' 
              : 'border-gray-300 dark:border-gray-500 focus:border-black dark:focus:border-white',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 