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
            "autofill:bg-transparent",
            "[-webkit-autofill:active]:bg-transparent [-webkit-autofill:hover]:bg-transparent [-webkit-autofill:focus]:bg-transparent [-webkit-autofill]:bg-transparent",
            "[-webkit-autofill]:text-white [-webkit-autofill:focus]:text-white [-webkit-autofill:active]:text-white [-webkit-autofill:hover]:text-white",
            "[-webkit-autofill]:shadow-[0_0_0_30px_rgb(0,0,0)_inset]",
            error ? 'border-red-500' : 'border-gray-600 focus:border-white',
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