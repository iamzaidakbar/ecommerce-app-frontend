import { motion, AnimatePresence } from "framer-motion";
import { IoWarningOutline, IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";

interface AlertProps {
  message: string | null;
  onClose?: () => void;
  type?: 'error' | 'success';
}

export const Alert = ({ message, onClose, type = 'error' }: AlertProps) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`rounded-lg p-4 mb-6 flex items-center justify-between
          ${type === 'error' 
            ? 'bg-red-500/10 border border-red-500/50 text-red-500' 
            : 'bg-green-500/10 border border-green-500/50 text-green-500'
          }`}
      >
        <div className="flex items-center gap-2">
          {type === 'error' 
            ? <IoWarningOutline className="text-xl" />
            : <IoCheckmarkCircleOutline className="text-xl" />
          }
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}; 