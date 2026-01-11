
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', variant = 'primary' }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-white hover:bg-gray-100 text-slate-800",
    danger: "bg-red-500 hover:bg-red-600 text-white"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
