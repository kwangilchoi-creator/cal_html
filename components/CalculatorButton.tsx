import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: (label: string) => void;
  variant?: 'number' | 'operator' | 'function' | 'zero';
  active?: boolean;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'number',
  active = false
}) => {
  const baseClasses = "h-20 text-3xl font-medium rounded-full transition-all duration-150 active:scale-95 flex items-center justify-center select-none shadow-sm";
  
  let colorClasses = "";
  let widthClass = "w-20"; // Default width for circles

  switch (variant) {
    case 'operator':
      colorClasses = active 
        ? "bg-white text-orange-500 border-2 border-orange-500" 
        : "bg-orange-500 text-white hover:bg-orange-400";
      break;
    case 'function':
      colorClasses = "bg-gray-300 text-black hover:bg-gray-200";
      break;
    case 'zero':
      widthClass = "w-[176px] pl-7 justify-start"; // Span 2 columns width + gap
      colorClasses = "bg-gray-700 text-white hover:bg-gray-600";
      break;
    case 'number':
    default:
      colorClasses = "bg-gray-700 text-white hover:bg-gray-600";
      break;
  }

  return (
    <button
      className={`${baseClasses} ${widthClass} ${colorClasses}`}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;