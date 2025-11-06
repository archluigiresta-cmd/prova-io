import React from 'react';
import { Bell } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ currentPage, selectedProject, selectedUser, setIsLoggedIn, setLoginStep }) => (
    <header className="flex-1 flex justify-between items-center p-4 bg-white border-b">
        <div>
            <h2 className="text-xl font-bold capitalize text-dark">{currentPage.replace('-', ' ')}</h2>
            <p className="text-sm text-gray-500">{selectedProject.name}</p>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => { setIsLoggedIn(false); setLoginStep(1); }}>Cambia Progetto</Button>
            <button className="text-gray-500 hover:text-primary"><Bell size={20} /></button>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">{selectedUser.avatar}</div>
                <span className="font-semibold">{selectedUser.name}</span>
            </div>
        </div>
    </header>
);

export default Header;
