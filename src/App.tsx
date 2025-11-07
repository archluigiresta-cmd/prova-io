import React from 'react';

export default function App() {
    const style: React.CSSProperties = {
        padding: '2rem',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        borderRadius: '0.5rem',
        textAlign: 'center',
    };

    return (
        <div style={style}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Test di Base</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#4b5563' }}>Se vedi questo, le fondamenta funzionano.</p>
        </div>
    );
}
