import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Scadenza, Immobile } from '../../data';

interface ScadenzaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    scadenzaToEdit: Scadenza | null;
    immobili: Immobile[];
}

const ScadenzaModal = ({ isOpen, onClose, onSave, scadenzaToEdit, immobili }: ScadenzaModalProps) => {
    const [formData, setFormData] = useState({ immobileId: '', titolo: '', data: '', tipo: 'Affitto' });
     useEffect(() => {
        if (scadenzaToEdit) setFormData(scadenzaToEdit);
        else setFormData({ immobileId: '', titolo: '', data: '', tipo: 'Affitto' });
    }, [scadenzaToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
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

export default ScadenzaModal;