import React, { useState, useEffect, useMemo } from 'react';
import { 
    LayoutDashboard, Home, Users, FileText, Banknote, CalendarClock, Wrench, 
    Folder, BarChart2, DollarSign, Car, ChevronDown, ChevronUp, Plus, X, 
    Edit, Trash2, Building, CarFront, FilePlus, LogOut, Settings, Bell, 
    UserCircle, Search, Calendar as CalendarIcon, UploadCloud, List, Grip, Mail, Phone
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

// --- TIPI DI DATI ---
type Immobile = { id: string; nome: string; indirizzo: string; tipo: string; superficie: number; locali: number; canone: number; immagine: string; status: 'Affittato' | 'Libero' };
type Inquilino = { id: string; nome: string; email: string; telefono: string; };
type Contratto = { id: string; immobileId: string; inquilinoId: string; dataInizio: string; dataFine: string; canone: number; };
type Scadenza = { id: string; immobileId: string; titolo: string; data: string; tipo: 'Affitto' | 'Tassa' | 'Utenza' | 'Manutenzione' };
type Pagamento = { id: string; contrattoId: string; importo: number; data: string; stato: 'Pagato' | 'In Attesa' | 'In Ritardo' };
type Spesa = { id: string; tipo: string; importo: number; data: string; immobileId?: string; veicoloId?: string; };
type Veicolo = { id: string; nome: string; targa: string; modello: string; assicurazione: string; bollo: string; stato: 'Operativo' | 'Manutenzione' };

// --- DATI DI ESEMPIO ---
const initialImmobili: Immobile[] = [
    { id: 'imm-001', nome: 'Villa Paradiso', indirizzo: 'Via Roma 1, Milano', tipo: 'Villa', superficie: 250, locali: 7, canone: 3500, immagine: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Affittato' },
    { id: 'imm-002', nome: 'Appartamento Centrale', indirizzo: 'Corso Buenos Aires 10, Milano', tipo: 'Appartamento', superficie: 80, locali: 3, canone: 1200, immagine: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Affittato' },
    { id: 'imm-003', nome: 'Ufficio Moderno', indirizzo: 'Piazza Duomo 5, Milano', tipo: 'Ufficio', superficie: 120, locali: 4, canone: 2500, immagine: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Libero' },
];

const initialInquilini: Inquilino[] = [
    { id: 'inq-001', nome: 'Mario Rossi', email: 'mario.rossi@email.com', telefono: '3331234567' },
    { id: 'inq-002', nome: 'Laura Bianchi', email: 'laura.bianchi@email.com', telefono: '3337654321' },
];

const initialContratti: Contratto[] = [
    { id: 'con-001', immobileId: 'imm-001', inquilinoId: 'inq-001', dataInizio: '2023-01-01', dataFine: '2026-12-31', canone: 3500 },
    { id: 'con-002', immobileId: 'imm-002', inquilinoId: 'inq-002', dataInizio: '2022-06-01', dataFine: '2025-05-31', canone: 1200 },
];

const initialScadenze: Scadenza[] = [
    { id: 'sca-001', immobileId: 'imm-001', titolo: 'Pagamento affitto', data: '2025-11-05', tipo: 'Affitto' },
    { id: 'sca-002', immobileId: 'imm-002', titolo: 'Pagamento affitto', data: '2025-11-05', tipo: 'Affitto' },
    { id: 'sca-003', immobileId: 'imm-001', titolo: 'Tassa Rifiuti (TARI)', data: '2025-11-16', tipo: 'Tassa' },
];

const initialPagamenti: Pagamento[] = [
    { id: 'pag-001', contrattoId: 'con-001', importo: 3500, data: '2025-10-05', stato: 'Pagato' },
    { id: 'pag-002', contrattoId: 'con-002', importo: 1200, data: '2025-10-05', stato: 'Pagato' },
    { id: 'pag-003', contrattoId: 'con-001', importo: 3500, data: '2025-11-05', stato: 'In Attesa' },
];

const initialSpese: Spesa[] = [
    { id: 'spe-001', tipo: 'Manutenzione', importo: 250, data: '2024-10-15', immobileId: 'imm-001' },
    { id: 'spe-002', tipo: 'Assicurazione', importo: 800, data: '2024-09-20', veicoloId: 'vei-001' },
    { id: 'spe-003', tipo: 'Utenze', importo: 150, data: '2024-10-25', immobileId: 'imm-002' },
];

const initialVeicoli: Veicolo[] = [
    { id: 'vei-001', nome: 'Audi A4', targa: 'AB123CD', modello: 'Berlina', assicurazione: '2025-09-20', bollo: '2025-07-31', stato: 'Operativo' },
    { id: 'vei-002', nome: 'Fiat 500', targa: 'EF456GH', modello: 'City Car', assicurazione: '2025-11-10', bollo: '2025-08-31', stato: 'Operativo' },
];

// --- COMPONENTI UI GENERICI ---
const Card = ({ children, className = '' }) => <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>{children}</div>;
// FIX: Updated Button component to accept arbitrary props (like 'type') and handle optional onClick.
const Button = ({ children, onClick, variant = 'primary', className = '', ...props }: any) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
        secondary: 'bg-secondary text-primary hover:bg-blue-200 focus:ring-primary',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    return <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <h2 className="text-xl font-bold text-dark mb-4">{title}</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                {children}
            </div>
        </div>
    );
};

// --- PAGINE SPECIFICHE ---
const Dashboard = ({ immobili, scadenze, spese, veicoli }) => {
    const prossimeScadenze = scadenze.slice(0, 3);
    const recentiSpese = spese.slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h3 className="text-gray-500">Immobili Gestiti</h3><p className="text-3xl font-bold">{immobili.length}</p></Card>
                <Card><h3 className="text-gray-500">Veicoli Posseduti</h3><p className="text-3xl font-bold">{veicoli.length}</p></Card>
                <Card><h3 className="text-gray-500">Entrate Mensili</h3><p className="text-3xl font-bold">€{immobili.reduce((acc, i) => acc + (i.status === 'Affittato' ? i.canone : 0), 0)}</p></Card>
                <Card><h3 className="text-gray-500">Scadenze nel Mese</h3><p className="text-3xl font-bold">{scadenze.length}</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold text-lg mb-4">Prossime Scadenze</h3>
                    <ul className="space-y-3">
                        {prossimeScadenze.map(s => <li key={s.id} className="flex justify-between items-center"><span>{s.titolo}</span><span className="font-semibold text-gray-600">{s.data}</span></li>)}
                    </ul>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Spese Recenti</h3>
                    <ul className="space-y-3">
                        {recentiSpese.map(s => <li key={s.id} className="flex justify-between items-center"><span>{s.tipo}</span><span className="font-semibold text-red-500">- €{s.importo}</span></li>)}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

const ImmobiliPage = ({ immobili, setImmobili, onAdd, onEdit, onDelete }) => {
    const [viewMode, setViewMode] = useState('grid');
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark">Elenco Immobili</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => alert('Funzione da implementare!')} className="p-2 rounded-md hover:bg-gray-100 text-gray-600"><UploadCloud className="inline-block mr-2"/> Importa da Excel</button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-secondary text-primary' : 'hover:bg-gray-100 text-gray-600'}`}><List/></button>
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-secondary text-primary' : 'hover:bg-gray-100 text-gray-600'}`}><Grip/></button>
                    <Button onClick={() => onAdd('immobile')}><Plus className="inline-block mr-2" size={16}/> Aggiungi Immobile</Button>
                </div>
            </div>
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {immobili.map(i => (
                        <div key={i.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <img src={i.immagine} alt={i.nome} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${i.status === 'Affittato' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{i.status}</span>
                                <h3 className="font-bold text-lg mt-2">{i.nome}</h3>
                                <p className="text-gray-600 text-sm">{i.indirizzo}</p>
                                <p className="text-gray-500 text-sm">{i.superficie} mq - {i.locali} locali</p>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-between items-center">
                                <span className="font-bold text-primary text-lg">€{i.canone}/mese</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onEdit(i)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                                    <button onClick={() => onDelete(i.id, 'immobile')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                 <Card className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 font-semibold">Nome Immobile</th>
                                <th className="p-4 font-semibold">Indirizzo</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Canone</th>
                                <th className="p-4 font-semibold">Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {immobili.map(i => (
                                <tr key={i.id} className="border-b">
                                    <td className="p-4 font-semibold">{i.nome}</td>
                                    <td className="p-4 text-gray-600">{i.indirizzo}</td>
                                    <td className="p-4">
                                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${i.status === 'Affittato' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{i.status}</span>
                                    </td>
                                    <td className="p-4 font-semibold text-gray-800">€{i.canone}</td>
                                    <td className="p-4">
                                         <div className="flex gap-2">
                                            <button onClick={() => onEdit(i)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                                            <button onClick={() => onDelete(i.id, 'immobile')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </div>
    );
};

const AccordionItem = ({ title, count, children }) => {
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

const InquiliniPage = ({ inquilini, contratti, immobili, onAdd, onEdit, onDelete }) => {
    const immobiliConInquilini = useMemo(() => {
        return immobili.map(immobile => {
            const contrattiImmobile = contratti.filter(c => c.immobileId === immobile.id);
            const inquiliniImmobile = contrattiImmobile.map(c => inquilini.find(i => i.id === c.inquilinoId)).filter(Boolean);
            return { ...immobile, inquilini: inquiliniImmobile as Inquilino[] };
        }).filter(i => i.inquilini.length > 0);
    }, [immobili, inquilini, contratti]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark">Elenco Inquilini</h1>
                <Button onClick={() => onAdd('inquilino')}><Plus className="inline-block mr-2" size={16}/> Aggiungi Inquilino</Button>
            </div>
            <div className="space-y-4">
                {immobiliConInquilini.map(immobile => (
                    <AccordionItem key={immobile.id} title={immobile.nome} count={immobile.inquilini.length}>
                        <div className="space-y-3">
                            {immobile.inquilini.map(inquilino => (
                                <div key={inquilino.id} className="flex justify-between items-center p-3 bg-light rounded-md">
                                    <div>
                                        <p className="font-semibold">{inquilino.nome}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1.5"><Mail size={14}/> {inquilino.email}</span>
                                            <span className="flex items-center gap-1.5"><Phone size={14}/> {inquilino.telefono}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(inquilino)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                                        <button onClick={() => onDelete(inquilino.id, 'inquilino')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};

const ContrattiPage = ({ contratti, immobili, inquilini, onAdd, onEdit, onDelete }) => {
    const immobiliConContratti = useMemo(() => {
        return immobili.map(immobile => ({
            ...immobile,
            contratti: contratti.filter(c => c.immobileId === immobile.id)
        })).filter(i => i.contratti.length > 0);
    }, [immobili, contratti]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark">Gestione Contratti</h1>
                <Button onClick={() => onAdd('contratto')}><Plus className="inline-block mr-2" size={16}/> Nuovo Contratto</Button>
            </div>
            <div className="space-y-4">
                {immobiliConContratti.map(immobile => (
                    <AccordionItem key={immobile.id} title={immobile.nome} count={immobile.contratti.length}>
                        {immobile.contratti.map(contratto => {
                            const inquilino = inquilini.find(i => i.id === contratto.inquilinoId);
                            return (
                                <div key={contratto.id} className="p-3 bg-light rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Contratto con {inquilino?.nome || 'N/D'}</p>
                                        <p className="text-sm text-gray-600">Dal {contratto.dataInizio} al {contratto.dataFine}</p>
                                        <p className="text-sm font-bold text-primary mt-1">€{contratto.canone}/mese</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(contratto)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                                        <button onClick={() => onDelete(contratto.id, 'contratto')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            );
                        })}
                    </AccordionItem>
                ))}
            </div>
        </div>
    );
};

const PagamentiPage = ({ pagamenti, contratti, immobili, inquilini }) => {
    const [filtroStato, setFiltroStato] = useState('Tutti');
    
    const pagamentiCompleti = useMemo(() => {
        return pagamenti.map(p => {
            const contratto = contratti.find(c => c.id === p.contrattoId);
            if (!contratto) return null;
            const immobile = immobili.find(i => i.id === contratto.immobileId);
            const inquilino = inquilini.find(i => i.id === contratto.inquilinoId);
            return { ...p, immobile, inquilino };
        }).filter(Boolean);
    }, [pagamenti, contratti, immobili, inquilini]);

    const pagamentiFiltrati = pagamentiCompleti.filter(p => filtroStato === 'Tutti' || p!.stato === filtroStato);

    const pagamentiPerImmobile = pagamentiFiltrati.reduce((acc, p) => {
        const immobileId = p!.immobile!.id;
        if (!acc[immobileId]) {
            acc[immobileId] = { immobile: p!.immobile, pagamenti: [] };
        }
        acc[immobileId].pagamenti.push(p);
        return acc;
    }, {} as any);
    
    const totale = pagamentiFiltrati.reduce((sum, p) => p!.stato === 'Pagato' ? sum + p!.importo : sum, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark">Registro Pagamenti e Entrate</h1>
                <div className="flex items-center gap-2">
                    {/* FIX: Added missing onClick prop */}
                    <Button onClick={() => alert('Funzione da implementare!')} variant="secondary">Esporta CSV</Button>
                    {/* FIX: Added missing onClick prop */}
                    <Button onClick={() => alert('Funzione da implementare!')}>Registra Pagamento</Button>
                </div>
            </div>
            <Card className="mb-6">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Filtra per Immobile</label>
                        <select className="input mt-1"><option>Tutti gli immobili</option></select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Cerca Inquilino</label>
                        <input type="text" placeholder="Nome inquilino..." className="input mt-1"/>
                    </div>
                </div>
                <div className="mt-4 border-b">
                    <div className="flex gap-4">
                        {['Tutti', 'Pagato', 'In Attesa', 'In Ritardo'].map(stato => (
                            <button key={stato} onClick={() => setFiltroStato(stato)}
                                className={`py-2 px-1 font-semibold ${filtroStato === stato ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                                {stato}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

             <div className="space-y-4">
                {Object.values(pagamentiPerImmobile).map(({immobile, pagamenti}: any) => (
                    <AccordionItem key={immobile.id} title={immobile.nome} count={pagamenti.length}>
                       <table className="w-full text-left">
                           <thead><tr className="border-b">
                               <th className="p-2">Inquilino</th><th className="p-2">Data</th>
                               <th className="p-2">Importo</th><th className="p-2">Stato</th>
                           </tr></thead>
                           <tbody>
                               {pagamenti.map((p: any) => {
                                   const statoClass = {
                                       'Pagato': 'bg-green-100 text-green-800',
                                       'In Attesa': 'bg-yellow-100 text-yellow-800',
                                       'In Ritardo': 'bg-red-100 text-red-800'
                                   }[p.stato];
                                   return <tr key={p.id} className="border-b">
                                       <td className="p-2">{p.inquilino.nome}</td>
                                       <td className="p-2">{p.data}</td>
                                       <td className="p-2 font-semibold">€{p.importo}</td>
                                       <td className="p-2"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statoClass}`}>{p.stato}</span></td>
                                   </tr>
                               })}
                           </tbody>
                       </table>
                    </AccordionItem>
                ))}
            </div>
            <div className="mt-6 bg-primary text-white rounded-lg p-4 flex justify-between items-center font-bold text-xl">
                {/* FIX: Removed stray '$' character from the label for consistency. */}
                <span>Totale Complessivo</span>
                <span>€{totale.toFixed(2)}</span>
            </div>
        </div>
    );
};

const ScadenzePage = ({ scadenze, immobili, onAdd, onEdit, onDelete }) => {
    const [view, setView] = useState('elenco');
    
    const scadenzePerImmobile = useMemo(() => {
        return immobili.map(immobile => ({
            ...immobile,
            scadenze: scadenze.filter(s => s.immobileId === immobile.id)
        })).filter(i => i.scadenze.length > 0);
    }, [immobili, scadenze]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark">Gestione Scadenze</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setView('elenco')} variant={view === 'elenco' ? 'primary' : 'secondary'}><List className="inline-block mr-2" size={16}/> Elenco</Button>
                    <Button onClick={() => setView('calendario')} variant={view === 'calendario' ? 'primary' : 'secondary'}><CalendarIcon className="inline-block mr-2" size={16}/> Calendario</Button>
                    <Button onClick={() => onAdd('scadenza')}><Plus className="inline-block mr-2" size={16}/> Nuova</Button>
                </div>
            </div>
            {view === 'elenco' ? (
                <div className="space-y-4">
                    {scadenzePerImmobile.map(immobile => (
                        <AccordionItem key={immobile.id} title={immobile.nome} count={immobile.scadenze.length}>
                            {immobile.scadenze.map(scadenza => (
                                <div key={scadenza.id} className="p-3 bg-light rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{scadenza.titolo}</p>
                                        <p className="text-sm text-gray-600">Data: {scadenza.data} - Tipo: {scadenza.tipo}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(scadenza)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                                        <button onClick={() => onDelete(scadenza.id, 'scadenza')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            ))}
                        </AccordionItem>
                    ))}
                </div>
            ) : (
                <Card><p>Visualizzazione Calendario da implementare.</p></Card>
            )}
        </div>
    );
};

const SpesePage = ({ spese, immobili, veicoli, onAdd, onEdit, onDelete }) => {
    const pieData = useMemo(() => {
        const dataByCat = spese.reduce((acc, spesa) => {
            acc[spesa.tipo] = (acc[spesa.tipo] || 0) + spesa.importo;
            return acc;
        }, {} as Record<string, number>);
        return Object.keys(dataByCat).map(key => ({ name: key, value: dataByCat[key] }));
    }, [spese]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const barData = useMemo(() => {
        const speseMensili: Record<string, number> = {};
        spese.forEach(s => {
            const mese = new Date(s.data).toLocaleString('default', { month: 'short' });
            speseMensili[mese] = (speseMensili[mese] || 0) + s.importo;
        });
        return Object.keys(speseMensili).map(mese => ({ mese, totale: speseMensili[mese] }));
    }, [spese]);


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark">Registro Spese</h1>
                <Button onClick={() => onAdd('spesa')}><Plus className="inline-block mr-2" size={16}/> Aggiungi Spesa</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h3 className="font-bold text-lg mb-4">Riepilogo per Categoria</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            {/* FIX: Added a guard to ensure 'percent' is a number before performing arithmetic operation to prevent potential runtime errors. */}
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Andamento Mensile</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="mese" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totale" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <Card className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-4 font-semibold">Data</th><th className="p-4 font-semibold">Tipo</th>
                        <th className="p-4 font-semibold">Importo</th><th className="p-4 font-semibold">Associato a</th>
                        <th className="p-4 font-semibold">Azioni</th>
                    </tr></thead>
                    <tbody>
                        {spese.map(s => {
                            const associato = s.immobileId ? immobili.find(i=>i.id===s.immobileId)?.nome : s.veicoloId ? veicoli.find(v=>v.id===s.veicoloId)?.nome : 'Generale';
                            return (<tr key={s.id} className="border-b">
                                <td className="p-4">{s.data}</td><td className="p-4">{s.tipo}</td>
                                <td className="p-4 text-red-600 font-semibold">- €{s.importo}</td><td className="p-4">{associato}</td>
                                <td className="p-4"><div className="flex gap-2">
                                    <button onClick={() => onEdit(s)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                                    <button onClick={() => onDelete(s.id, 'spesa')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                                </div></td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

const VeicoliPage = ({ veicoli, onAdd, onEdit, onDelete }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-dark">Elenco Veicoli</h1>
            <Button onClick={() => onAdd('veicolo')}><Plus className="inline-block mr-2" size={16}/> Aggiungi Veicolo</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {veicoli.map(v => (
                 <Card key={v.id} className="group">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{v.nome}</h3>
                         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${v.stato === 'Operativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{v.stato}</span>
                    </div>
                    <p className="text-gray-600">{v.modello}</p>
                    <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                        <p className="flex justify-between"><span>Targa:</span> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{v.targa}</span></p>
                        <p className="flex justify-between"><span>Scad. Assicurazione:</span> <span className="font-semibold">{v.assicurazione}</span></p>
                        <p className="flex justify-between"><span>Scad. Bollo:</span> <span className="font-semibold">{v.bollo}</span></p>
                    </div>
                     <div className="mt-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(v)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                        <button onClick={() => onDelete(v.id, 'veicolo')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

const PlaceholderPage = ({ title }: { title: string }) => (
    <Card>
        <h1 className="text-2xl font-bold text-dark">{title}</h1>
        <p className="text-gray-600 mt-4">Questa sezione è in fase di sviluppo.</p>
    </Card>
);

const AnalisiFinanziariaPage = () => {
  const data = [
    { month: 'Gen', entrate: 4000, uscite: 2400 },
    { month: 'Feb', entrate: 3000, uscite: 1398 },
    { month: 'Mar', entrate: 2000, uscite: 3800 },
    { month: 'Apr', entrate: 2780, uscite: 3908 },
    { month: 'Mag', entrate: 1890, uscite: 4800 },
    { month: 'Giu', entrate: 2390, uscite: 3800 },
    { month: 'Lug', entrate: 3490, uscite: 4300 },
  ];
  return (
    <div>
        <h1 className="text-2xl font-bold text-dark mb-6">Analisi Finanziaria</h1>
        <Card>
            <h3 className="font-bold text-lg mb-4">Andamento Entrate vs Uscite</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="entrate" stroke="#22c55e" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uscite" stroke="#ef4444" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    </div>
  );
}


// --- MODALI CRUD ---
const ImmobileModal = ({ isOpen, onClose, onSave, immobileToEdit }) => {
    const [formData, setFormData] = useState({ nome: '', indirizzo: '', tipo: 'Appartamento', superficie: 0, locali: 1, canone: 0, immagine: '', status: 'Libero' });
    const [codice, setCodice] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (immobileToEdit) {
                setFormData(immobileToEdit);
                setCodice(immobileToEdit.id);
            } else {
                setFormData({ nome: '', indirizzo: '', tipo: 'Appartamento', superficie: 0, locali: 1, canone: 0, immagine: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Libero' });
                // FIX: Generate code once when modal opens for a new item to fix type error and improve UX.
                setCodice(`IMM-${Math.floor(Math.random() * 900) + 100}`);
            }
        }
    }, [immobileToEdit, isOpen]);
    
    // FIX: Correctly handle number inputs to avoid saving numbers as strings.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={immobileToEdit ? 'Modifica Immobile' : 'Aggiungi Nuovo Immobile'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="flex gap-4">
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Immagine Profilo</label>
                         <div className="h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                             <UploadCloud size={32}/>
                             <span className="text-xs mt-1">Trascina o clicca</span>
                         </div>
                    </div>
                    <div className="w-2/3 space-y-4">
                         <div><label className="block text-sm font-medium">Codice</label><input type="text" value={codice} disabled className="input bg-gray-100"/></div>
                        <div><label className="block text-sm font-medium">Nome Immobile</label><input name="nome" value={formData.nome} onChange={handleChange} className="input" required/></div>
                    </div>
                </div>
                <div><label className="block text-sm font-medium">Indirizzo</label><input name="indirizzo" value={formData.indirizzo} onChange={handleChange} className="input" required/></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Tipo</label><select name="tipo" value={formData.tipo} onChange={handleChange} className="input"><option>Appartamento</option><option>Villa</option><option>Ufficio</option></select></div>
                    <div><label className="block text-sm font-medium">Superficie (mq)</label><input type="number" name="superficie" value={formData.superficie} onChange={handleChange} className="input"/></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Numero Locali</label><input type="number" name="locali" value={formData.locali} onChange={handleChange} className="input"/></div>
                    <div><label className="block text-sm font-medium">Canone (€, se affittato)</label><input type="number" name="canone" value={formData.canone} onChange={handleChange} className="input"/></div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{immobileToEdit ? 'Salva Modifiche' : 'Crea Immobile'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const InquilinoModal = ({ isOpen, onClose, onSave, inquilinoToEdit }) => {
    const [formData, setFormData] = useState({ nome: '', email: '', telefono: '' });
     useEffect(() => {
        if (inquilinoToEdit) setFormData(inquilinoToEdit);
        else setFormData({ nome: '', email: '', telefono: '' });
    }, [inquilinoToEdit, isOpen]);
    
    // FIX: Correctly handle number inputs to avoid saving numbers as strings.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={inquilinoToEdit ? 'Modifica Inquilino' : 'Aggiungi Nuovo Inquilino'}>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium">Nome Completo</label><input name="nome" value={formData.nome} onChange={handleChange} className="input" required/></div>
                <div><label className="block text-sm font-medium">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="input" required/></div>
                <div><label className="block text-sm font-medium">Telefono</label><input name="telefono" value={formData.telefono} onChange={handleChange} className="input"/></div>
                <div><label className="block text-sm font-medium">Contratto (Opzionale)</label><select className="input"><option>Nessun contratto</option></select></div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{inquilinoToEdit ? 'Salva' : 'Aggiungi Inquilino'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const ContrattoModal = ({ isOpen, onClose, onSave, contrattoToEdit, immobili, inquilini }) => {
    const [formData, setFormData] = useState({ immobileId: '', inquilinoId: '', dataInizio: '', dataFine: '', canone: 0 });
    const immobiliLiberi = immobili.filter(i => i.status === 'Libero');

    useEffect(() => {
        if (contrattoToEdit) setFormData(contrattoToEdit);
        else setFormData({ immobileId: '', inquilinoId: '', dataInizio: '', dataFine: '', canone: 0 });
    }, [contrattoToEdit, isOpen]);
    
    // FIX: Correctly handle number inputs to avoid saving numbers as strings.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={contrattoToEdit ? 'Modifica Contratto' : 'Aggiungi Nuovo Contratto'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium">Immobile</label><select name="immobileId" value={formData.immobileId} onChange={handleChange} className="input" required><option value="">Seleziona un immobile libero</option>{immobiliLiberi.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}</select></div>
                <div><label className="block text-sm font-medium">Inquilino</label><select name="inquilinoId" value={formData.inquilinoId} onChange={handleChange} className="input" required><option value="">Seleziona un inquilino</option>{inquilini.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Data Inizio</label><input type="date" name="dataInizio" value={formData.dataInizio} onChange={handleChange} className="input" required/></div>
                    <div><label className="block text-sm font-medium">Data Fine</label><input type="date" name="dataFine" value={formData.dataFine} onChange={handleChange} className="input" required/></div>
                </div>
                <div><label className="block text-sm font-medium">Canone Mensile (€)</label><input type="number" name="canone" value={formData.canone} onChange={handleChange} className="input" required/></div>
                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{contrattoToEdit ? 'Salva' : 'Aggiungi Contratto'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const ScadenzaModal = ({ isOpen, onClose, onSave, scadenzaToEdit, immobili }) => {
    const [formData, setFormData] = useState({ immobileId: '', titolo: '', data: '', tipo: 'Affitto' });
     useEffect(() => {
        if (scadenzaToEdit) setFormData(scadenzaToEdit);
        else setFormData({ immobileId: '', titolo: '', data: '', tipo: 'Affitto' });
    }, [scadenzaToEdit, isOpen]);
    
    // FIX: Correctly handle number inputs to avoid saving numbers as strings.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={scadenzaToEdit ? 'Modifica Scadenza' : 'Aggiungi Nuova Scadenza'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium">Titolo</label><input name="titolo" value={formData.titolo} onChange={handleChange} className="input" required/></div>
                <div><label className="block text-sm font-medium">Immobile</label><select name="immobileId" value={formData.immobileId} onChange={handleChange} className="input" required><option value="">Seleziona immobile</option>{immobili.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}</select></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Data Scadenza</label><input type="date" name="data" value={formData.data} onChange={handleChange} className="input" required/></div>
                    <div><label className="block text-sm font-medium">Tipo</label><select name="tipo" value={formData.tipo} onChange={handleChange} className="input"><option>Affitto</option><option>Tassa</option><option>Utenza</option><option>Manutenzione</option></select></div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{scadenzaToEdit ? 'Salva' : 'Aggiungi Scadenza'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const VeicoloModal = ({ isOpen, onClose, onSave, veicoloToEdit }) => {
     const [formData, setFormData] = useState({ nome: '', targa: '', modello: '', assicurazione: '', bollo: '', stato: 'Operativo' });
     useEffect(() => {
        if (veicoloToEdit) setFormData(veicoloToEdit);
        else setFormData({ nome: '', targa: '', modello: '', assicurazione: '', bollo: '', stato: 'Operativo' });
    }, [veicoloToEdit, isOpen]);
    
    // FIX: Correctly handle number inputs to avoid saving numbers as strings.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={veicoloToEdit ? 'Modifica Veicolo' : 'Aggiungi Nuovo Veicolo'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Nome Veicolo</label><input name="nome" value={formData.nome} onChange={handleChange} className="input" required/></div>
                    <div><label className="block text-sm font-medium">Modello</label><input name="modello" value={formData.modello} onChange={handleChange} className="input" /></div>
                </div>
                <div><label className="block text-sm font-medium">Targa</label><input name="targa" value={formData.targa} onChange={handleChange} className="input" required/></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Scad. Assicurazione</label><input type="date" name="assicurazione" value={formData.assicurazione} onChange={handleChange} className="input"/></div>
                    <div><label className="block text-sm font-medium">Scad. Bollo</label><input type="date" name="bollo" value={formData.bollo} onChange={handleChange} className="input"/></div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{veicoloToEdit ? 'Salva' : 'Aggiungi Veicolo'}</Button>
                </div>
            </form>
        </Modal>
    );
}

const SpesaModal = ({ isOpen, onClose, onSave, spesaToEdit, immobili, veicoli }) => {
    const [formData, setFormData] = useState({ tipo: 'Manutenzione', importo: 0, data: '', immobileId: '', veicoloId: '' });
    useEffect(() => {
        if (spesaToEdit) setFormData(spesaToEdit);
        else setFormData({ tipo: 'Manutenzione', importo: 0, data: '', immobileId: '', veicoloId: '' });
    }, [spesaToEdit, isOpen]);
    
    // FIX: Correctly handle number inputs to avoid saving numbers as strings.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={spesaToEdit ? 'Modifica Spesa' : 'Aggiungi Nuova Spesa'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Tipo</label><select name="tipo" value={formData.tipo} onChange={handleChange} className="input"><option>Manutenzione</option><option>Utenze</option><option>Tasse</option><option>Assicurazione</option><option>Altro</option></select></div>
                    <div><label className="block text-sm font-medium">Data</label><input type="date" name="data" value={formData.data} onChange={handleChange} className="input" required/></div>
                </div>
                <div><label className="block text-sm font-medium">Importo (€)</label><input type="number" name="importo" value={formData.importo} onChange={handleChange} className="input" required/></div>
                <div><label className="block text-sm font-medium">Associa a Immobile (Opzionale)</label><select name="immobileId" value={formData.immobileId || ''} onChange={handleChange} className="input"><option value="">Nessuno</option>{immobili.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}</select></div>
                <div><label className="block text-sm font-medium">Associa a Veicolo (Opzionale)</label><select name="veicoloId" value={formData.veicoloId || ''} onChange={handleChange} className="input"><option value="">Nessuno</option>{veicoli.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}</select></div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{spesaToEdit ? 'Salva' : 'Aggiungi Spesa'}</Button>
                </div>
            </form>
        </Modal>
    );
}

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
    // FIX: Added type for password parameter.
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
        const { state, setState, prefix } = dataMap[type!];

        if (item) { // Modifica
            setState(state.map(i => i.id === item.id ? { ...i, ...itemData } : i));
        } else { // Aggiunta
            const newItem = { ...itemData, id: `${prefix}-${Date.now()}` };
            setState([newItem, ...state]);
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
        const { state, setState } = dataMap[type];
        
        // Logica pre-cancellazione
        if (type === 'contratto') {
            const contrattoDaEliminare = state.find(c => c.id === id);
            if (contrattoDaEliminare) {
                 setImmobili(immobili.map(i => i.id === contrattoDaEliminare.immobileId ? {...i, status: 'Libero'} : i));
            }
        }

        setState(state.filter(item => item.id !== id));
    };

    // --- COMPONENTI LAYOUT ---
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

    const Sidebar = () => (
        <aside className="w-64 bg-white text-dark flex flex-col border-r">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold text-primary">Patrimonio gest pro</h1>
            </div>
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map(item => (
                    <a href="#" key={item.id} onClick={(e) => { e.preventDefault(); setCurrentPage(item.id); }}
                       className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${currentPage === item.id ? 'bg-secondary text-primary font-semibold' : 'hover:bg-light'}`}>
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
    
    const Header = () => (
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
    
    const renderPage = () => {
        const props = { onAdd: handleOpenModal, onEdit: (item) => handleOpenModal(currentPage.slice(0, -1), item), onDelete: handleDelete };
        switch (currentPage) {
            case 'dashboard': return <Dashboard immobili={immobili} scadenze={scadenze} spese={spese} veicoli={veicoli} />;
            case 'immobili': return <ImmobiliPage immobili={immobili} setImmobili={setImmobili} {...props} />;
            case 'inquilini': return <InquiliniPage inquilini={inquilini} contratti={contratti} immobili={immobili} {...props} />;
            case 'contratti': return <ContrattiPage contratti={contratti} immobili={immobili} inquilini={inquilini} {...props} />;
            case 'pagamenti': return <PagamentiPage pagamenti={pagamenti} contratti={contratti} immobili={immobili} inquilini={inquilini} {...props} />;
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
                            {/* FIX: Correctly handle form submission and access input value in a type-safe manner. */}
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
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
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