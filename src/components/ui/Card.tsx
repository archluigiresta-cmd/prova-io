import React from 'react';

// FIX: Add explicit types for component props.
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>{children}</div>;

export default Card;