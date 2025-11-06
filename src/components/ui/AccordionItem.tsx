import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// FIX: Add explicit types for component props.
const AccordionItem = ({ title, count, children }: { title: React.ReactNode, count: number, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-dark">{title}</span>
                    <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{count}</span>
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            {isOpen && <div className="p-4 border-t">{children}</div>}
        </div>
    );
};

export default AccordionItem;