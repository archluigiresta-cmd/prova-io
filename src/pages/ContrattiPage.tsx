import React, { useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import AccordionItem from '../components/ui/AccordionItem';
import { Contratto, Immobile, Inquilino } from '../data';

interface ContrattiPageProps {
    contratti: Contratto[];
    immobili: Immobile[];
    inquilini: Inquilino[];
    onAdd: (type: string) => void;
    onEdit: (item: Contratto) => void;
    onDelete: (id: string, type: string) => void;
}

const ContrattiPage = ({ contratti, immobili, inquilini, onAdd, onEdit, onDelete }: ContrattiPageProps) => {
    const immobiliConContratti = useMemo(() => {
        return immobili.map(immobile => ({
            ...immobile,
            contratti: contratti.filter(c => c.immobileId === immobile.id)
        })).filter(i => i.contratti.length > 0);
    }, [immobili, contratti]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestione Contratti</h1>
                <Button onClick={() => onAdd('contratto')}><Plus className="inline-block mr-2" size={16}/> Nuovo Contratto</Button>
            </div>
            <div className="space-y-4">
                {immobiliConContratti.map(immobile => (
                    <AccordionItem key={immobile.id} title={immobile.nome} count={immobile.contratti.length}>
                        {immobile.contratti.map(contratto => {
                            const inquilino = inquilini.find(i => i.id === contratto.inquilinoId);
                            return (
                                <div key={contratto.id} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">Contratto con {inquilino?.nome || 'N/D'}</p>
                                        <p className="text-sm text-gray-600">Dal {contratto.dataInizio} al {contratto.dataFine}</p>
                                        <p className="text-sm font-bold text-blue-700 mt-1">€{contratto.canone}/mese</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(contratto)} className="text-gray-500 hover:text-blue-700"><Edit size={18}/></button>
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

export default ContrattiPage;
