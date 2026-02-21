"use client";

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({ children, onClick, disabled, variant = 'primary' }: ButtonProps) {
  const baseClass =
    'px-4 py-2 rounded font-semibold transition-colors duration-200 ';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
  };

  const className = `${baseClass} ${variants[variant]}`;

  return (
    <button disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
