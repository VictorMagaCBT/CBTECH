import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { apiService } from '../api';
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
        const response = await apiService.getClientes();
        setClientes(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(`Falha ao buscar clientes: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page clientes-page">
      <Users className="page-icon" />
      <h1>Clientes</h1>
      {clientes.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <ul className="clientes-list">
          {clientes.map((cliente) => (
            <li key={cliente.id} className="cliente-item">
              <strong>{cliente.nome}</strong> - {cliente.email}
              <br />
              NIF: {cliente.nif} | Telefone: {cliente.telefone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};