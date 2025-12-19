import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '',
  fullWidth = false
}) => {
  return (
    <div className={`pt-20 min-h-screen ${fullWidth ? 'w-full' : 'container mx-auto px-4'} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
