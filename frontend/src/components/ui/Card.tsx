import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { CardProps } from '../../types'

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    title, 
    subtitle, 
    image, 
    children, 
    onClick, 
    hover = true,
    ...props 
  }, ref) => {
    if (onClick) {
      return (
        <motion.button
          onClick={onClick}
          whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 cursor-pointer',
            hover && 'hover:border-white/20 hover:bg-white/10',
            className
          )}
          {...props}
        >
          {image && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={image}
                alt={title || 'Card image'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}
          
          <div className="p-6">
            {title && (
              <h3 className="text-xl font-semibold text-white mb-2">
                {title}
              </h3>
            )}
            
            {subtitle && (
              <p className="text-gray-400 text-sm mb-4">
                {subtitle}
              </p>
            )}
            
            {children}
          </div>
        </motion.button>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300',
          hover && 'hover:border-white/20 hover:bg-white/10',
          className
        )}
        {...props}
      >
        {image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title || 'Card image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        <div className="p-6">
          {title && (
            <h3 className="text-xl font-semibold text-white mb-2">
              {title}
            </h3>
          )}
          
          {subtitle && (
            <p className="text-gray-400 text-sm mb-4">
              {subtitle}
            </p>
          )}
          
          {children}
        </div>
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content Component
interface CardContentProps {
  className?: string
  children: React.ReactNode
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 pt-0', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component
interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center p-6 pt-0', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter' 