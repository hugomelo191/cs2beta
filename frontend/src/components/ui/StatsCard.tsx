import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
  className?: string;
  gradient?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  subtitle, 
  className = "",
  gradient = false 
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      case 'neutral':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      className={`relative p-6 rounded-xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/20 group ${className}`}
      style={{
        background: gradient 
          ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'
          : 'rgba(255, 255, 255, 0.05)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.02 }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors duration-300">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
          </div>
          
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className="space-y-1">
          <div className="text-3xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {subtitle && (
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
} 