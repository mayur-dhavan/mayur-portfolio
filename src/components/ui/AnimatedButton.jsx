import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  disabled = false,
  icon: Icon,
  iconPosition = 'right',
  ...props 
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold rounded-full cursor-pointer
    transition-all duration-300 ease-in-out
    overflow-hidden group
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 to-secondary-500
      text-white border-2 border-transparent
      shadow-glow hover:shadow-glow-lg
      hover:scale-105 active:scale-95
    `,
    secondary: `
      bg-transparent border-2 border-primary-500
      text-primary-500 hover:text-white
      hover:bg-gradient-to-r hover:from-primary-500 hover:to-secondary-500
      hover:border-transparent hover:shadow-glow
    `,
    outline: `
      bg-transparent border-2 border-white/30
      text-white hover:text-black
      backdrop-blur-sm hover:bg-white
      hover:shadow-glass hover:scale-105
    `,
    glass: `
      glass backdrop-blur-md
      text-white hover:bg-white/20
      hover:shadow-glass hover:scale-105
      border border-white/20
    `,
    neon: `
      bg-black/80 border-2 border-accent-neon
      text-accent-neon hover:text-black
      hover:bg-accent-neon hover:shadow-neon
      hover:scale-105 active:scale-95
    `,
    gradient: `
      bg-gradient-to-r from-accent-purple via-primary-500 to-accent-pink
      bg-size-200 bg-pos-0 hover:bg-pos-100
      text-white hover:shadow-glow-xl
      hover:scale-105 active:scale-95
    `,
  };

  const shimmerEffect = (
    <div className="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-12 group-hover:animate-shimmer"></div>
  );

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {shimmerEffect}
      
      <span className="relative z-10 flex items-center gap-2">
        {Icon && iconPosition === 'left' && (
          <Icon className="transition-transform group-hover:scale-110" />
        )}
        
        <motion.span
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
        
        {Icon && iconPosition === 'right' && (
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="transition-transform group-hover:scale-110" />
          </motion.div>
        )}
      </span>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 rounded-full bg-white/0 group-active:bg-white/10 transition-all duration-150"></div>
      </div>
    </motion.button>
  );
};

export default AnimatedButton;
