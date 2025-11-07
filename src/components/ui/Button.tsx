import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    [key: string]: any; // Per altre props come `disabled`
};

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }: ButtonProps) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
        primary: 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-700',
        secondary: 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-700',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    return <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

export default Button;
