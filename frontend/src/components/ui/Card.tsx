import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
      )}
      
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;