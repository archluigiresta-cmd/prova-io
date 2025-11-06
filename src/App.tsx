import React, { useState } from 'react';
import {
    initialImmobili, initialInquilini, initialContratti,
    initialScadenze, initialPagamenti, initialSpese, initialVeicoli
} from './data';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Card from './components/ui/Card';
import Button from './components/ui/Button';

// Import Pages
import Dashboard from './pages/Dashboard';
import ImmobiliPage from './pages/ImmobiliPage';
import InquiliniPage from './pages/InquiliniPage';
import ContrattiPage from './pages/ContrattiPage';
import PagamentiPage from './pages/PagamentiPage';
import ScadenzePage from './pages/ScadenzePage';
import SpesePage from './pages/SpesePage';
import VeicoliPage from './pages/VeicoliPage';
import AnalisiFinanziariaPage from './pages/AnalisiFinanziariaPage';
import PlaceholderPage from './pages/PlaceholderPage';

// Import Modals
import ImmobileModal from './components/modals/ImmobileModal';
import InquilinoModal from './components/modals/InquilinoModal';
import ContrattoModal from './components/modals/ContrattoModal';
import ScadenzaModal from './components/modals/ScadenzaModal';
import VeicoloModal from './components/modals/VeicoloModal';
import SpesaModal from './components/modals/SpesaModal';
import { Building, CarFront, DollarSign, Plus } from 'lucide-react';

// --- COMPONENTE PRINCIPALE APP ---
export default function App() {
    // --- STATI ---
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginStep, setLoginStep] = useState(1);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isFabOpen, setIsFabOpen] = useState(false);
    
    // Dati
    const [immobili, setImmobili] = useState(initialImmobili);
    const [inquilini, setInquilini] = useState(initialInquilini);
    const [contratti, setContratti] = useState(initialContratti);
    const [scadenze, setScadenze] = useState(initialScadenze);
    const [pagamenti, setPagamenti] = useState(initialPagamenti);
    const [spese, setSpese] = useState(initialSpese);
    const [veicoli, setVeicoli] = useState(initialVeicoli);

    // Modali
    const [modalState, setModalState] = useState<{type: string | null, item: any}>({ type: null, item: null });

    const users = [{ id: 1, name: 'Luigi Resta', avatar: 'LR' }];
    const projects = [{ id: 1, name: 'Progetto Esempio (Demo)' }];

    // --- LOGICA LOGIN ---
    const handleUserSelect = (user) => { setSelectedUser(user); setLoginStep(2); };
    const handleLogin = (password: string) => { if (password === 'password') setLoginStep(3); else alert('Password errata'); };
    const handleProjectSelect = (project) => { setSelectedProject(project); setIsLoggedIn(true); };

    // --- LOGICA CRUD ---
    const handleOpenModal = (type, item = null) => setModalState({ type, item });
    const handleCloseModal = () => setModalState({ type: null, item: null });

    const handleSave = (itemData) => {
        const { type, item } = modalState;
        const dataMap = {
            immobile: { state: immobili, setState: setImmobili, prefix: 'imm' },
            inquilino: { state: inquilini, setState: setInquilini, prefix: 'inq' },
            contratto: { state: contratti, setState: setContratti, prefix: 'con' },
            scadenza: { state: scadenze, setState: setScadenze, prefix: 'sca' },
            veicolo: { state: veicoli, setState: setVeicoli, prefix: 'vei' },
            spesa: { state: spese, setState: setSpese, prefix: 'spe' },
        };
        const config = dataMap[type!];
        if (!config) return;

        const { state, setState, prefix } = config;

        if (item) { // Modifica
            setState(state.map(i => i.id === item.id ? { ...i, ...itemData } : i) as any);
        } else { // Aggiunta
            const newItem = { ...itemData, id: `${prefix}-${Date.now()}` };
            setState([newItem, ...state] as any);
            // Logica post-aggiunta
            if (type === 'contratto') {
                setImmobili(immobili.map(i => i.id === newItem.immobileId ? {...i, status: 'Affittato'} : i));
            }
        }
        handleCloseModal();
    };
    
    const handleDelete = (id, type) => {
        if (!window.confirm('Sei sicuro di voler eliminare questo elemento?')) return;
        
        const dataMap = {
            immobile: { state: immobili, setState: setImmobili },
            inquilino: { state: inquilini, setState: setInquilini },
            contratto: { state: contratti, setState: setContratti },
            scadenza: { state: scadenze, setState: setScadenze },
            veicolo: { state: veicoli, setState: setVeicoli },
            spesa: { state: spese, setState: setSpese },
        };
        const config = dataMap[type];
        if (!config) return;
        
        const { state, setState } = config;
        
        // Logica pre-cancellazione
        if (type === 'contratto') {
            const contrattoDaEliminare = state.find(c => c.id === id) as any;
            if (contrattoDaEliminare) {
                 setImmobili(immobili.map(i => i.id === contrattoDaEliminare.immobileId ? {...i, status: 'Libero'} : i));
            }
        }

        setState(state.filter(item => item.id !== id) as any);
    };
    
    const renderPage = () => {
        const pageTypeForModal = currentPage.endsWith('e') ? currentPage.slice(0, -1) : currentPage.slice(0,-1);
        const props = { 
            onAdd: handleOpenModal, 
            onEdit: (item) => handleOpenModal(pageTypeForModal, item), 
            onDelete: handleDelete 
        };

        switch (currentPage) {
            case 'dashboard': return <Dashboard immobili={immobili} scadenze={scadenze} spese={spese} veicoli={veicoli} />;
            case 'immobili': return <ImmobiliPage immobili={immobili} setImmobili={setImmobili} {...props} />;
            case 'inquilini': return <InquiliniPage inquilini={inquilini} contratti={contratti} immobili={immobili} {...props} />;
            case 'contratti': return <ContrattiPage contratti={contratti} immobili={immobili} inquilini={inquilini} {...props} />;
            case 'pagamenti': return <PagamentiPage pagamenti={pagamenti} contratti={contratti} immobili={immobili} inquilini={inquilini} />;
            case 'scadenze': return <ScadenzePage scadenze={scadenze} immobili={immobili} {...props} />;
            case 'spese': return <SpesePage spese={spese} immobili={immobili} veicoli={veicoli} {...props} />;
            case 'veicoli': return <VeicoliPage veicoli={veicoli} {...props} />;
            case 'analisi-finanziaria': return <AnalisiFinanziariaPage />;
            default: return <PlaceholderPage title={currentPage.replace('-', ' ')} />;
        }
    };
    
    // --- LOGIN UI ---
    if (!isLoggedIn) {
        return (
            <div className="bg-light min-h-screen flex flex-col items-center justify-center p-4">
                 <h1 className="text-4xl font-bold text-primary mb-8">Patrimonio gest pro</h1>
                <Card className="w-full max-w-md">
                    {loginStep === 1 && (
                        <>
                            <h2 className="text-xl font-bold text-center mb-6">Benvenuto</h2>
                            {users.map(user => <button key={user.id} onClick={() => handleUserSelect(user)} className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-light transition-colors mb-2"><div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">{user.avatar}</div><span className="font-semibold text-lg">{user.name}</span></button>)}
                        </>
                    )}
                    {loginStep === 2 && (
                        <>
                            <h2 className="text-xl font-bold text-center mb-1">Ciao, {selectedUser.name}</h2>
                            <p className="text-center text-gray-500 mb-6">Inserisci la password per continuare.</p>
                            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleLogin((e.currentTarget.elements.namedItem('password') as HTMLInputElement).value); }}>
                                <input type="password" name="password" placeholder="Password" className="input text-center" />
                                <Button type="submit" className="w-full mt-4">Accedi</Button>
                            </form>
                        </>
                    )}
                    {loginStep === 3 && (
                        <>
                            <h2 className="text-xl font-bold text-center mb-6">Seleziona il Progetto</h2>
                            {projects.map(project => <button key={project.id} onClick={() => handleProjectSelect(project)} className="w-full text-left p-4 rounded-lg hover:bg-light transition-colors">{project.name}</button>)}
                        </>
                    )}
                </Card>
            </div>
        );
    }
    
    // --- MAIN APP UI ---
    return (
        <div className="flex h-screen bg-light">
            <style>{`
                .fab-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 10; }
                .fab-main { width: 4rem; height: 4rem; background-color: #1E40AF; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: transform 0.3s ease; cursor: pointer; }
                .fab-main.open { transform: rotate(45deg); }
                .fab-menu { position: absolute; bottom: 5rem; right: 0; list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1rem; opacity: 0; visibility: hidden; transform: translateY(1rem); transition: all 0.3s ease; }
                .fab-container.open .fab-menu { opacity: 1; visibility: visible; transform: translateY(0); }
                .fab-menu-item { display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; }
                .fab-label { background-color: white; padding: 0.25rem 0.75rem; border-radius: 0.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.15); font-weight: 500; color: #1F2937; white-space: nowrap; }
                .fab-action-button { width: 3rem; height: 3rem; background-color: #DBEAFE; color: #1E40AF; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15); cursor: pointer; }
            `}</style>
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentPage={currentPage}
                    selectedProject={selectedProject}
                    selectedUser={selectedUser}
                    setIsLoggedIn={setIsLoggedIn}
                    setLoginStep={setLoginStep}
                />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>

            {/* FAB */}
             <div className={`fab-container ${isFabOpen ? 'open' : ''}`}>
                <ul className="fab-menu">
                    <li className="fab-menu-item"><span className="fab-label">Aggiungi Spesa</span><button onClick={() => { handleOpenModal('spesa'); setIsFabOpen(false);}} className="fab-action-button"><DollarSign size={20}/></button></li>
                    <li className="fab-menu-item"><span className="fab-label">Aggiungi Veicolo</span><button onClick={() => { handleOpenModal('veicolo'); setIsFabOpen(false);}} className="fab-action-button"><CarFront size={20}/></button></li>
                    <li className="fab-menu-item"><span className="fab-label">Aggiungi Immobile</span><button onClick={() => { handleOpenModal('immobile'); setIsFabOpen(false);}} className="fab-action-button"><Building size={20}/></button></li>
                </ul>
                <button onClick={() => setIsFabOpen(!isFabOpen)} className={`fab-main ${isFabOpen ? 'open' : ''}`}><Plus size={24} /></button>
            </div>

            {/* Modali */}
            <ImmobileModal isOpen={modalState.type === 'immobile'} onClose={handleCloseModal} onSave={handleSave} immobileToEdit={modalState.item} />
            <InquilinoModal isOpen={modalState.type === 'inquilino'} onClose={handleCloseModal} onSave={handleSave} inquilinoToEdit={modalState.item} />
            <ContrattoModal isOpen={modalState.type === 'contratto'} onClose={handleCloseModal} onSave={handleSave} contrattoToEdit={modalState.item} immobili={immobili} inquilini={inquilini} />
            <ScadenzaModal isOpen={modalState.type === 'scadenza'} onClose={handleCloseModal} onSave={handleSave} scadenzaToEdit={modalState.item} immobili={immobili} />
            <VeicoloModal isOpen={modalState.type === 'veicolo'} onClose={handleCloseModal} onSave={handleSave} veicoloToEdit={modalState.item} />
            <SpesaModal isOpen={modalState.type === 'spesa'} onClose={handleCloseModal} onSave={handleSave} spesaToEdit={modalState.item} immobili={immobili} veicoli={veicoli}/>
        </div>
    );
}
