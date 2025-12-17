import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Violations() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [form, setForm] = useState({ violationTypeId:'', vehicleId:'', driverId:'', violationDateTime:'', roadLocation:'' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ violationTypeId:'', vehicleId:'', driverId:'', violationDateTime:'', roadLocation:'' });

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
      setFiltered(list);
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

  useEffect(()=>{
    const q = search.trim().toLowerCase();
    let data = items;
    if (q) {
      data = items.filter(i =>
        i.driver?.name?.toLowerCase().includes(q) ||
        i.vehicle?.plate?.toLowerCase().includes(q) ||
        i.violationType?.description?.toLowerCase().includes(q) ||
        String(i.roadLocation).includes(q)
      );
    }
    setFiltered(data);
    setPage(1);
  }, [search, items]);

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

  const onDelete = async (id) => {
    setError('');
    try {
      if (!window.confirm('Tem certeza que deseja excluir esta infração?')) return;
      await api.delete(`/traffic-violations/${id}`);
      await load();
    } catch (e) { setError(e.message); }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      violationTypeId: item.violationTypeId || (types.find(t=>t.description===item.violationType.description)?.id || ''),
      vehicleId: item.vehicleId || item.vehicle.id,
      driverId: item.driverId || item.driver.id,
      violationDateTime: new Date(item.violationDateTime).toISOString().slice(0,16),
      roadLocation: String(item.roadLocation),
    });
  };

  const cancelEdit = () => { setEditId(null); };

  const submitEdit = async () => {
    setError('');
    try {
      const payload = { ...editForm, roadLocation: Number(editForm.roadLocation) };
      await api.put(`/traffic-violations/${editId}`, payload);
      setEditId(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Infrações</h2>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

      {/* Buscar e info de paginação */}
      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="violations-search" className="text-sm text-gray-700 mb-1">Buscar (condutor, placa, tipo, KM)</label>
          <input id="violations-search" className="border px-3 py-2 rounded" placeholder="Ex.: João, ABC-1234, velocidade, 45" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex items-end"><div className="text-sm text-gray-700">Itens por página: 10</div></div>
      </div>

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="flex flex-col">
          <label htmlFor="violation-type" className="text-sm text-gray-700 mb-1">Tipo de infração</label>
          <select id="violation-type" name="violationTypeId" className="border px-3 py-2 rounded" value={form.violationTypeId} onChange={e=>setForm(f=>({...f, violationTypeId: e.target.value}))} aria-label="Selecione o tipo de infração">
            {types.map(t=> <option key={t.id} value={t.id}>{t.description}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="violation-vehicle" className="text-sm text-gray-700 mb-1">Veículo</label>
          <select id="violation-vehicle" name="vehicleId" className="border px-3 py-2 rounded" value={form.vehicleId} onChange={e=>setForm(f=>({...f, vehicleId: e.target.value}))} aria-label="Selecione o veículo">
            {vehicles.map(v=> <option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="violation-driver" className="text-sm text-gray-700 mb-1">Condutor</label>
          <select id="violation-driver" name="driverId" className="border px-3 py-2 rounded" value={form.driverId} onChange={e=>setForm(f=>({...f, driverId: e.target.value}))} aria-label="Selecione o condutor">
            {drivers.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="violation-datetime" className="text-sm text-gray-700 mb-1">Data e hora</label>
          <input id="violation-datetime" name="violationDateTime" type="datetime-local" className="border px-3 py-2 rounded" value={form.violationDateTime} onChange={e=>setForm(f=>({...f, violationDateTime: e.target.value}))} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="violation-km" className="text-sm text-gray-700 mb-1">KM (1–120)</label>
          <input id="violation-km" name="roadLocation" type="number" min="1" max="120" className="border px-3 py-2 rounded" placeholder="Informe o KM" value={form.roadLocation} onChange={e=>setForm(f=>({...f, roadLocation: e.target.value}))} required />
        </div>
        <div className="flex items-end">
          <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Registrar</button>
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Data</th>
              <th className="p-3">Horário</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Nível</th>
              <th className="p-3">Pontos</th>
              <th className="p-3">Veículo</th>
              <th className="p-3">Condutor</th>
              <th className="p-3">Local (KM)</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={8}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="p-3" colSpan={8}>Nenhum registro</td></tr>
            ) : (
              filtered.slice((page-1)*pageSize, (page-1)*pageSize + pageSize).map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">{new Date(i.violationDateTime).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(i.violationDateTime).toLocaleTimeString()}</td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <select className="border px-2 py-1 rounded" value={editForm.violationTypeId} onChange={e=>setEditForm(f=>({...f, violationTypeId:e.target.value}))}>
                        {types.map(t=> <option key={t.id} value={t.id}>{t.description}</option>)}
                      </select>
                    ) : i.violationType.description}
                  </td>
                  <td className="p-3">{i.violationType.level}</td>
                  <td className="p-3">{i.violationType.points}</td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <select className="border px-2 py-1 rounded" value={editForm.vehicleId} onChange={e=>setEditForm(f=>({...f, vehicleId:e.target.value}))}>
                        {vehicles.map(v=> <option key={v.id} value={v.id}>{v.plate} - {v.brand} {v.model}</option>)}
                      </select>
                    ) : i.vehicle.plate}
                  </td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <select className="border px-2 py-1 rounded" value={editForm.driverId} onChange={e=>setEditForm(f=>({...f, driverId:e.target.value}))}>
                        {drivers.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    ) : i.driver.name}
                  </td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <input type="number" min="1" max="120" className="border px-2 py-1 rounded w-24" value={editForm.roadLocation} onChange={e=>setEditForm(f=>({...f, roadLocation:e.target.value}))} />
                    ) : i.roadLocation}
                  </td>
                  <td className="p-3 space-x-2">
                    {editId===i.id ? (
                      <>
                        <button type="button" className="bg-green-600 text-white px-3 py-1 rounded" onClick={submitEdit}>Salvar</button>
                        <button type="button" className="bg-gray-500 text-white px-3 py-1 rounded" onClick={cancelEdit}>Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="bg-blue-600 text-white px-3 py-1 rounded" onClick={()=>startEdit(i)}>Editar</button>
                        <button type="button" className="bg-red-600 text-white px-3 py-1 rounded" onClick={()=>onDelete(i.id)}>Excluir</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-3">
          <div className="text-sm text-gray-700">Página {page} de {Math.max(1, Math.ceil(filtered.length / pageSize))}</div>
          <div className="space-x-2">
            <button type="button" className="px-3 py-1 rounded border" disabled={page===1} onClick={()=>setPage(p=>Math.max(1, p-1))}>Anterior</button>
            <button type="button" className="px-3 py-1 rounded border" disabled={page>=Math.ceil(filtered.length / pageSize)} onClick={()=>setPage(p=>Math.min(Math.ceil(filtered.length / pageSize), p+1))}>Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
}
