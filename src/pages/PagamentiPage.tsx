import React, { useState, useMemo } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AccordionItem from '../components/ui/AccordionItem';
import { Pagamento, Contratto, Immobile, Inquilino } from '../data';

interface PagamentiPageProps {
    pagamenti: Pagamento[];
    contratti: Contratto[];
    immobili: Immobile[];
    inquilini: Inquilino[];
}

const PagamentiPage = ({ pagamenti, contratti, immobili, inquilini }: PagamentiPageProps) => {
    const [filtroStato, setFiltroStato] = useState('Tutti');
    
    const pagamentiCompleti = useMemo(() => {
        return pagamenti.map(p => {
            const contratto = contratti.find(c => c.id === p.contrattoId);
            if (!contratto) return null;
            const immobile = immobili.find(i => i.id === contratto.immobileId);
            const inquilino = inquilini.find(i => i.id === contratto.inquilinoId);
            return { ...p, immobile, inquilino };
        }).filter(Boolean);
    }, [pagamenti, contratti, immobili, inquilini]);

    const pagamentiFiltrati = pagamentiCompleti.filter(p => filtroStato === 'Tutti' || p!.stato === filtroStato);

    const pagamentiPerImmobile = pagamentiFiltrati.reduce((acc, p) => {
        const immobileId = p!.immobile!.id;
        if (!acc[immobileId]) {
            acc[immobileId] = { immobile: p!.immobile, pagamenti: [] };
        }
        acc[immobileId].pagamenti.push(p);
        return acc;
    }, {} as any);
    
    const totale = pagamentiFiltrati.reduce((sum, p) => p!.stato === 'Pagato' ? sum + p!.importo : sum, 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Registro Pagamenti e Entrate</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={() => alert('Funzione da implementare!')} variant="secondary">Esporta CSV</Button>
                    <Button onClick={() => alert('Funzione da implementare!')}>Registra Pagamento</Button>
                </div>
            </div>
            <Card className="mb-6">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Filtra per Immobile</label>
                        <select className="input mt-1"><option>Tutti gli immobili</option></select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Cerca Inquilino</label>
                        <input type="text" placeholder="Nome inquilino..." className="input mt-1"/>
                    </div>
                </div>
                <div className="mt-4 border-b">
                    <div className="flex gap-4">
                        {['Tutti', 'Pagato', 'In Attesa', 'In Ritardo'].map(stato => (
                            <button key={stato} onClick={() => setFiltroStato(stato)}
                                className={`py-2 px-1 font-semibold ${filtroStato === stato ? 'border-b-2 border-blue-700 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}>
                                {stato}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

             <div className="space-y-4">
                {Object.values(pagamentiPerImmobile).map(({immobile, pagamenti}: any) => (
                    <AccordionItem key={immobile.id} title={immobile.nome} count={pagamenti.length}>
                       <table className="w-full text-left">
                           <thead><tr className="border-b">
                               <th className="p-2">Inquilino</th><th className="p-2">Data</th>
                               <th className="p-2">Importo</th><th className="p-2">Stato</th>
                           </tr></thead>
                           <tbody>
                               {pagamenti.map((p: any) => {
                                   const statoClass = {
                                       'Pagato': 'bg-green-100 text-green-800',
                                       'In Attesa': 'bg-yellow-100 text-yellow-800',
                                       'In Ritardo': 'bg-red-100 text-red-800'
                                   }[p.stato];
                                   return <tr key={p.id} className="border-b">
                                       <td className="p-2">{p.inquilino.nome}</td>
                                       <td className="p-2">{p.data}</td>
                                       <td className="p-2 font-semibold">€{p.importo}</td>
                                       <td className="p-2"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${statoClass}`}>{p.stato}</span></td>
                                   </tr>
                               })}
                           </tbody>
                       </table>
                    </AccordionItem>
                ))}
            </div>
            <div className="mt-6 bg-blue-700 text-white rounded-lg p-4 flex justify-between items-center font-bold text-xl">
                <span>Totale Complessivo</span>
                <span>€{totale.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default PagamentiPage;
