import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { api } from '../api';
import "../styles/pages.css";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  nif: string;
  telefone: string;
  morada: string;
}

export const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.getClientes();
        setClientes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch clients');
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page clientes-page">
      <Users className="page-icon" />
      <h1>Clientes</h1>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>{cliente.nome} - {cliente.email}</li>
        ))}
      </ul>
    </div>
  );
};