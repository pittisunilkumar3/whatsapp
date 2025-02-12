import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 100,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timer: NodeJS.Timeout;

  const showTooltip = () => {
    timer = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timer);
    setIsVisible(false);
  };

  const positions = {
    top: '-translate-y-full -translate-x-1/2 left-1/2 bottom-[calc(100%+8px)]',
    bottom: 'translate-y-2 -translate-x-1/2 left-1/2 top-full',
    left: '-translate-x-full -translate-y-1/2 top-1/2 right-[calc(100%+8px)]',
    right: 'translate-x-2 -translate-y-1/2 top-1/2 left-full',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`
              absolute z-50 px-3 py-2
              bg-white text-primary-text
              rounded-lg shadow-sm
              text-sm whitespace-nowrap
              ${positions[position]}
            `}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};