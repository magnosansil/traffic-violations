import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Infrações de Trânsito</h1>
          <nav className="space-x-4">
            <NavLink to="/violations" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'opacity-90'}`}>Infrações</NavLink>
            <NavLink to="/violation-types" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'opacity-90'}`}>Tipos</NavLink>
            <NavLink to="/drivers" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'opacity-90'}`}>Condutores</NavLink>
            <NavLink to="/vehicles" className={({isActive})=>`hover:text-cyan-300 ${isActive? 'text-cyan-300':'opacity-90'}`}>Veículos</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
