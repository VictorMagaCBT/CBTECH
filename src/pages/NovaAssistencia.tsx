import React, { useState, useEffect } from 'react';
import { Wrench, Search } from 'lucide-react';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/forms.css";

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export const NovaAssistencia = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    imei: '',
    codigo_seguranca: '',
    avaria: '',
    observacoes: '',
    tecnico: '',
    valor: '',
    estado: 'orçamentado'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await apiService.getClientes();
        setClientes(response.data);
      } catch (err: any) {
        console.error('Error fetching clients:', err);
        setError(`Erro ao buscar clientes: ${err.response?.data?.error || err.message}`);
      }
    };
    fetchClientes();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClienteSelect = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, estado: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selectedCliente) {
      setError('Por favor, selecione um cliente.');
      return;
    }
    try {
      const assistenciaData = {
        ...formData,
        cliente_id: selectedCliente.id,
        valor: parseFloat(formData.valor),
      };
      const response = await apiService.createAssistencia(assistenciaData);
      console.log('Assistência criada:', response.data);
      setSuccess('Assistência criada com sucesso!');
      // Reset form
      setSelectedCliente(null);
      setFormData({
        marca: '',
        modelo: '',
        imei: '',
        codigo_seguranca: '',
        avaria: '',
        observacoes: '',
        tecnico: '',
        valor: '',
        estado: 'orçamentado'
      });
    } catch (err: any) {
      console.error('Error creating assistência:', err);
      setError(`Erro ao criar assistência: ${err.response?.data?.error || err.message}`);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page nova-assistencia-page">
      <Wrench className="page-icon" />
      <h1>Nova Assistência</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Pesquisar cliente..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {searchTerm && (
        <ul className="client-list">
          {filteredClientes.map(cliente => (
            <li key={cliente.id} onClick={() => handleClienteSelect(cliente)}>
              {cliente.nome} - {cliente.email}
            </li>
          ))}
        </ul>
      )}

      {selectedCliente && (
        <div className="selected-client">
          Cliente selecionado: {selectedCliente.nome}
        </div>
      )}

      <form onSubmit={handleSubmit} className="assistencia-form">
        <div className="form-columns">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="marca">Marca</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="modelo">Modelo</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="imei">IMEI</label>
              <input
                type="text"
                id="imei"
                name="imei"
                value={formData.imei}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="codigo_seguranca">Código de Segurança</label>
              <input
                type="text"
                id="codigo_seguranca"
                name="codigo_seguranca"
                value={formData.codigo_seguranca}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tecnico">Técnico</label>
              <input
                type="text"
                id="tecnico"
                name="tecnico"
                value={formData.tecnico}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="avaria">Avaria</label>
              <textarea
                id="avaria"
                name="avaria"
                value={formData.avaria}
                onChange={handleInputChange}
                rows={3}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                rows={5}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="valor">Valor</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                step="0.01"
                required
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
        <button type="submit" className="submit-button">Criar Assistência</button>
      </form>
    </div>
  );
};