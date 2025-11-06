import React from 'react';
import Card from '../components/ui/Card';

const PlaceholderPage = ({ title }: { title: string }) => (
    <Card>
        <h1 className="text-2xl font-bold text-dark">{title}</h1>
        <p className="text-gray-600 mt-4">Questa sezione è in fase di sviluppo.</p>
    </Card>
);

export default PlaceholderPage;
