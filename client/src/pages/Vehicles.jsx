import React, { useEffect, useState } from 'react';
import api from '../api';

const speciesOptions = [
  'PASSAGEIROS','CARGA','MISTO','COMPETICAO','TRACAO','ESPECIAL','COLECAO'
];

export default function Vehicles() {
  const [items, setItems] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ plate:'', species:'PASSAGEIROS', brand:'', model:'', ownerId:'' });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [vehicles, drivers] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
      ]);
      setItems(vehicles);
      setDrivers(drivers);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = { ...form, ownerId: form.ownerId || null };
      await api.post('/vehicles', payload);
      setForm({ plate:'', species:'PASSAGEIROS', brand:'', model:'', ownerId:'' });
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Veículos</h2>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input className="border px-3 py-2 rounded" placeholder="Placa" value={form.plate} onChange={e=>setForm(f=>({...f, plate: e.target.value}))} required />
        <select className="border px-3 py-2 rounded" value={form.species} onChange={e=>setForm(f=>({...f, species: e.target.value}))}>
          {speciesOptions.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="border px-3 py-2 rounded" placeholder="Marca" value={form.brand} onChange={e=>setForm(f=>({...f, brand: e.target.value}))} required />
        <input className="border px-3 py-2 rounded" placeholder="Modelo" value={form.model} onChange={e=>setForm(f=>({...f, model: e.target.value}))} required />
        <select className="border px-3 py-2 rounded" value={form.ownerId} onChange={e=>setForm(f=>({...f, ownerId: e.target.value}))}>
          <option value="">Sem proprietário</option>
          {drivers.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Adicionar</button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Placa</th>
              <th className="p-3">Espécie</th>
              <th className="p-3">Marca</th>
              <th className="p-3">Modelo</th>
              <th className="p-3">Proprietário</th>
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
                  <td className="p-3">{i.plate}</td>
                  <td className="p-3">{i.species}</td>
                  <td className="p-3">{i.brand}</td>
                  <td className="p-3">{i.model}</td>
                  <td className="p-3">{i.owner ? i.owner.name : '-'}</td>
                  <td className="p-3">{i.violations?.length || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
