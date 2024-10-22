import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, CreditCard, Wrench, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/cliente-detalhes.css";

interface Assistencia {
  id: number;
  marca: string;
  modelo: string;
  imei: string;
  avaria: string;
  observacoes: string | null;
  tecnico: string;
  valor: number;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchClienteDetalhes = async () => {
      if (!id) return;
      
      try {
        const response = await apiService.getClienteById(Number(id));
        setCliente(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do cliente');
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
      <User className="page-icon" />
      <h1>Detalhes do Cliente</h1>

      <button className="voltar-button" onClick={handleVoltar}>
        <ArrowLeft size={20} />
        Voltar para Clientes
      </button>

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
              <div key={assistencia.id} className="assistencia-card">
                <div className="assistencia-header">
                  <Wrench size={20} />
                  <h3>{assistencia.marca} {assistencia.modelo}</h3>
                </div>
                <div className="assistencia-content">
                  <p className="imei"><strong>IMEI:</strong> {assistencia.imei}</p>
                  <p className="avaria"><strong>Avaria:</strong> {assistencia.avaria}</p>
                  {assistencia.observacoes && (
                    <p className="observacoes"><strong>Observações:</strong> {assistencia.observacoes}</p>
                  )}
                  <p className="tecnico"><strong>Técnico:</strong> {assistencia.tecnico}</p>
                  <div className="assistencia-footer">
                    <div className="data">
                      <Calendar size={16} />
                      <span>Entrada: {new Date(assistencia.data_entrada).toLocaleDateString()}</span>
                      {assistencia.data_saida && (
                        <span>Saída: {new Date(assistencia.data_saida).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="valor">
                      <DollarSign size={16} />
                      <span>{assistencia.valor.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-assistencias">Nenhuma assistência registrada</p>
        )}
      </div>
    </div>
  );
};

