import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, List, Calendar as CalendarIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AccordionItem from '../components/ui/AccordionItem';
import { Scadenza, Immobile } from '../data';

interface ScadenzePageProps {
    scadenze: Scadenza[];
    immobili: Immobile[];
    onAdd: (type: string) => void;
    onEdit: (item: Scadenza) => void;
    onDelete: (id: string, type: string) => void;
}

const ScadenzePage = ({ scadenze, immobili, onAdd, onEdit, onDelete }: ScadenzePageProps) => {
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
                <h1 className="text-2xl font-bold text-gray-800">Gestione Scadenze</h1>
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
                                <div key={scadenza.id} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{scadenza.titolo}</p>
                                        <p className="text-sm text-gray-600">Data: {scadenza.data} - Tipo: {scadenza.tipo}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(scadenza)} className="text-gray-500 hover:text-blue-700"><Edit size={18}/></button>
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

export default ScadenzePage;
