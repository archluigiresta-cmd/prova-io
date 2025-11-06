import React from 'react';
import Card from '../components/ui/Card';
import { Immobile, Scadenza, Spesa, Veicolo } from '../data';

interface DashboardProps {
    immobili: Immobile[];
    scadenze: Scadenza[];
    spese: Spesa[];
    veicoli: Veicolo[];
}

const Dashboard = ({ immobili, scadenze, spese, veicoli }: DashboardProps) => {
    const prossimeScadenze = scadenze.slice(0, 3);
    const recentiSpese = spese.slice(0, 3);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h3 className="text-gray-500">Immobili Gestiti</h3><p className="text-3xl font-bold">{immobili.length}</p></Card>
                <Card><h3 className="text-gray-500">Veicoli Posseduti</h3><p className="text-3xl font-bold">{veicoli.length}</p></Card>
                <Card><h3 className="text-gray-500">Entrate Mensili</h3><p className="text-3xl font-bold">€{immobili.reduce((acc, i) => acc + (i.status === 'Affittato' ? i.canone : 0), 0)}</p></Card>
                <Card><h3 className="text-gray-500">Scadenze nel Mese</h3><p className="text-3xl font-bold">{scadenze.length}</p></Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold text-lg mb-4">Prossime Scadenze</h3>
                    <ul className="space-y-3">
                        {prossimeScadenze.map(s => <li key={s.id} className="flex justify-between items-center"><span>{s.titolo}</span><span className="font-semibold text-gray-600">{s.data}</span></li>)}
                    </ul>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Spese Recenti</h3>
                    <ul className="space-y-3">
                        {recentiSpese.map(s => <li key={s.id} className="flex justify-between items-center"><span>{s.tipo}</span><span className="font-semibold text-red-500">- €{s.importo}</span></li>)}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

export default Dashboard;
