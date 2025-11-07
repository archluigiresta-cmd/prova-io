import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Manutenzione, Immobile, Veicolo } from '../../data';

interface ManutenzioneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    manutenzioneToEdit: Manutenzione | null;
    immobili: Immobile[];
    veicoli: Veicolo[];
}

const ManutenzioneModal = ({ isOpen, onClose, onSave, manutenzioneToEdit, immobili, veicoli }: ManutenzioneModalProps) => {
    const [formData, setFormData] = useState({ titolo: '', descrizione: '', immobileId: '', veicoloId: '', data: '', costo: 0, fornitore: '', stato: 'Da Fare' });

    useEffect(() => {
        if (manutenzioneToEdit) {
            setFormData({
                titolo: manutenzioneToEdit.titolo,
                descrizione: manutenzioneToEdit.descrizione,
                immobileId: manutenzioneToEdit.immobileId || '',
                veicoloId: manutenzioneToEdit.veicoloId || '',
                data: manutenzioneToEdit.data,
                costo: manutenzioneToEdit.costo,
                fornitore: manutenzioneToEdit.fornitore,
                stato: manutenzioneToEdit.stato,
            });
        } else {
            setFormData({ titolo: '', descrizione: '', immobileId: '', veicoloId: '', data: '', costo: 0, fornitore: '', stato: 'Da Fare' });
        }
    }, [manutenzioneToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={manutenzioneToEdit ? 'Modifica Manutenzione' : 'Nuovo Intervento'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Titolo Intervento</label>
                    <input name="titolo" value={formData.titolo} onChange={handleChange} className="input" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Immobile (Opzionale)</label>
                        <select name="immobileId" value={formData.immobileId} onChange={handleChange} className="input">
                            <option value="">Nessuno</option>
                            {immobili.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Veicolo (Opzionale)</label>
                        <select name="veicoloId" value={formData.veicoloId} onChange={handleChange} className="input">
                            <option value="">Nessuno</option>
                            {veicoli.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Data Intervento</label>
                        <input type="date" name="data" value={formData.data} onChange={handleChange} className="input" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Stato</label>
                        <select name="stato" value={formData.stato} onChange={handleChange} className="input">
                            <option>Da Fare</option>
                            <option>In Corso</option>
                            <option>Completato</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Costo (€)</label>
                        <input type="number" name="costo" value={formData.costo} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Fornitore</label>
                        <input name="fornitore" value={formData.fornitore} onChange={handleChange} className="input" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">Descrizione</label>
                    <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} className="input" rows={3}></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
                    <Button type="submit">{manutenzioneToEdit ? 'Salva Modifiche' : 'Crea Intervento'}</Button>
                </div>
            </form>
        </Modal>
    );
};

export default ManutenzioneModal;