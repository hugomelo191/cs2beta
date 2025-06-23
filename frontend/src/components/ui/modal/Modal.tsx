import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
};

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isOpen || !isMounted) {
    return null;
  }
  
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-2xl bg-[#0D0D0D] border border-cyan-400/20 rounded-xl shadow-2xl shadow-cyan-500/10"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl blur-md opacity-20 -z-10" />
              
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h2 className="text-xl font-orbitron font-bold gradient-text-cyan">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-cyan-400/20 p-1 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    modalRoot
  );
} 