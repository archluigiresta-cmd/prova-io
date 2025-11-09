import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Contratto, Immobile, Inquilino } from '../data';
import Card from './ui/Card';

interface CalendarViewProps {
    contratti: Contratto[];
    immobili: Immobile[];
    inquilini: Inquilino[];
    onEdit: (item: Contratto) => void;
}

const CalendarView = ({ contratti, immobili, inquilini, onEdit }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from the Sunday of the first week
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on the Saturday of the last week

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (d1: Date, d2: Date) => 
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const formatISODate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const contractsByStartDate = useMemo(() => {
        const map: { [key: string]: Contratto[] } = {};
        contratti.forEach(c => {
            const dateKey = c.dataInizio;
            if (!map[dateKey]) {
                map[dateKey] = [];
            }
            map[dateKey].push(c);
        });
        return map;
    }, [contratti]);


    const dates = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        dates.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft /></button>
                <h2 className="text-xl font-bold capitalize">{currentDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600">
                {daysOfWeek.map(d => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {dates.map((date, index) => {
                    const contractsOnDay = contractsByStartDate[formatISODate(date)] || [];
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = isSameDay(date, new Date());
                    
                    return (
                        <div key={index} className={`border rounded-md p-2 h-36 flex flex-col ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}`}>
                           <div className="flex justify-end">
                                <span className={`text-sm font-semibold ${isToday ? 'bg-primary text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
                                    {date.getDate()}
                                </span>
                           </div>
                           <div className="flex-1 overflow-y-auto space-y-1 mt-1">
                                {contractsOnDay.map(contract => {
                                    const immobile = immobili.find(i => i.id === contract.immobileId);
                                    const inquilino = inquilini.find(i => i.id === contract.inquilinoId);
                                    return (
                                        <button 
                                            key={contract.id} 
                                            onClick={() => onEdit(contract)}
                                            className="w-full text-left bg-blue-100 text-blue-800 p-1 rounded-md text-xs hover:bg-blue-200 transition-colors"
                                            title={`${inquilino?.nome} @ ${immobile?.nome}`}
                                        >
                                            <p className="font-semibold truncate">{inquilino?.nome}</p>
                                            <p className="truncate text-blue-700">{immobile?.nome}</p>
                                        </button>
                                    );
                                })}
                           </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default CalendarView;
