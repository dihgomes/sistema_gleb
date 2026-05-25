import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${className}`}
          {...props}
        />
        <label className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
          {label}
        </label>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
