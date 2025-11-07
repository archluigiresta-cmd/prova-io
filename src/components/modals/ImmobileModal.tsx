import React, { useState, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Immobile } from '../../data';

interface ImmobileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    immobileToEdit: Immobile | null;
}

const ImmobileModal = ({ isOpen, onClose, onSave, immobileToEdit }: ImmobileModalProps) => {
    const [formData, setFormData] = useState({ nome: '', indirizzo: '', tipo: 'Appartamento', superficie: 0, locali: 1, canone: 0, immagine: '', status: 'Libero' });
    const [codice, setCodice] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (immobileToEdit) {
                setFormData(immobileToEdit);
                setCodice(immobileToEdit.id);
            } else {
                setFormData({ nome: '', indirizzo: '', tipo: 'Appartamento', superficie: 0, locali: 1, canone: 0, immagine: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Libero' });
                setCodice(`IMM-${Math.floor(Math.random() * 900) + 100}`);
            }
        }
    }, [immobileToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    
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

export default ImmobileModal;