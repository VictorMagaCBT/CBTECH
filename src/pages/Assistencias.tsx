import { useState, useEffect } from 'react';
import { Wrench, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/assistencias.css";

interface Assistencia {
  id: number;
  marca: string;
  modelo: string;
  imei?: string;
  avaria: string;
  valor: number;
  estado: string;
  data_entrada: string;
  cliente?: {
    id: number;
    nome: string;
    email: string;
  };
}

export const Assistencias = () => {
  const navigate = useNavigate();
  const [assistencias, setAssistencias] = useState<Assistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const assistenciasPerPage = 8;

  useEffect(() => {
    const fetchAssistencias = async () => {
      try {
        const response = await apiService.getAssistencias();
        const sortedAssistencias = response.data.sort((a: Assistencia, b: Assistencia) => 
          new Date(b.data_entrada).getTime() - new Date(a.data_entrada).getTime()
        );
        setAssistencias(sortedAssistencias);
        setLoading(false);
      } catch (err: any) {
        setError(`Falha ao buscar assistências: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      }
    };

    fetchAssistencias();
  }, []);

  const indexOfLastAssistencia = currentPage * assistenciasPerPage;
  const indexOfFirstAssistencia = indexOfLastAssistencia - assistenciasPerPage;
  const currentAssistencias = assistencias.slice(indexOfFirstAssistencia, indexOfLastAssistencia);
  const totalPages = Math.ceil(assistencias.length / assistenciasPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssistenciaClick = (assistenciaId: number) => {
    navigate(`/assistencia/${assistenciaId}`);
  };

  if (loading) {
    return (
      <div className="page assistencias-page">
        <Wrench className="page-icon" />
        <h1>Assistências</h1>
        <div className="loading-state">Carregando assistências...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page assistencias-page">
        <Wrench className="page-icon" />
        <h1>Assistências</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page assistencias-page">
      <Wrench className="page-icon" />
      <h1>Assistências</h1>
      {assistencias.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma assistência registrada.</p>
        </div>
      ) : (
        <>
          <div className="assistencias-grid">
            {currentAssistencias.map((assistencia) => (
              <div 
                key={assistencia.id} 
                className="assistencia-card"
                onClick={() => handleAssistenciaClick(assistencia.id)}
              >
                <div className="assistencia-header">
                  <Wrench size={16} />
                  <h3>{assistencia.id} - {assistencia.marca} {assistencia.modelo}</h3>
                </div>
                <div className="assistencia-content">
                  <div className="info-row">
                    <User size={16} />
                    <span>{assistencia.cliente?.nome || 'Cliente não encontrado'}</span>
                  </div>
                  {assistencia.imei && (
                    <div className="info-row">
                      <span className="label">IMEI:</span>
                      <span>{assistencia.imei}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="label">Avaria:</span>
                    <span>{assistencia.avaria}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Estado:</span>
                    <span className={`estado ${assistencia.estado}`}>{assistencia.estado}</span>
                  </div>
                  <div className="assistencia-footer">
                    <div className="data">
                      <Calendar size={16} />
                      {new Date(assistencia.data_entrada).toLocaleDateString()}
                    </div>
                    <div className="valor">
                    {assistencia.valor != null ? assistencia.valor.toFixed(2) : "0.00"}€
                    </div>
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