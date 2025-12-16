import React, { useEffect, useState } from 'react';
import api from '../api';

export default function DriversViolators() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{
    (async ()=>{
      setLoading(true); setError('');
      try {
        const data = await api.get('/drivers/violators');
        setItems(data);
      } catch(e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  },[]);

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-50">
            <th className="p-3">Condutor</th>
            <th className="p-3">Nº Habilitação</th>
            <th className="p-3">Total de Pontos</th>
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
