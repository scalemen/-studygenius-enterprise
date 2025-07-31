import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const spinnerVariants = cva(
  'animate-spin rounded-full border-solid',
  {
    variants: {
      variant: {
        default: 'border-muted border-t-primary',
        primary: 'border-primary/20 border-t-primary',
        secondary: 'border-secondary/20 border-t-secondary',
        destructive: 'border-destructive/20 border-t-destructive',
        success: 'border-green-200 border-t-green-500',
        warning: 'border-yellow-200 border-t-yellow-500',
        gradient: 'border-transparent bg-gradient-to-r from-primary to-secondary bg-clip-border',
        dots: 'border-none',
        pulse: 'border-primary/20 border-t-primary animate-pulse',
      },
      size: {
        xs: 'h-3 w-3 border-[1px]',
        sm: 'h-4 w-4 border-[1.5px]',
        default: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-2',
        xl: 'h-12 w-12 border-[3px]',
        '2xl': 'h-16 w-16 border-4',
      },
      speed: {
        slow: 'animate-[spin_2s_linear_infinite]',
        default: 'animate-spin',
        fast: 'animate-[spin_0.5s_linear_infinite]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      speed: 'default',
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
  showLabel?: boolean;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, variant, size, speed, label = 'Loading...', showLabel = false, ...props }, ref) => {
    if (variant === 'dots') {
      return (
        <div ref={ref} className={cn('flex items-center space-x-1', className)} {...props}>
          <div className={cn('rounded-full bg-primary animate-bounce', size === 'xs' ? 'h-1 w-1' : size === 'sm' ? 'h-1.5 w-1.5' : size === 'default' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : size === 'xl' ? 'h-4 w-4' : 'h-5 w-5')} style={{ animationDelay: '0ms' }} />
          <div className={cn('rounded-full bg-primary animate-bounce', size === 'xs' ? 'h-1 w-1' : size === 'sm' ? 'h-1.5 w-1.5' : size === 'default' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : size === 'xl' ? 'h-4 w-4' : 'h-5 w-5')} style={{ animationDelay: '150ms' }} />
          <div className={cn('rounded-full bg-primary animate-bounce', size === 'xs' ? 'h-1 w-1' : size === 'sm' ? 'h-1.5 w-1.5' : size === 'default' ? 'h-2 w-2' : size === 'lg' ? 'h-3 w-3' : size === 'xl' ? 'h-4 w-4' : 'h-5 w-5')} style={{ animationDelay: '300ms' }} />
          {showLabel && (
            <span className="ml-2 text-sm text-muted-foreground">{label}</span>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('flex items-center', className)} {...props}>
        <div
          className={cn(spinnerVariants({ variant, size, speed }))}
          role="status"
          aria-label={label}
        />
        {showLabel && (
          <span className="ml-2 text-sm text-muted-foreground">{label}</span>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

// Overlay Spinner Component
export interface OverlaySpinnerProps extends LoadingSpinnerProps {
  show: boolean;
  backdrop?: boolean;
  backdropClassName?: string;
}

const OverlaySpinner = React.forwardRef<HTMLDivElement, OverlaySpinnerProps>(
  ({ 
    show, 
    backdrop = true, 
    backdropClassName, 
    className, 
    variant = 'primary', 
    size = 'xl', 
    showLabel = true,
    ...props 
  }, ref) => {
    if (!show) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          backdrop && 'bg-background/80 backdrop-blur-sm',
          backdropClassName
        )}
      >
        <div className={cn('glass-card p-6 rounded-lg', className)}>
          <LoadingSpinner
            variant={variant}
            size={size}
            showLabel={showLabel}
            {...props}
          />
        </div>
      </div>
    );
  }
);

OverlaySpinner.displayName = 'OverlaySpinner';

// Progress Spinner Component
export interface ProgressSpinnerProps extends Omit<LoadingSpinnerProps, 'variant'> {
  progress: number; // 0-100
  strokeWidth?: number;
  showPercentage?: boolean;
}

const ProgressSpinner = React.forwardRef<HTMLDivElement, ProgressSpinnerProps>(
  ({ 
    progress, 
    size = 'lg', 
    strokeWidth = 2, 
    showPercentage = false,
    className,
    ...props 
  }, ref) => {
    const radius = size === 'xs' ? 6 : size === 'sm' ? 8 : size === 'default' ? 12 : size === 'lg' ? 16 : size === 'xl' ? 24 : 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div ref={ref} className={cn('relative inline-flex items-center justify-center', className)} {...props}>
        <svg
          className={cn(
            'transform -rotate-90',
            size === 'xs' ? 'h-4 w-4' : 
            size === 'sm' ? 'h-6 w-6' : 
            size === 'default' ? 'h-8 w-8' : 
            size === 'lg' ? 'h-12 w-12' : 
            size === 'xl' ? 'h-16 w-16' : 'h-20 w-20'
          )}
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-300"
          />
        </svg>
        {showPercentage && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {Math.round(progress)}%
          </span>
        )}
      </div>
    );
  }
);

ProgressSpinner.displayName = 'ProgressSpinner';

// Skeleton Loader Component
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant = 'rectangular', 
    width, 
    height, 
    lines = 1, 
    animation = 'pulse',
    style,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'bg-muted',
      animation === 'pulse' && 'animate-pulse',
      animation === 'wave' && 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
      variant === 'text' && 'h-4 rounded',
      variant === 'circular' && 'rounded-full',
      variant === 'rectangular' && '',
      variant === 'rounded' && 'rounded-lg',
      className
    );

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className="space-y-2" {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClasses,
                i === lines - 1 && 'w-3/4' // Last line is shorter
              )}
              style={{
                width: i === lines - 1 ? '75%' : width,
                height,
                ...style,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

export { LoadingSpinner, OverlaySpinner, ProgressSpinner, Skeleton, spinnerVariants };