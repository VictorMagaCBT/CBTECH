import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Building, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/clientes.css";

interface Cliente {
  id: number;
  nome: string;
  email: string;
  nif: string;
  telefone: string;
  morada: string;
}

export const Clientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clientesPerPage = 8;

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await apiService.getClientes();
        const sortedClientes = response.data.sort((a: Cliente, b: Cliente) => 
          a.nome.localeCompare(b.nome)
        );
        setClientes(sortedClientes);
        setLoading(false);
      } catch (err: any) {
        setError(`Falha ao buscar clientes: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const indexOfLastCliente = currentPage * clientesPerPage;
  const indexOfFirstCliente = indexOfLastCliente - clientesPerPage;
  const currentClientes = clientes.slice(indexOfFirstCliente, indexOfLastCliente);
  const totalPages = Math.ceil(clientes.length / clientesPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClienteClick = (clienteId: number) => {
    navigate(`/cliente/${clienteId}`);
  };

  if (loading) {
    return (
      <div className="page clientes-page">
        <Users className="page-icon" />
        <h1>Clientes</h1>
        <div className="loading-state">Carregando clientes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page clientes-page">
        <Users className="page-icon" />
        <h1>Clientes</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page clientes-page">
      <Users className="page-icon" />
      <h1>Clientes</h1>
      {clientes.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum cliente cadastrado.</p>
        </div>
      ) : (
        <>
          <div className="clientes-grid">
            {currentClientes.map((cliente) => (
              <div 
                key={cliente.id} 
                className="cliente-card"
                onClick={() => handleClienteClick(cliente.id)}
              >
                <div className="cliente-header">
                  <h3>{cliente.nome}</h3>
                </div>
                <div className="cliente-content">
                  <div className="info-row">
                    <Mail size={16} />
                    <span>{cliente.email}</span>
                  </div>
                  <div className="info-row">
                    <CreditCard size={16} />
                    <span>{cliente.nif}</span>
                  </div>
                  <div className="info-row">
                    <Phone size={16} />
                    <span>{cliente.telefone}</span>
                  </div>
                  <div className="info-row">
                    <Building size={16} />
                    <span>{cliente.morada}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-button"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              <button 
                className="pagination-button"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
