import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface FavoriteButtonProps {
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FavoriteButton({ 
  isFavorite = false, 
  onToggle, 
  size = 'md',
  className = "" 
}: FavoriteButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.(!isFavorite);
  };

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative rounded-full border transition-all duration-300 group
        ${isFavorite 
          ? 'bg-red-500/20 border-red-400/50 text-red-400' 
          : 'bg-white/5 border-white/20 text-gray-400 hover:border-red-400/50 hover:text-red-400'
        }
        ${sizeClasses[size]}
        ${className}
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect */}
      {(isFavorite || isHovered) && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500/30 blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Heart icon */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={isFavorite ? { 
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`${iconSizes[size]} transition-all duration-300 ${
            isFavorite ? 'fill-current' : 'group-hover:fill-current'
          }`}
        />
      </motion.div>

      {/* Particle effect when favorited */}
      {isFavorite && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                x: [0, (Math.cos(i * 60 * Math.PI / 180) * 20)],
                y: [0, (Math.sin(i * 60 * Math.PI / 180) * 20)],
                opacity: [1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
} 