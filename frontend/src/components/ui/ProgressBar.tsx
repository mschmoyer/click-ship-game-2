import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: string;
  animated?: boolean;
  duration?: number; // in seconds
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-primary',
  height = 'h-2',
  animated = false,
  duration = 3,
  className = '',
}) => {
  // Log props for debugging
  console.log("ProgressBar props:", { progress, color, animated, duration });
  
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  // Animation style
  const animationStyle = animated
    ? {
        animationDuration: `${duration}s`,
        '--duration': `${duration}s`,
      } as React.CSSProperties
    : {};
    
  console.log("ProgressBar rendering with width:", `${clampedProgress}%`, "animated:", animated);
  
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${height} ${className}`}>
      {animated ? (
        // When animated, use a fixed width div with the animate-progress class
        <div
          className={`${color} animate-progress`}
          style={{
            ...animationStyle,
          }}
        />
      ) : (
        // When not animated, use a div with width based on progress
        <div
          className={`${color} transition-all duration-300 ease-in-out`}
          style={{
            width: `${clampedProgress}%`,
          }}
        />
      )}
    </div>
  );
};

export default ProgressBar;