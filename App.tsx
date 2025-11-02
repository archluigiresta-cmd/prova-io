
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="text-center p-8 border border-gray-700 rounded-lg shadow-2xl bg-gray-800">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Applicazione React Vuota
        </h1>
        <p className="text-lg text-gray-300">
          Questo è il punto di partenza. Inizia a costruire la tua fantastica applicazione!
        </p>
      </div>
    </div>
  );
};

export default App;
