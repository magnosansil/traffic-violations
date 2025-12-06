import React from 'react';

function App() {
  return (
    <div className="text-center">
      <header className="bg-gray-800 text-white px-5 py-10 min-h-screen flex flex-col items-center justify-start">
        <h1 className="text-4xl mb-5">Sistema de Gerenciamento de Infrações de Trânsito</h1>
        <p className="text-xl mb-10 opacity-80">Frontend em desenvolvimento - Placeholder</p>

        <div className="bg-white bg-opacity-10 rounded-lg p-8 my-5 max-w-4xl w-full text-left">
          <h2 className="mb-4 text-cyan-400 text-2xl">Sobre o Sistema</h2>
          <p className="mb-4 leading-relaxed">
            Este sistema permite o gerenciamento completo de infrações de trânsito,
            incluindo cadastro de condutores, veículos, tipos de infrações e autos de infração.
          </p>
        </div>

        <div className="bg-white bg-opacity-10 rounded-lg p-8 my-5 max-w-4xl w-full text-left">
          <h2 className="mb-4 text-cyan-400 text-2xl">API Endpoints</h2>
          <p className="mb-4 leading-relaxed">
            A API está disponível em: <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono">http://localhost:3000/api</code>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mt-5">
            <div className="bg-black bg-opacity-20 p-5 rounded">
              <h3 className="text-cyan-400 mb-4 text-lg">Tipos de Infração</h3>
              <ul className="list-none p-0">
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/traffic-violation-types
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/traffic-violation-types/:id
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">POST</code> /api/traffic-violation-types
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">PUT</code> /api/traffic-violation-types/:id
                </li>
                <li className="py-2 text-sm last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">DELETE</code> /api/traffic-violation-types/:id
                </li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-20 p-5 rounded">
              <h3 className="text-cyan-400 mb-4 text-lg">Condutores</h3>
              <ul className="list-none p-0">
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/drivers
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/drivers/:id
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/drivers/violators
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">POST</code> /api/drivers
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">PUT</code> /api/drivers/:id
                </li>
                <li className="py-2 text-sm last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">DELETE</code> /api/drivers/:id
                </li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-20 p-5 rounded">
              <h3 className="text-cyan-400 mb-4 text-lg">Veículos</h3>
              <ul className="list-none p-0">
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/vehicles
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/vehicles/:id
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/vehicles/species/:species
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">POST</code> /api/vehicles
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">PUT</code> /api/vehicles/:id
                </li>
                <li className="py-2 text-sm last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">DELETE</code> /api/vehicles/:id
                </li>
              </ul>
            </div>

            <div className="bg-black bg-opacity-20 p-5 rounded">
              <h3 className="text-cyan-400 mb-4 text-lg">Infrações</h3>
              <ul className="list-none p-0">
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/traffic-violations
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/traffic-violations/:id
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">GET</code> /api/traffic-violations/detailed
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">POST</code> /api/traffic-violations
                </li>
                <li className="py-2 text-sm border-b border-white border-opacity-10 last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">PUT</code> /api/traffic-violations/:id
                </li>
                <li className="py-2 text-sm last:border-b-0">
                  <code className="bg-black bg-opacity-30 px-1.5 py-0.5 rounded font-mono text-green-300">DELETE</code> /api/traffic-violations/:id
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

