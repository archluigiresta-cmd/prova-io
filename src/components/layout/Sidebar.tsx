import React from 'react';
import { 
    LayoutDashboard, Home, Users, FileText, Banknote, CalendarClock, Wrench, 
    Folder, BarChart2, DollarSign, Car 
} from 'lucide-react';

type SidebarProps = {
    currentPage: string;
    setCurrentPage: (page: string) => void;
};

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'immobili', label: 'Immobili', icon: Home },
    { id: 'inquilini', label: 'Inquilini', icon: Users },
    { id: 'contratti', label: 'Contratti', icon: FileText },
    { id: 'pagamenti', label: 'Pagamenti', icon: Banknote },
    { id: 'scadenze', label: 'Scadenze', icon: CalendarClock },
    { id: 'manutenzioni', label: 'Manutenzioni', icon: Wrench },
    { id: 'spese', label: 'Spese', icon: DollarSign },
    { id: 'veicoli', label: 'Veicoli', icon: Car },
    { id: 'documenti', label: 'Documenti', icon: Folder },
    { id: 'report', label: 'Report', icon: BarChart2 },
    { id: 'analisi-finanziaria', label: 'Analisi Finanziaria', icon: BarChart2 },
];

const Sidebar = ({ currentPage, setCurrentPage }: SidebarProps) => (
    <aside className="w-64 bg-white text-gray-800 flex flex-col border-r">
        <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-blue-700">Patrimonio gest pro</h1>
        </div>
        <nav className="flex-1 p-2 space-y-1">
            {navItems.map(item => (
                <a href="#" key={item.id} onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
                   className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${currentPage === item.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}>
                    <item.icon size={20} />
                    <span>{item.label}</span>
                </a>
            ))}
        </nav>
        <div className="p-4 border-t text-xs text-gray-500">
            © 2024 Patrimonio gest pro
        </div>
    </aside>
);

export default Sidebar;
