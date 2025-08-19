import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  variant = 'glass',
  hoverable = true,
  delay = 0,
  direction = 'up',
  ...props 
}) => {
  const baseClasses = `
    relative rounded-2xl p-6 
    transition-all duration-300 ease-in-out
    overflow-hidden group
  `;

  const variantClasses = {
    glass: `
      bg-white/10 backdrop-blur-md
      border border-white/20
      hover:bg-white/15 hover:border-white/30
      shadow-glass hover:shadow-glow
    `,
    solid: `
      bg-gray-900/90 backdrop-blur-sm
      border border-gray-700/50
      hover:bg-gray-800/90 hover:border-gray-600/50
      shadow-xl hover:shadow-2xl
    `,
    gradient: `
      bg-gradient-to-br from-primary-500/20 to-secondary-500/20
      backdrop-blur-md border border-white/20
      hover:from-primary-500/30 hover:to-secondary-500/30
      shadow-glow hover:shadow-glow-lg
    `,
    neon: `
      bg-black/80 backdrop-blur-sm
      border-2 border-accent-cyan/50
      hover:border-accent-cyan hover:shadow-neon
      text-white
    `,
    minimal: `
      bg-transparent backdrop-blur-none
      border border-gray-600/30
      hover:border-gray-400/50 hover:bg-white/5
    `,
  };

  const hoverClasses = hoverable ? 'hover:scale-105 hover:-translate-y-2' : '';

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.25, 0, 1],
      },
    },
    hover: hoverable ? {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.25, 0, 1],
      },
    } : {},
  };

  const backgroundEffect = (
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-500/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </div>
  );

  const shimmerOverlay = (
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out">
      <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
    </div>
  );

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      {...props}
    >
      {backgroundEffect}
      {shimmerOverlay}
      
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
    </motion.div>
  );
};

export default AnimatedCard;
