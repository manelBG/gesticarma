import React from 'react';
import classNames from 'classnames';

export const Card = ({ className, children }) => {
  return (
    <div className={classNames("bg-white rounded-xl shadow-md", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ className, children }) => {
  return (
    <div className={classNames("p-4", className)}>
      {children}
    </div>
  );
};
