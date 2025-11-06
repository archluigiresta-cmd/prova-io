import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Veicolo } from '../data';

interface VeicoliPageProps {
    veicoli: Veicolo[];
    onAdd: (type: string) => void;
    onEdit: (item: Veicolo) => void;
    onDelete: (id: string, type: string) => void;
}

const VeicoliPage = ({ veicoli, onAdd, onEdit, onDelete }: VeicoliPageProps) => (
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

export default VeicoliPage;
