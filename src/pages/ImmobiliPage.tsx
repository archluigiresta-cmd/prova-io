import React, { useState } from 'react';
import { Plus, Edit, Trash2, UploadCloud, List, Grip } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Immobile } from '../data';

interface ImmobiliPageProps {
    immobili: Immobile[];
    setImmobili: React.Dispatch<React.SetStateAction<Immobile[]>>;
    onAdd: (type: string) => void;
    onEdit: (item: Immobile) => void;
    onDelete: (id: string, type: string) => void;
}

const ImmobiliPage = ({ immobili, setImmobili, onAdd, onEdit, onDelete }: ImmobiliPageProps) => {
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

export default ImmobiliPage;
