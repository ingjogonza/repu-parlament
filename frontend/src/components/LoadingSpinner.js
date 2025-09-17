import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-3 border-slate-200 border-t-primary-600`}></div>
      {message && (
        <p className="mt-3 text-sm text-slate-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
