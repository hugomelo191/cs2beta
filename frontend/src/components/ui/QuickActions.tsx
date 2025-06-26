import { MessageCircle, Eye, UserPlus, Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

export function QuickActions({ 
  actions, 
  className = "", 
  orientation = 'horizontal',
  showLabels = false 
}: QuickActionsProps) {
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const getVariantStyles = (variant: QuickAction['variant'] = 'secondary') => {
    const variants = {
      primary: 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/30',
      secondary: 'bg-white/5 border-white/20 text-gray-400 hover:bg-white/10 hover:text-white',
      success: 'bg-green-500/20 border-green-400/50 text-green-400 hover:bg-green-500/30',
      warning: 'bg-yellow-500/20 border-yellow-400/50 text-yellow-400 hover:bg-yellow-500/30'
    };
    return variants[variant];
  };

  const containerClasses = orientation === 'horizontal' 
    ? 'flex items-center gap-2' 
    : 'flex flex-col gap-2';

  return (
    <motion.div 
      className={`${containerClasses} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, staggerChildren: 0.05 }}
    >
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={(e) => {
            e.stopPropagation();
            action.onClick();
          }}
          onMouseEnter={() => setHoveredAction(action.id)}
          onMouseLeave={() => setHoveredAction(null)}
          className={`
            relative group flex items-center justify-center gap-2 p-2 rounded-lg border transition-all duration-300
            ${getVariantStyles(action.variant)}
            ${showLabels ? 'px-3 py-2' : 'w-8 h-8'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          {/* Glow effect */}
          {hoveredAction === action.id && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}

          {/* Icon */}
          <motion.div 
            className="relative z-10 flex items-center justify-center"
            whileHover={{ rotate: action.id === 'share' ? 15 : 0 }}
          >
            {action.icon}
          </motion.div>

          {/* Label */}
          {showLabels && (
            <span className="relative z-10 text-sm font-medium">
              {action.label}
            </span>
          )}

          {/* Tooltip for icon-only buttons */}
          {!showLabels && hoveredAction === action.id && (
            <motion.div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-white/20 rounded text-xs text-white whitespace-nowrap z-20"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              {action.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-white/20" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </motion.div>
  );
}

// Predefined action creators
export const createQuickActions = {
  viewProfile: (onClick: () => void): QuickAction => ({
    id: 'view',
    icon: <Eye className="w-4 h-4" />,
    label: 'Ver Perfil',
    onClick,
    variant: 'secondary'
  }),

  contact: (onClick: () => void): QuickAction => ({
    id: 'contact',
    icon: <MessageCircle className="w-4 h-4" />,
    label: 'Contactar',
    onClick,
    variant: 'primary'
  }),

  joinTeam: (onClick: () => void): QuickAction => ({
    id: 'join',
    icon: <UserPlus className="w-4 h-4" />,
    label: 'Candidatar',
    onClick,
    variant: 'success'
  }),

  share: (onClick: () => void): QuickAction => ({
    id: 'share',
    icon: <Share2 className="w-4 h-4" />,
    label: 'Partilhar',
    onClick,
    variant: 'secondary'
  }),

  externalLink: (onClick: () => void, label: string = 'Ver Mais'): QuickAction => ({
    id: 'external',
    icon: <ExternalLink className="w-4 h-4" />,
    label,
    onClick,
    variant: 'secondary'
  })
}; 