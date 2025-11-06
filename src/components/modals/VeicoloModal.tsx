import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Veicolo } from '../../data';

interface VeicoloModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    veicoloToEdit: Veicolo | null;
}

const VeicoloModal = ({ isOpen, onClose, onSave, veicoloToEdit }: VeicoloModalProps) => {
     const [formData, setFormData] = useState({ nome: '', targa: '', modello: '', assicurazione: '', bollo: '', stato: 'Operativo' });
     useEffect(() => {
        if (veicoloToEdit) setFormData(veicoloToEdit);
        else setFormData({ nome: '', targa: '', modello: '', assicurazione: '', bollo: '', stato: 'Operativo' });
    }, [veicoloToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={veicoloToEdit ? 'Modifica Veicolo' : 'Aggiungi Nuovo Veicolo'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Nome Veicolo</label><input name="nome" value={formData.nome} onChange={handleChange} className="input" required/></div>
                    <div><label className="block text-sm font-medium">Modello</label><input name="modello" value={formData.modello} onChange={handleChange} className="input" /></div>
                </div>
                <div><label className="block text-sm font-medium">Targa</label><input name="targa" value={formData.targa} onChange={handleChange} className="input" required/></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Scad. Assicurazione</label><input type="date" name="assicurazione" value={formData.assicurazione} onChange={handleChange} className="input"/></div>
                    <div><label className="block text-sm font-medium">Scad. Bollo</label><input type="date" name="bollo" value={formData.bollo} onChange={handleChange} className="input"/></div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{veicoloToEdit ? 'Salva' : 'Aggiungi Veicolo'}</Button>
                </div>
            </form>
        </Modal>
    );
}

export default VeicoloModal;
