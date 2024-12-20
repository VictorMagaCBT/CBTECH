// In src/pages/AssistenciaDetalhes.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wrench, ArrowLeft } from 'lucide-react';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/assistencia-detalhes.css";

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

type EstadoAssistencia = 'orçamentado' | 'reparado' | 'entregue';

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
  estado: EstadoAssistencia;
  data_entrada: string;
  data_saida: string | null;
  cliente: Cliente;
}

export const AssistenciaDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assistencia, setAssistencia] = useState<Assistencia | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Assistencia>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAssistencia = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAssistenciaById(Number(id));
        setAssistencia(response.data);
        setFormData(response.data);
      } catch (err: any) {
        setError(`Erro ao carregar assistência: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAssistencia();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as EstadoAssistencia;
    setFormData(prev => ({
      ...prev,
      estado: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!assistencia?.cliente?.id) {
      setError('Dados do cliente não disponíveis');
      return;
    }

    try {
      const updateData = {
        ...formData,
        cliente_id: assistencia.cliente.id,
        valor: typeof formData.valor === 'string' ? parseFloat(formData.valor) : formData.valor
      };

      const response = await apiService.updateAssistencia(Number(id), updateData);
      setSuccess('Assistência atualizada com sucesso!');
      setAssistencia(response.data);
      
      // Refresh the data
      const refreshResponse = await apiService.getAssistenciaById(Number(id));
      setAssistencia(refreshResponse.data);
      setFormData(refreshResponse.data);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error updating assistência:', err);
      setError(`Erro ao atualizar assistência: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="page assistencia-detalhes">
        <div className="loading-state">Carregando...</div>
      </div>
    );
  }

  if (error && !assistencia) {
    return (
      <div className="page assistencia-detalhes">
        <div className="error-message">{error}</div>
        <button className="voltar-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>
    );
  }

  if (!assistencia) {
    return (
      <div className="page assistencia-detalhes">
        <div className="error-message">Assistência não encontrada</div>
        <button className="voltar-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="page assistencia-detalhes">
      <button className="voltar-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Voltar
      </button>

      <Wrench className="page-icon" />
      <h1>Detalhes da Assistência</h1>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="assistencia-form">
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label>Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>IMEI</label>
                <input
                  type="text"
                  name="imei"
                  value={formData.imei || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Código de Segurança</label>
                <input
                  type="text"
                  name="codigo_seguranca"
                  value={formData.codigo_seguranca || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Valor</label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor || ''}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label>Avaria</label>
                <textarea
                  name="avaria"
                  value={formData.avaria || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="estado"
                      value="orçamentado"
                      checked={formData.estado === 'orçamentado'}
                      onChange={handleEstadoChange}
                    />
                    Orçamentado
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="estado"
                      value="reparado"
                      checked={formData.estado === 'reparado'}
                      onChange={handleEstadoChange}
                    />
                    Reparado
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="estado"
                      value="entregue"
                      checked={formData.estado === 'entregue'}
                      onChange={handleEstadoChange}
                    />
                    Entregue
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">Salvar</button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="assistencia-info">
          <div className="info-section">
            <h2>Informações do Cliente</h2>
            <p><strong>Nome:</strong> {assistencia.cliente.nome}</p>
            <p><strong>Email:</strong> {assistencia.cliente.email}</p>
          </div>

          <div className="info-section">
            <h2>Detalhes do Dispositivo</h2>
            <p><strong>{assistencia.id} - Marca:</strong> {assistencia.marca}</p>
            <p><strong>Modelo:</strong> {assistencia.modelo}</p>
            <p><strong>IMEI:</strong> {assistencia.imei}</p>
            <p><strong>Código de Segurança:</strong> {assistencia.codigo_seguranca}</p>
          </div>

          <div className="info-section">
            <h2>Detalhes do Serviço</h2>
            <p><strong>Avaria:</strong> {assistencia.avaria}</p>
            <p><strong>Observações:</strong> {assistencia.observacoes || 'Nenhuma observação'}</p>
            <p><strong>Técnico:</strong> {assistencia.tecnico}</p>
            <p><strong>Valor:</strong> €{assistencia.valor != null ? assistencia.valor.toFixed(2) : "0.00"}</p>
            <p><strong>Estado:</strong> {assistencia.estado}</p>
            <p><strong>Data de Entrada:</strong> {new Date(assistencia.data_entrada).toLocaleDateString()}</p>
            {assistencia.data_saida && (
              <p><strong>Data de Saída:</strong> {new Date(assistencia.data_saida).toLocaleDateString()}</p>
            )}
          </div>

          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Editar Assistência
          </button>
        </div>
      )}
    </div>
  );
};