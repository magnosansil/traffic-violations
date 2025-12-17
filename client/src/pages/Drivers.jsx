import React, { useEffect, useState } from 'react';
import api from '../api';

const genders = ['MASCULINO', 'FEMININO', 'OUTRO'];

function toDateInputValue(dateLike) {
  const d = new Date(dateLike);
  // Ajuste de timezone para yyyy-mm-dd
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export default function Drivers() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [form, setForm] = useState({
    name: '',
    gender: 'MASCULINO',
    birthDate: '',
    licenseNumber: '',
    licenseValidity: '',
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    gender: 'MASCULINO',
    birthDate: '',
    licenseNumber: '',
    licenseValidity: '',
  });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/drivers');
      setItems(data);
      setFiltered(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(()=>{
    const q = search.trim().toLowerCase();
    let data = items;
    if (q) {
      data = items.filter(i =>
        i.name?.toLowerCase().includes(q) ||
        i.licenseNumber?.toLowerCase().includes(q)
      );
    }
    setFiltered(data);
    setPage(1);
  }, [search, items]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/drivers', form);
      setForm({
        name: '',
        gender: 'MASCULINO',
        birthDate: '',
        licenseNumber: '',
        licenseValidity: '',
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const onDelete = async (id) => {
    setError('');
    try {
      if (!window.confirm('Tem certeza que deseja excluir este condutor?')) return;
      await api.delete(`/drivers/${id}`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      name: item.name,
      gender: item.gender,
      birthDate: toDateInputValue(item.birthDate),
      licenseNumber: item.licenseNumber,
      licenseValidity: toDateInputValue(item.licenseValidity),
    });
  };

  const cancelEdit = () => setEditId(null);

  const submitEdit = async () => {
    setError('');
    try {
      await api.put(`/drivers/${editId}`, editForm);
      setEditId(null);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Condutores</h2>
      <div className="mb-4 text-sm text-gray-700">Lista de infratores: veja a seção abaixo.</div>
      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">{error}</div>
      )}

      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="drivers-search" className="text-sm text-gray-700 mb-1">Buscar (nome, nº habilitação)</label>
          <input id="drivers-search" className="border px-3 py-2 rounded" placeholder="Ex.: Maria, 123456" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-700">Itens por página: 10</div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-3"
      >
        <div className="flex flex-col md:col-span-2">
          <label htmlFor="driver-name" className="text-sm text-gray-700 mb-1">Nome</label>
          <input
            id="driver-name"
            name="name"
            className="border px-3 py-2 rounded"
            placeholder="Digite o nome completo"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="driver-gender" className="text-sm text-gray-700 mb-1">Gênero</label>
          <select
            id="driver-gender"
            name="gender"
            className="border px-3 py-2 rounded"
            value={form.gender}
            onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            aria-label="Selecione o gênero"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="driver-birth" className="text-sm text-gray-700 mb-1">Data de Nascimento</label>
          <input
            id="driver-birth"
            name="birthDate"
            type="date"
            className="border px-3 py-2 rounded"
            value={form.birthDate}
            onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="driver-license" className="text-sm text-gray-700 mb-1">Número da Habilitação</label>
          <input
            id="driver-license"
            name="licenseNumber"
            className="border px-3 py-2 rounded"
            placeholder="Digite o nº da CNH"
            value={form.licenseNumber}
            onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="driver-license-validity" className="text-sm text-gray-700 mb-1">Validade da Habilitação</label>
          <input
            id="driver-license-validity"
            name="licenseValidity"
            type="date"
            className="border px-3 py-2 rounded"
            value={form.licenseValidity}
            onChange={(e) => setForm((f) => ({ ...f, licenseValidity: e.target.value }))}
            required
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">
            Adicionar
          </button>
        </div>
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
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3" colSpan={7}>
                  Carregando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-3" colSpan={7}>
                  Nenhum registro
                </td>
              </tr>
            ) : (
              filtered.slice((page-1)*pageSize, (page-1)*pageSize + pageSize).map((i) => (
                <tr key={i.id} className="border-t">
                  <td className="p-3">
                    {editId === i.id ? (
                      <input
                        className="border px-2 py-1 rounded w-48"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, name: e.target.value }))
                        }
                      />
                    ) : (
                      i.name
                    )}
                  </td>
                  <td className="p-3">
                    {editId === i.id ? (
                      <select
                        className="border px-2 py-1 rounded"
                        value={editForm.gender}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, gender: e.target.value }))
                        }
                      >
                        {genders.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    ) : (
                      i.gender
                    )}
                  </td>
                  <td className="p-3">
                    {editId === i.id ? (
                      <input
                        className="border px-2 py-1 rounded w-40"
                        value={editForm.licenseNumber}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            licenseNumber: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      i.licenseNumber
                    )}
                  </td>
                  <td className="p-3">
                    {editId === i.id ? (
                      <input
                        type="date"
                        className="border px-2 py-1 rounded"
                        value={editForm.licenseValidity}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            licenseValidity: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      new Date(i.licenseValidity).toLocaleDateString()
                    )}
                  </td>
                  <td className="p-3">{i.ownedVehicles?.length || 0}</td>
                  <td className="p-3">{i.trafficViolations?.length || 0}</td>
                  <td className="p-3 space-x-2">
                    {editId === i.id ? (
                      <>
                        <button
                          type="button"
                          className="bg-green-600 text-white px-3 py-1 rounded"
                          onClick={submitEdit}
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                          onClick={cancelEdit}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => startEdit(i)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => onDelete(i.id)}
                        >
                          Excluir
                        </button>
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

      <h3 className="text-xl font-semibold mt-8 mb-3">
        Condutores infratores (por pontos)
      </h3>
      {/* Tabela simples com endpoint /drivers/violators */}
      <ViolatorsTable />
    </div>
  );
}

function ViolatorsTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        setItems(await api.get('/drivers/violators'));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded">{error}</div>
      )}
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
            <tr>
              <td className="p-3" colSpan={3}>
                Carregando...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td className="p-3" colSpan={3}>
                Nenhum infrator
              </td>
            </tr>
          ) : (
            items.map((i) => (
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
