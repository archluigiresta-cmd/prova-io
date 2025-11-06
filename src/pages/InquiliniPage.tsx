import React, { useMemo } from 'react';
import { Plus, Edit, Trash2, Mail, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import AccordionItem from '../components/ui/AccordionItem';
import { Inquilino, Contratto, Immobile } from '../data';

interface InquiliniPageProps {
    inquilini: Inquilino[];
    contratti: Contratto[];
    immobili: Immobile[];
    onAdd: (type: string) => void;
    onEdit: (item: Inquilino) => void;
    onDelete: (id: string, type: string) => void;
}

const InquiliniPage = ({ inquilini, contratti, immobili, onAdd, onEdit, onDelete }: InquiliniPageProps) => {
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

export default InquiliniPage;
