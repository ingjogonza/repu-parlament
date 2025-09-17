import React from 'react';

const Selector = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Selecciona una opción', 
  disabled = false,
  loading = false,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className={`input-field w-full pr-10 ${
            disabled || loading 
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
              : 'bg-white cursor-pointer hover:border-slate-400'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-300 border-t-primary-600"></div>
          </div>
        )}
        
        {!loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Selector;
