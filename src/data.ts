// --- TIPI DI DATI ---
export type Immobile = { id: string; nome: string; indirizzo: string; tipo: string; superficie: number; locali: number; canone: number; immagine: string; status: 'Affittato' | 'Libero' };
export type Inquilino = { id: string; nome: string; email: string; telefono: string; };
export type Contratto = { id: string; immobileId: string; inquilinoId: string; dataInizio: string; dataFine: string; canone: number; };
export type Scadenza = { id: string; immobileId: string; titolo: string; data: string; tipo: 'Affitto' | 'Tassa' | 'Utenza' | 'Manutenzione' };
export type Pagamento = { id: string; contrattoId: string; importo: number; data: string; stato: 'Pagato' | 'In Attesa' | 'In Ritardo' };
export type Spesa = { id: string; tipo: string; importo: number; data: string; immobileId?: string; veicoloId?: string; };
export type Veicolo = { id: string; nome: string; targa: string; modello: string; assicurazione: string; bollo: string; stato: 'Operativo' | 'Manutenzione' };

// --- DATI DI ESEMPIO ---
export const initialImmobili: Immobile[] = [
    { id: 'imm-001', nome: 'Villa Paradiso', indirizzo: 'Via Roma 1, Milano', tipo: 'Villa', superficie: 250, locali: 7, canone: 3500, immagine: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Affittato' },
    { id: 'imm-002', nome: 'Appartamento Centrale', indirizzo: 'Corso Buenos Aires 10, Milano', tipo: 'Appartamento', superficie: 80, locali: 3, canone: 1200, immagine: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Affittato' },
    { id: 'imm-003', nome: 'Ufficio Moderno', indirizzo: 'Piazza Duomo 5, Milano', tipo: 'Ufficio', superficie: 120, locali: 4, canone: 2500, immagine: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', status: 'Libero' },
];

export const initialInquilini: Inquilino[] = [
    { id: 'inq-001', nome: 'Mario Rossi', email: 'mario.rossi@email.com', telefono: '3331234567' },
    { id: 'inq-002', nome: 'Laura Bianchi', email: 'laura.bianchi@email.com', telefono: '3337654321' },
];

export const initialContratti: Contratto[] = [
    { id: 'con-001', immobileId: 'imm-001', inquilinoId: 'inq-001', dataInizio: '2023-01-01', dataFine: '2026-12-31', canone: 3500 },
    { id: 'con-002', immobileId: 'imm-002', inquilinoId: 'inq-002', dataInizio: '2022-06-01', dataFine: '2025-05-31', canone: 1200 },
];

export const initialScadenze: Scadenza[] = [
    { id: 'sca-001', immobileId: 'imm-001', titolo: 'Pagamento affitto', data: '2025-11-05', tipo: 'Affitto' },
    { id: 'sca-002', immobileId: 'imm-002', titolo: 'Pagamento affitto', data: '2025-11-05', tipo: 'Affitto' },
    { id: 'sca-003', immobileId: 'imm-001', titolo: 'Tassa Rifiuti (TARI)', data: '2025-11-16', tipo: 'Tassa' },
];

export const initialPagamenti: Pagamento[] = [
    { id: 'pag-001', contrattoId: 'con-001', importo: 3500, data: '2025-10-05', stato: 'Pagato' },
    { id: 'pag-002', contrattoId: 'con-002', importo: 1200, data: '2025-10-05', stato: 'Pagato' },
    { id: 'pag-003', contrattoId: 'con-001', importo: 3500, data: '2025-11-05', stato: 'In Attesa' },
];

export const initialSpese: Spesa[] = [
    { id: 'spe-001', tipo: 'Manutenzione', importo: 250, data: '2024-10-15', immobileId: 'imm-001' },
    { id: 'spe-002', tipo: 'Assicurazione', importo: 800, data: '2024-09-20', veicoloId: 'vei-001' },
    { id: 'spe-003', tipo: 'Utenze', importo: 150, data: '2024-10-25', immobileId: 'imm-002' },
];

export const initialVeicoli: Veicolo[] = [
    { id: 'vei-001', nome: 'Audi A4', targa: 'AB123CD', modello: 'Berlina', assicurazione: '2025-09-20', bollo: '2025-07-31', stato: 'Operativo' },
    { id: 'vei-002', nome: 'Fiat 500', targa: 'EF456GH', modello: 'City Car', assicurazione: '2025-11-10', bollo: '2025-08-31', stato: 'Operativo' },
];
