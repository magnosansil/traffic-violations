import React, { useEffect, useState } from 'react';
import api from '../api';

const levels = [
  { value: 'LEVE', label: 'Leve (3)' },
  { value: 'MEDIA', label: 'Média (4)' },
  { value: 'GRAVE', label: 'Grave (5)' },
  { value: 'GRAVISSIMA', label: 'Gravíssima (7)' },
];

export default function TrafficViolationTypes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ description: '', level: 'LEVE' });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.get('/traffic-violation-types');
      setItems(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await api.post('/traffic-violation-types', form);
      setForm({ description: '', level: 'LEVE' });
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tipos de Infração</h2>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="border px-3 py-2 rounded" placeholder="Descrição" value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))} required />
        <select className="border px-3 py-2 rounded" value={form.level} onChange={e=>setForm(f=>({...f, level: e.target.value}))}>
          {levels.map(l=> <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Adicionar</button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Descrição</th>
              <th className="p-3">Nível</th>
              <th className="p-3">Pontos</th>
              <th className="p-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Carregando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>Nenhum registro</td></tr>
            ) : (
              items.map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">{i.description}</td>
                  <td className="p-3">{i.level}</td>
                  <td className="p-3">{i.points}</td>
                  <td className="p-3">{new Date(i.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
