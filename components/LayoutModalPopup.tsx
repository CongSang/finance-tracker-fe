'use client'

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutModalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string | null;
  subtitle?: string;
}

export const LayoutModalPopup = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  subtitle = "" 
}: LayoutModalPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
              className="relative pointer-events-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-on-surface-variant hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className='p-8'>
                {title && (
                  <div className="mb-4 md:mb-8">
                    <h1 className="font-extrabold text-primary tracking-tight">
                      {title}
                    </h1>
                    <p className="mt-1">
                      {subtitle}
                    </p>
                  </div>
                )}

                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};