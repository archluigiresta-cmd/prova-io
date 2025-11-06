import React from 'react';

// FIX: Use a type alias for props to fix issues with implicit children and special props like `key`.
type CardProps = {
    children: React.ReactNode,
    className?: string,
};

const Card = ({ children, className = '' }: CardProps) => <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>{children}</div>;

export default Card;
