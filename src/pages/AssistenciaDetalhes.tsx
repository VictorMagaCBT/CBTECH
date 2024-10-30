import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wrench, ArrowLeft } from 'lucide-react';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/assistencia-detalhes.css";

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
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
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
        const response = await apiService.getAssistenciaById(Number(id));
        setAssistencia(response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(`Erro ao carregar assistência: ${err.message}`);
        setLoading(false);
      }
    };

    fetchAssistencia();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, estado: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiService.updateAssistencia(Number(id), formData);
      setAssistencia(response.data);
      setSuccess('Assistência atualizada com sucesso!');
      setIsEditing(false);
    } catch (err: any) {
      setError(`Erro ao atualizar assistência: ${err.message}`);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!assistencia) return <div className="error">Assistência não encontrada</div>;

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
                  value={formData.marca}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>IMEI</label>
                <input
                  type="text"
                  name="imei"
                  value={formData.imei}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Código de Segurança</label>
                <input
                  type="text"
                  name="codigo_seguranca"
                  value={formData.codigo_seguranca}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-column">
              <div className="form-group">
                <label>Avaria</label>
                <textarea
                  name="avaria"
                  value={formData.avaria}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Observações</label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
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
            <p><strong>Marca:</strong> {assistencia.marca}</p>
            <p><strong>Modelo:</strong> {assistencia.modelo}</p>
            <p><strong>IMEI:</strong> {assistencia.imei}</p>
            <p><strong>Código de Segurança:</strong> {assistencia.codigo_seguranca}</p>
          </div>

          <div className="info-section">
            <h2>Detalhes do Serviço</h2>
            <p><strong>Avaria:</strong> {assistencia.avaria}</p>
            <p><strong>Observações:</strong> {assistencia.observacoes || 'Nenhuma observação'}</p>
            <p><strong>Técnico:</strong> {assistencia.tecnico}</p>
            <p><strong>Valor:</strong> €{assistencia.valor.toFixed(2)}</p>
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