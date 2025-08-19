import React from 'react';
import { motion } from 'framer-motion';

export const PulseLoader = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-cyan',
    white: 'bg-white',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export const DotLoader = ({ color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-cyan',
    white: 'bg-white',
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [-10, 0, -10] },
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-3 h-3 ${colorClasses[color]} rounded-full`}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const CircleLoader = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-cyan',
    white: 'border-white',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export const WaveLoader = ({ color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-cyan',
    white: 'bg-white',
  };

  const waveVariants = {
    initial: { scaleY: 1 },
    animate: { scaleY: [1, 2, 1] },
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-8 ${colorClasses[color]} rounded-full`}
          variants={waveVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const GradientLoader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-purple`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: `conic-gradient(
            from 0deg,
            #6366f1 0deg,
            #ec4899 120deg,
            #8b5cf6 240deg,
            #6366f1 360deg
          )`,
          mask: `radial-gradient(
            circle at center,
            transparent 40%,
            black 40%,
            black 60%,
            transparent 60%
          )`,
        }}
      />
    </div>
  );
};

export const ParticleLoader = () => {
  return (
    <div className="flex items-center justify-center relative w-20 h-20">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <motion.div
          key={index}
          className="absolute w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
          style={{
            transformOrigin: '40px 40px',
            left: '50%',
            top: '50%',
            marginLeft: '-6px',
            marginTop: '-6px',
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonLoader = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  animated = true 
}) => {
  return (
    <div className={`${width} ${height} ${className} relative overflow-hidden rounded-md bg-gray-700/30`}>
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
};

const LoadingAnimations = {
  PulseLoader,
  DotLoader,
  CircleLoader,
  WaveLoader,
  GradientLoader,
  ParticleLoader,
  SkeletonLoader,
};

export default LoadingAnimations;
