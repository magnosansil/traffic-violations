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
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [form, setForm] = useState({ description: '', level: 'LEVE' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', level: 'LEVE' });

  const load = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.get('/traffic-violation-types');
      setItems(data);
      setFiltered(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  useEffect(()=>{
    const q = search.trim().toLowerCase();
    let data = items;
    if (q) {
      data = items.filter(i =>
        i.description?.toLowerCase().includes(q) ||
        i.level?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
    setPage(1);
  }, [search, items]);

  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await api.post('/traffic-violation-types', form);
      setForm({ description: '', level: 'LEVE' });
      await load();
    } catch (e) { setError(e.message); }
  };

  const onDelete = async (id) => {
    setError('');
    try {
      if (!window.confirm('Tem certeza que deseja excluir este tipo de infração?')) return;
      await api.delete(`/traffic-violation-types/${id}`);
      await load();
    } catch (e) { setError(e.message); }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditForm({ description: item.description, level: item.level });
  };

  const cancelEdit = () => { setEditId(null); };

  const submitEdit = async () => {
    setError('');
    try {
      await api.put(`/traffic-violation-types/${editId}`, editForm);
      setEditId(null);
      await load();
    } catch (e) { setError(e.message); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tipos de Infração</h2>
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>}

      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="types-search" className="text-sm text-gray-700 mb-1">Buscar (descrição, nível)</label>
          <input id="types-search" className="border px-3 py-2 rounded" placeholder="Ex.: velocidade, gravíssima" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-700">Itens por página: 10</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col">
          <label htmlFor="type-description" className="text-sm text-gray-700 mb-1">Descrição</label>
          <input id="type-description" name="description" className="border px-3 py-2 rounded" placeholder="Descreva a infração" value={form.description} onChange={e=>setForm(f=>({...f, description: e.target.value}))} required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="type-level" className="text-sm text-gray-700 mb-1">Nível</label>
          <select id="type-level" name="level" className="border px-3 py-2 rounded" value={form.level} onChange={e=>setForm(f=>({...f, level: e.target.value}))} aria-label="Selecione o nível da infração">
            {levels.map(l=> <option key={l.value} value={l.value}>{l.label}</option>)}
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
              <th className="p-3">Descrição</th>
              <th className="p-3">Nível</th>
              <th className="p-3">Pontos</th>
              <th className="p-3">Criado em</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>Nenhum registro</td></tr>
            ) : (
              filtered.slice((page-1)*pageSize, (page-1)*pageSize + pageSize).map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">
                    {editId===i.id ? (
                      <input className="border px-2 py-1 rounded w-64" value={editForm.description} onChange={e=>setEditForm(f=>({...f, description:e.target.value}))} />
                    ) : i.description}
                  </td>
                  <td className="p-3">
                    {editId===i.id ? (
                      <select className="border px-2 py-1 rounded" value={editForm.level} onChange={e=>setEditForm(f=>({...f, level:e.target.value}))}>
                        {levels.map(l=> <option key={l.value} value={l.value}>{l.label}</option>)}
                      </select>
                    ) : i.level}
                  </td>
                  <td className="p-3">{i.points}</td>
                  <td className="p-3">{new Date(i.createdAt).toLocaleString()}</td>
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
