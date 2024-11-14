import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, CreditCard, Wrench, Calendar, ArrowLeft } from 'lucide-react';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/cliente-detalhes.css";


interface Assistencia {
  id: number;
  marca: string;
  modelo: string;
  imei: string;
  codigo_seguranca: string;
  avaria: string;
  observacoes: string;
  tecnico: string;
  valor: number;
  estado: string;
  data_entrada: string;
  data_saida: string | null;
}

interface Cliente {
  id: number;
  nome: string;
  email: string;
  nif: string;
  telefone: string;
  morada: string;
  assistencias: Assistencia[];
}

export const ClienteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClienteDetalhes = async () => {
      try {
        if (!id) return;
        const response = await apiService.getClienteById(Number(id));
        console.log('API Response:', response);
        
        // Check if response exists and has the required fields
        if (response && response.data) {
          setCliente(response.data);
          setError(''); // Clear any previous errors
        } else {
          setError('Cliente não encontrado');
          setCliente(null);
        }
      } catch (err: any) {
        console.error('Error fetching client:', err);
        setError(`Erro ao carregar detalhes do cliente: ${err.message}`);
        setCliente(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClienteDetalhes();
  }, [id]);

  const handleVoltar = () => {
    navigate('/clientes');
  };

  if (loading) {
    return (
      <div className="page cliente-detalhes">
        <User className="page-icon" />
        <h1>Detalhes do Cliente</h1>
        <div className="loading-state">Carregando informações...</div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="page cliente-detalhes">
        <User className="page-icon" />
        <h1>Detalhes do Cliente</h1>
        <div className="error-message">{error || 'Cliente não encontrado'}</div>
        <button className="voltar-button" onClick={handleVoltar}>
          <ArrowLeft size={20} />
          Voltar para Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="page cliente-detalhes">
      <button className="voltar-button" onClick={handleVoltar}>
        <ArrowLeft size={20} />
        Voltar para Clientes
      </button>

      <User className="page-icon" />
      <h1>Detalhes do Cliente</h1>

      <div className="cliente-card">
        <h2 className="cliente-nome">{cliente.nome}</h2>
        <div className="info-grid">
          <div className="info-item">
            <Mail size={20} />
            <span>{cliente.email}</span>
          </div>
          <div className="info-item">
            <CreditCard size={20} />
            <span>{cliente.nif}</span>
          </div>
          <div className="info-item">
            <Phone size={20} />
            <span>{cliente.telefone}</span>
          </div>
          <div className="info-item">
            <Building size={20} />
            <span>{cliente.morada}</span>
          </div>
        </div>
      </div>

      <div className="assistencias-section">
        <h2>Histórico de Assistências</h2>
        {cliente.assistencias && cliente.assistencias.length > 0 ? (
          <div className="assistencias-grid">
            {cliente.assistencias.map((assistencia) => (
              <div 
                key={assistencia.id} 
                className="assistencia-card"
                onClick={() => navigate(`/assistencia/${assistencia.id}`)}
              >
                <div className="assistencia-header">
                  <Wrench size={20} />
                  <h3> {assistencia.id} - {assistencia.marca} {assistencia.modelo}</h3>
                </div>
                <div className="assistencia-content">
                  <p><strong>IMEI:</strong> {assistencia.imei}</p>
                  <p><strong>Avaria:</strong> {assistencia.avaria}</p>
                  <p><strong>Técnico:</strong> {assistencia.tecnico}</p>
                  <p><strong>Estado:</strong> {assistencia.estado}</p>
                  {assistencia.observacoes && (
                    <p><strong>Observações:</strong> {assistencia.observacoes}</p>
                  )}
                  <div className="assistencia-footer">
                    <div className="data">
                      <Calendar size={16} />
                      {new Date(assistencia.data_entrada).toLocaleDateString()}
                    </div>
                    <div className="valor">
                      €{assistencia.valor != null ? assistencia.valor.toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-assistencias">
            Nenhuma assistência registrada para este cliente.
          </div>
        )}
      </div>
    </div>
  );
};