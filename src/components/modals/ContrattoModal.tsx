import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Contratto, Immobile, Inquilino } from '../../data';

interface ContrattoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    contrattoToEdit: Contratto | null;
    immobili: Immobile[];
    inquilini: Inquilino[];
}

const ContrattoModal = ({ isOpen, onClose, onSave, contrattoToEdit, immobili, inquilini }: ContrattoModalProps) => {
    const [formData, setFormData] = useState({ immobileId: '', inquilinoId: '', dataInizio: '', dataFine: '', canone: 0 });
    const immobiliLiberi = immobili.filter(i => i.status === 'Libero' || (contrattoToEdit && i.id === contrattoToEdit.immobileId));


    useEffect(() => {
        if (contrattoToEdit) setFormData(contrattoToEdit);
        else setFormData({ immobileId: '', inquilinoId: '', dataInizio: '', dataFine: '', canone: 0 });
    }, [contrattoToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
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

export default ContrattoModal;