import React from 'react';
import { Bell } from 'lucide-react';
import Button from '../ui/Button';

type HeaderProps = {
    currentPage: string;
    selectedProject: { name: string };
    selectedUser: { name: string; avatar: string };
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setLoginStep: (step: number) => void;
};

const Header = ({ currentPage, selectedProject, selectedUser, setIsLoggedIn, setLoginStep }: HeaderProps) => (
    <header className="flex-1 flex justify-between items-center p-4 bg-white border-b">
        <div>
            <h2 className="text-xl font-bold capitalize text-gray-800">{currentPage.replace('-', ' ')}</h2>
            <p className="text-sm text-gray-500">{selectedProject.name}</p>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={() => { setIsLoggedIn(false); setLoginStep(1); }}>Cambia Progetto</Button>
            <button className="text-gray-500 hover:text-blue-700"><Bell size={20} /></button>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">{selectedUser.avatar}</div>
                <span className="font-semibold">{selectedUser.name}</span>
            </div>
        </div>
    </header>
);

export default Header;
