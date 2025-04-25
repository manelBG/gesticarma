import React, { useState } from 'react';
import { cn } from '../../utils/utils';

export function Tooltip({ 
  children, 
  content, 
  position = 'bottom', 
  delay = 300,
  className
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTip = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'absolute top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'absolute right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'absolute left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'absolute left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-8 border-b-transparent',
    bottom: 'absolute left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-8 border-t-transparent',
    left: 'absolute top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-8 border-r-transparent',
    right: 'absolute top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-8 border-l-transparent',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm whitespace-nowrap",
            positionClasses[position],
            className
          )}
        >
          {content}
          <div 
            className={cn(
              "absolute w-0 h-0 border-4 border-transparent",
              arrowClasses[position]
            )}
          />
        </div>
      )}
    </div>
  );
}
