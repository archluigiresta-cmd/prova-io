import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Inquilino } from '../../data';

interface InquilinoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    inquilinoToEdit: Inquilino | null;
}

const InquilinoModal = ({ isOpen, onClose, onSave, inquilinoToEdit }: InquilinoModalProps) => {
    const [formData, setFormData] = useState({ nome: '', email: '', telefono: '' });
     useEffect(() => {
        if (inquilinoToEdit) setFormData(inquilinoToEdit);
        else setFormData({ nome: '', email: '', telefono: '' });
    }, [inquilinoToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

export default InquilinoModal;
