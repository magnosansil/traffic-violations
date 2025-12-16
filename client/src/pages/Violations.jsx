import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Violations() {
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ violationTypeId:'', vehicleId:'', driverId:'', violationDateTime:'', roadLocation:'' });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [list, t, v, d] = await Promise.all([
        api.get('/traffic-violations/detailed'),
        api.get('/traffic-violation-types'),
        api.get('/vehicles'),
        api.get('/drivers'),
      ]);
      setItems(list);
      setTypes(t);
      setVehicles(v);
      setDrivers(d);
      if (!form.violationTypeId && t[0]) setForm(f=>({...f, violationTypeId: t[0].id }));
      if (!form.vehicleId && v[0]) setForm(f=>({...f, vehicleId: v[0].id }));
      if (!form.driverId && d[0]) setForm(f=>({...f, driverId: d[0].id }));
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); // eslint-disable-next-line
  },[]);

  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = {
        ...form,
        roadLocation: Number(form.roadLocation),
      };
      await api.post('/traffic-violations', payload);
      setForm(f=>({ ...f, violationDateTime:'', roadLocation:'' }));
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Infrações</h2>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <select className="border px-3 py-2 rounded" value={form.violationTypeId} onChange={e=>setForm(f=>({...f, violationTypeId: e.target.value}))}>
          {types.map(t=> <option key={t.id} value={t.id}>{t.description}</option>)}
        </select>
        <select className="border px-3 py-2 rounded" value={form.vehicleId} onChange={e=>setForm(f=>({...f, vehicleId: e.target.value}))}>
          {vehicles.map(v=> <option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>)}
        </select>
        <select className="border px-3 py-2 rounded" value={form.driverId} onChange={e=>setForm(f=>({...f, driverId: e.target.value}))}>
          {drivers.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input type="datetime-local" className="border px-3 py-2 rounded" value={form.violationDateTime} onChange={e=>setForm(f=>({...f, violationDateTime: e.target.value}))} required />
        <input type="number" min="1" max="120" className="border px-3 py-2 rounded" placeholder="KM (1-120)" value={form.roadLocation} onChange={e=>setForm(f=>({...f, roadLocation: e.target.value}))} required />
        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Registrar</button>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Data/Hora</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Nível</th>
              <th className="p-3">Pontos</th>
              <th className="p-3">Veículo</th>
              <th className="p-3">Condutor</th>
              <th className="p-3">KM</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={7}>Carregando...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={7}>Nenhum registro</td></tr>
            ) : (
              items.map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">{new Date(i.violationDateTime).toLocaleString()}</td>
                  <td className="p-3">{i.violationType.description}</td>
                  <td className="p-3">{i.violationType.level}</td>
                  <td className="p-3">{i.violationType.points}</td>
                  <td className="p-3">{i.vehicle.plate}</td>
                  <td className="p-3">{i.driver.name}</td>
                  <td className="p-3">{i.roadLocation}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
