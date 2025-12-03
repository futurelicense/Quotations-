import React from 'react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: {
    value: string;
    label: string;
  }[];
  fullWidth?: boolean;
}
export function Select({
  label,
  error,
  options,
  fullWidth = true,
  className = '',
  ...props
}: SelectProps) {
  return <div className={fullWidth ? 'w-full' : ''}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>}
      <select className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `} {...props}>
        {options.map(option => <option key={option.value} value={option.value}>
            {option.label}
          </option>)}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>;
}