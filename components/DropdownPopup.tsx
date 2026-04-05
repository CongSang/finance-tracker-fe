import { motion } from 'motion/react';
import React from 'react'
import { cn } from '../lib';

interface DropdownPopupProps {
  children: React.ReactNode;
	className?: string;
}

export const DropdownPopup = ({ children, className }: DropdownPopupProps) => {
	const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.15 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div 
			variants={popupVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			style={{
				width: '240px',
				boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
				transformOrigin: 'top right',
			}}
			className={cn("absolute right-0 bg-white border border-gray-100 rounded-lg py-1 z-50", className)}
		>
      {children}
    </motion.div>
  )
}
