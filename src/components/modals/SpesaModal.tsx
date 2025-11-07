import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Spesa, Immobile, Veicolo } from '../../data';

interface SpesaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    spesaToEdit: Spesa | null;
    immobili: Immobile[];
    veicoli: Veicolo[];
}

const SpesaModal = ({ isOpen, onClose, onSave, spesaToEdit, immobili, veicoli }: SpesaModalProps) => {
    const [formData, setFormData] = useState({ tipo: 'Manutenzione', importo: 0, data: '', immobileId: '', veicoloId: '' });
    useEffect(() => {
        // FIX: `spesaToEdit` is not directly assignable to `formData` because its `immobileId` and `veicoloId` properties are optional.
        // This ensures that the object passed to `setFormData` always has string values for these properties, matching the state's type.
        if (spesaToEdit) {
            setFormData({
                tipo: spesaToEdit.tipo,
                importo: spesaToEdit.importo,
                data: spesaToEdit.data,
                immobileId: spesaToEdit.immobileId || '',
                veicoloId: spesaToEdit.veicoloId || '',
            });
        }
        else setFormData({ tipo: 'Manutenzione', importo: 0, data: '', immobileId: '', veicoloId: '' });
    }, [spesaToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData({ ...formData, [name]: isNumber ? parseFloat(value) || 0 : value });
    };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={spesaToEdit ? 'Modifica Spesa' : 'Aggiungi Nuova Spesa'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">Tipo</label><select name="tipo" value={formData.tipo} onChange={handleChange} className="input"><option>Manutenzione</option><option>Utenze</option><option>Tasse</option><option>Assicurazione</option><option>Altro</option></select></div>
                    <div><label className="block text-sm font-medium">Data</label><input type="date" name="data" value={formData.data} onChange={handleChange} className="input" required/></div>
                </div>
                <div><label className="block text-sm font-medium">Importo (€)</label><input type="number" name="importo" value={formData.importo} onChange={handleChange} className="input" required/></div>
                <div><label className="block text-sm font-medium">Associa a Immobile (Opzionale)</label><select name="immobileId" value={formData.immobileId || ''} onChange={handleChange} className="input"><option value="">Nessuno</option>{immobili.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}</select></div>
                <div><label className="block text-sm font-medium">Associa a Veicolo (Opzionale)</label><select name="veicoloId" value={formData.veicoloId || ''} onChange={handleChange} className="input"><option value="">Nessuno</option>{veicoli.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}</select></div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{spesaToEdit ? 'Salva' : 'Aggiungi Spesa'}</Button>
                </div>
            </form>
        </Modal>
    );
}

export default SpesaModal;