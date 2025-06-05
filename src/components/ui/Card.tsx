import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-soft overflow-hidden';
  const hoverStyles = hoverable 
    ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer' 
    : '';

  return (
    <motion.div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`p-5 border-b border-gray-100 ${className}`}>{children}</div>;
};

export const CardBody: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`p-5 border-t border-gray-100 ${className}`}>{children}</div>;
};

export default Card;