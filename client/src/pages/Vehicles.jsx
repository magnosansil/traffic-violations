import React, { useEffect, useState } from 'react';
import api from '../api';

const speciesOptions = [
  'PASSAGEIROS','CARGA','MISTO','COMPETICAO','TRACAO','ESPECIAL','COLECAO'
];

export default function Vehicles() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [form, setForm] = useState({ plate:'', species:'PASSAGEIROS', brand:'', model:'', ownerId:'' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ plate:'', species:'PASSAGEIROS', brand:'', model:'', ownerId:'' });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [vehicles, drivers] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
      ]);
      setItems(vehicles);
      setFiltered(vehicles);
      setDrivers(drivers);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  useEffect(()=>{
    const q = search.trim().toLowerCase();
    let data = items;
    if (q) {
      data = items.filter(i =>
        i.plate?.toLowerCase().includes(q) ||
        i.brand?.toLowerCase().includes(q) ||
        i.model?.toLowerCase().includes(q) ||
        i.owner?.name?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
    setPage(1);
  }, [search, items]);

  const loadVehiclesByFilter = async (species) => {
    setLoading(true); setError('');
    try {
      const url = species ? `/vehicles/species/${species}` : '/vehicles';
      const vehicles = await api.get(url);
      setItems(vehicles);
      // reset filter results with server response
      const q = search.trim().toLowerCase();
      let data = vehicles;
      if (q) {
        data = vehicles.filter(i =>
          i.plate?.toLowerCase().includes(q) ||
          i.brand?.toLowerCase().includes(q) ||
          i.model?.toLowerCase().includes(q) ||
          i.owner?.name?.toLowerCase().includes(q)
        );
      }
      setFiltered(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const onChangeFilter = async (val) => {
    setFilterSpecies(val);
    await loadVehiclesByFilter(val);
  };

  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const payload = { ...form, ownerId: form.ownerId || null };
      await api.post('/vehicles', payload);
      setForm({ plate:'', species:'PASSAGEIROS', brand:'', model:'', ownerId:'' });
      await loadVehiclesByFilter(filterSpecies);
    } catch (e) { setError(e.message); }
  };

  const onDelete = async (id) => {
    setError('');
    try {
      if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;
      await api.delete(`/vehicles/${id}`);
      await load();
    } catch (e) { setError(e.message); }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      plate: item.plate,
      species: item.species,
      brand: item.brand,
      model: item.model,
      ownerId: item.owner?.id || '',
    });
  };

  const cancelEdit = () => { setEditId(null); };

  const submitEdit = async () => {
    setError('');
    try {
      const payload = { ...editForm, ownerId: editForm.ownerId || null };
      await api.put(`/vehicles/${editId}`, payload);
      setEditId(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Veículos</h2>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col">
          <label htmlFor="filter-species" className="text-sm text-gray-700 mb-1">Filtrar por espécie</label>
          <select id="filter-species" className="border px-3 py-2 rounded" value={filterSpecies} onChange={e=>onChangeFilter(e.target.value)}>
            <option value="">Todas</option>
            {speciesOptions.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="vehicles-search" className="text-sm text-gray-700 mb-1">Buscar (placa, marca, modelo, proprietário)</label>
          <input id="vehicles-search" className="border px-3 py-2 rounded" placeholder="Ex.: ABC-1234, Ford, Ka, João" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-700">Itens por página: 10</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="flex flex-col">
          <label htmlFor="vehicle-plate" className="text-sm text-gray-700 mb-1">Placa</label>
          <input id="vehicle-plate" name="plate" className="border px-3 py-2 rounded" placeholder="Digite a placa" value={form.plate} onChange={e=>setForm(f=>({...f, plate: e.target.value}))} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="vehicle-species" className="text-sm text-gray-700 mb-1">Espécie</label>
          <select id="vehicle-species" name="species" className="border px-3 py-2 rounded" value={form.species} onChange={e=>setForm(f=>({...f, species: e.target.value}))} aria-label="Selecione a espécie do veículo">
            {speciesOptions.map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="vehicle-brand" className="text-sm text-gray-700 mb-1">Marca</label>
          <input id="vehicle-brand" name="brand" className="border px-3 py-2 rounded" placeholder="Digite a marca" value={form.brand} onChange={e=>setForm(f=>({...f, brand: e.target.value}))} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="vehicle-model" className="text-sm text-gray-700 mb-1">Modelo</label>
          <input id="vehicle-model" name="model" className="border px-3 py-2 rounded" placeholder="Digite o modelo" value={form.model} onChange={e=>setForm(f=>({...f, model: e.target.value}))} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="vehicle-owner" className="text-sm text-gray-700 mb-1">Proprietário</label>
          <select id="vehicle-owner" name="ownerId" className="border px-3 py-2 rounded" value={form.ownerId} onChange={e=>setForm(f=>({...f, ownerId: e.target.value}))}>
            <option value="">Sem proprietário</option>
            {drivers.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Adicionar</button>
        </div>
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
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={6}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="p-3" colSpan={6}>Nenhum registro</td></tr>
            ) : (
              filtered.slice((page-1)*pageSize, (page-1)*pageSize + pageSize).map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">
                    {editId===i.id ? (
                      <input className="border px-2 py-1 rounded w-40" value={editForm.plate} onChange={e=>setEditForm(f=>({...f, plate:e.target.value}))} />
                    ) : i.plate}
                  </td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <select className="border px-2 py-1 rounded" value={editForm.species} onChange={e=>setEditForm(f=>({...f, species:e.target.value}))}>
                        {speciesOptions.map(s=> <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : i.species}
                  </td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <input className="border px-2 py-1 rounded w-32" value={editForm.brand} onChange={e=>setEditForm(f=>({...f, brand:e.target.value}))} />
                    ) : i.brand}
                  </td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <input className="border px-2 py-1 rounded w-32" value={editForm.model} onChange={e=>setEditForm(f=>({...f, model:e.target.value}))} />
                    ) : i.model}
                  </td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <select className="border px-2 py-1 rounded" value={editForm.ownerId} onChange={e=>setEditForm(f=>({...f, ownerId:e.target.value}))}>
                        <option value="">Sem proprietário</option>
                        {drivers.map(d=> <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    ) : (i.owner ? i.owner.name : '-')}
                  </td>
                  <td className="p-3">{i.violations?.length || 0}</td>
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
