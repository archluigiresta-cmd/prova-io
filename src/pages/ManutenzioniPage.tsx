import React from 'react';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import Button from '../components/ui/Button';
import { Manutenzione, Immobile, Veicolo } from '../data';

interface ManutenzioniPageProps {
    manutenzioni: Manutenzione[];
    immobili: Immobile[];
    veicoli: Veicolo[];
    onAdd: (type: string) => void;
    onEdit: (item: Manutenzione) => void;
    onDelete: (id: string, type: string) => void;
}

const statusMap = {
    'Da Fare': { title: 'Da Fare', color: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-500' },
    'In Corso': { title: 'In Corso', color: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-500' },
    'Completato': { title: 'Completato', color: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-500' },
};

const MaintenanceCard = ({ item, onEdit, onDelete, immobili, veicoli, statusInfo }: any) => {
    const associato = item.immobileId ? immobili.find(i => i.id === item.immobileId)?.nome :
                      item.veicoloId ? veicoli.find(v => v.id === item.veicoloId)?.nome : 'N/D';
    return (
        <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${statusInfo.borderColor} group relative`}>
             <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(item)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-blue-700"><Edit size={16}/></button>
                <button onClick={() => onDelete(item.id, 'manutenzione')} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-red-500"><Trash2 size={16}/></button>
            </div>
            <h4 className="font-bold text-gray-800">{item.titolo}</h4>
            <p className="text-sm text-gray-500 mt-1">{associato}</p>
            <p className="text-sm text-gray-500">{item.fornitore}</p>
            <div className="flex justify-between items-center mt-3 text-sm">
                <span className="font-semibold text-blue-700">€{item.costo}</span>
                <span className="text-gray-600">{item.data}</span>
            </div>
        </div>
    );
};

const ManutenzioniPage = ({ manutenzioni, immobili, veicoli, onAdd, onEdit, onDelete }: ManutenzioniPageProps) => {
    const manutenzioniByStatus = manutenzioni.reduce((acc, curr) => {
        acc[curr.stato] = [...(acc[curr.stato] || []), curr];
        return acc;
    }, {} as Record<string, Manutenzione[]>);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestione Manutenzioni</h1>
                <Button onClick={() => onAdd('manutenzione')}><Plus className="inline-block mr-2" size={16}/> Aggiungi Intervento</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(statusMap).map(statusKey => {
                    const status = statusMap[statusKey as keyof typeof statusMap];
                    const items = manutenzioniByStatus[statusKey as keyof typeof statusMap] || [];
                    return (
                        <div key={status.title} className="bg-gray-100 rounded-lg p-4">
                            <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 ${status.borderColor}`}>
                                <span className={`px-2 py-1 text-sm font-bold rounded-md ${status.color} ${status.textColor}`}>{status.title}</span>
                                <span className="text-sm font-semibold text-gray-500">{items.length}</span>
                            </div>
                            <div className="space-y-4 h-full">
                                {items.length > 0 ? (
                                    items.map(item => <MaintenanceCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} immobili={immobili} veicoli={veicoli} statusInfo={status}/>)
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400 h-40">
                                        <Wrench size={32}/>
                                        <p className="mt-2 text-sm">Nessun intervento</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ManutenzioniPage;
