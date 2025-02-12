import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isGlass?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  isGlass = false,
  onClick,
}) => {
  const baseStyles = 'rounded-lg shadow-sm overflow-hidden';
  const glassStyles = isGlass ? `
    backdrop-filter backdrop-blur-[10px]
    bg-white bg-opacity-70
    border border-white border-opacity-30
    shadow-[0_8px_32px_0_rgba(31,38,135,0.17)]
  ` : 'bg-white';

  const cardContent = (
    <div className={`
      ${baseStyles}
      ${glassStyles}
      ${className}
      ${onClick ? 'cursor-pointer' : ''}
    `}>
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          duration: 0.2
        }}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};