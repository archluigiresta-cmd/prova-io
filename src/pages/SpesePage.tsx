import React, { useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Spesa, Immobile, Veicolo } from '../data';

interface SpesePageProps {
    spese: Spesa[];
    immobili: Immobile[];
    veicoli: Veicolo[];
    onAdd: (type: string) => void;
    onEdit: (item: Spesa) => void;
    onDelete: (id: string, type: string) => void;
}

const SpesePage = ({ spese, immobili, veicoli, onAdd, onEdit, onDelete }: SpesePageProps) => {
    const pieData = useMemo(() => {
        const dataByCat = spese.reduce((acc, spesa) => {
            acc[spesa.tipo] = (acc[spesa.tipo] || 0) + spesa.importo;
            return acc;
        }, {} as Record<string, number>);
        return Object.keys(dataByCat).map(key => ({ name: key, value: dataByCat[key] }));
    }, [spese]);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const barData = useMemo(() => {
        const speseMensili: Record<string, number> = {};
        spese.forEach(s => {
            const mese = new Date(s.data).toLocaleString('default', { month: 'short' });
            speseMensili[mese] = (speseMensili[mese] || 0) + s.importo;
        });
        return Object.keys(speseMensili).map(mese => ({ mese, totale: speseMensili[mese] }));
    }, [spese]);


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-dark">Registro Spese</h1>
                <Button onClick={() => onAdd('spesa')}><Plus className="inline-block mr-2" size={16}/> Aggiungi Spesa</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h3 className="font-bold text-lg mb-4">Riepilogo per Categoria</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="font-bold text-lg mb-4">Andamento Mensile</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="mese" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totale" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <Card className="p-0">
                <table className="w-full text-left">
                    <thead className="bg-gray-50"><tr>
                        <th className="p-4 font-semibold">Data</th><th className="p-4 font-semibold">Tipo</th>
                        <th className="p-4 font-semibold">Importo</th><th className="p-4 font-semibold">Associato a</th>
                        <th className="p-4 font-semibold">Azioni</th>
                    </tr></thead>
                    <tbody>
                        {spese.map(s => {
                            const associato = s.immobileId ? immobili.find(i=>i.id===s.immobileId)?.nome : s.veicoloId ? veicoli.find(v=>v.id===s.veicoloId)?.nome : 'Generale';
                            return (<tr key={s.id} className="border-b">
                                <td className="p-4">{s.data}</td><td className="p-4">{s.tipo}</td>
                                <td className="p-4 text-red-600 font-semibold">- €{s.importo}</td><td className="p-4">{associato}</td>
                                <td className="p-4"><div className="flex gap-2">
                                    <button onClick={() => onEdit(s)} className="text-gray-500 hover:text-primary"><Edit size={18}/></button>
                                    <button onClick={() => onDelete(s.id, 'spesa')} className="text-gray-500 hover:text-red-500"><Trash2 size={18}/></button>
                                </div></td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default SpesePage;
