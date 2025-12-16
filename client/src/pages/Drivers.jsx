import React, { useEffect, useState } from 'react';
import api from '../api';

const genders = [
  'MASCULINO','FEMININO','OUTRO'
];

export default function Drivers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name:'', gender:'MASCULINO', birthDate:'', licenseNumber:'', licenseValidity:'' });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.get('/drivers');
      setItems(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await api.post('/drivers', form);
      setForm({ name:'', gender:'MASCULINO', birthDate:'', licenseNumber:'', licenseValidity:'' });
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Condutores</h2>
      <div className="mb-4 text-sm text-gray-700">Lista de infratores: veja a seção abaixo.</div>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input className="border px-3 py-2 rounded md:col-span-2" placeholder="Nome" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} required />
        <select className="border px-3 py-2 rounded" value={form.gender} onChange={e=>setForm(f=>({...f, gender: e.target.value}))}>
          {genders.map(g=> <option key={g} value={g}>{g}</option>)}
        </select>
        <input type="date" className="border px-3 py-2 rounded" value={form.birthDate} onChange={e=>setForm(f=>({...f, birthDate: e.target.value}))} required />
        <input className="border px-3 py-2 rounded" placeholder="Nº Habilitação" value={form.licenseNumber} onChange={e=>setForm(f=>({...f, licenseNumber: e.target.value}))} required />
        <input type="date" className="border px-3 py-2 rounded" value={form.licenseValidity} onChange={e=>setForm(f=>({...f, licenseValidity: e.target.value}))} required />
        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Adicionar</button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Nome</th>
              <th className="p-3">Gênero</th>
              <th className="p-3">Nº Habilitação</th>
              <th className="p-3">Validade</th>
              <th className="p-3">Veículos</th>
              <th className="p-3">Infrações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={6}>Carregando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={6}>Nenhum registro</td></tr>
            ) : (
              items.map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">{i.name}</td>
                  <td className="p-3">{i.gender}</td>
                  <td className="p-3">{i.licenseNumber}</td>
                  <td className="p-3">{new Date(i.licenseValidity).toLocaleDateString()}</td>
                  <td className="p-3">{i.ownedVehicles?.length || 0}</td>
                  <td className="p-3">{i.trafficViolations?.length || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-3">Condutores infratores (por pontos)</h3>
      {/* Tabela simples com endpoint /drivers/violators */}
      <ViolatorsTable />
    </div>
  );
}

function ViolatorsTable(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{
    (async ()=>{
      setLoading(true); setError('');
      try { setItems(await api.get('/drivers/violators')); }
      catch(e){ setError(e.message); }
      finally{ setLoading(false); }
    })();
  },[]);

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded">{error}</div>}
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-50">
            <th className="p-3">Condutor</th>
            <th className="p-3">Nº Habilitação</th>
            <th className="p-3">Pontos</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="p-3" colSpan={3}>Carregando...</td></tr>
          ) : items.length === 0 ? (
            <tr><td className="p-3" colSpan={3}>Nenhum infrator</td></tr>
          ) : (
            items.map(i => (
              <tr key={i.id} className="border-t">
                <td className="p-3">{i.name}</td>
                <td className="p-3">{i.licenseNumber}</td>
                <td className="p-3">{i.totalPoints}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
