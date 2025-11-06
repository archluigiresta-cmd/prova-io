import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';

const AnalisiFinanziariaPage = () => {
  const data = [
    { month: 'Gen', entrate: 4000, uscite: 2400 },
    { month: 'Feb', entrate: 3000, uscite: 1398 },
    { month: 'Mar', entrate: 2000, uscite: 3800 },
    { month: 'Apr', entrate: 2780, uscite: 3908 },
    { month: 'Mag', entrate: 1890, uscite: 4800 },
    { month: 'Giu', entrate: 2390, uscite: 3800 },
    { month: 'Lug', entrate: 3490, uscite: 4300 },
  ];
  return (
    <div>
        <h1 className="text-2xl font-bold text-dark mb-6">Analisi Finanziaria</h1>
        <Card>
            <h3 className="font-bold text-lg mb-4">Andamento Entrate vs Uscite</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="entrate" stroke="#22c55e" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uscite" stroke="#ef4444" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    </div>
  );
}

export default AnalisiFinanziariaPage;
