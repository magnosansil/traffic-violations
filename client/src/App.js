import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import TrafficViolationTypes from './pages/TrafficViolationTypes';
import Drivers from './pages/Drivers';
import Vehicles from './pages/Vehicles';
import Violations from './pages/Violations';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/violations" replace />} />
          <Route path="/violation-types" element={<TrafficViolationTypes />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/violations" element={<Violations />} />
          <Route path="*" element={<div className="p-6">Página não encontrada</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

