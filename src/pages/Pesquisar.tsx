import { useState, useEffect } from 'react';
import { Search, User, Smartphone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../api';
import "../styles/pages.css";
import "../styles/pesquisar.css";

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
}

interface Assistencia {
  id: number;
  marca: string;
  modelo: string;
  cliente: Cliente;
  data_entrada: string;
  avaria: string;
  estado: string;
  valor: number;
}

interface ClienteQuery {
  nome: string;
  telefone: string;
}

interface AssistenciaQuery {
  marca: string;
  modelo: string;
  dataInicio: string;
  dataFim: string;
}

export const Pesquisar = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'cliente' | 'assistencia'>('cliente');
  const [clienteQuery, setClienteQuery] = useState<ClienteQuery>({ nome: '', telefone: '' });
  const [assistenciaQuery, setAssistenciaQuery] = useState<AssistenciaQuery>({
    marca: '',
    modelo: '',
    dataInicio: '',
    dataFim: ''
  });
  const [resultados, setResultados] = useState<Array<Cliente | Assistencia>>([]);
  const [sugestoes, setSugestoes] = useState<Array<Cliente | Assistencia>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const buscarSugestoes = async () => {
      if (searchType === 'cliente' && (clienteQuery.nome || clienteQuery.telefone)) {
        try {
          const response = await apiService.searchClientes(clienteQuery);
          setSugestoes(response.data || []);
        } catch (err) {
          console.error('Erro ao buscar sugestões de clientes:', err);
          setSugestoes([]);
        }
      } else if (searchType === 'assistencia' && (assistenciaQuery.marca || assistenciaQuery.modelo)) {
        try {
          const response = await apiService.searchAssistencias({
            marca: assistenciaQuery.marca,
            modelo: assistenciaQuery.modelo,
            dataInicio: assistenciaQuery.dataInicio || undefined,
            dataFim: assistenciaQuery.dataFim || undefined
          });
          setSugestoes(response.data || []);
        } catch (err) {
          console.error('Erro ao buscar sugestões de assistências:', err);
          setSugestoes([]);
        }
      } else {
        setSugestoes([]);
      }
    };

    const timeoutId = setTimeout(buscarSugestoes, 300);
    return () => clearTimeout(timeoutId);
  }, [clienteQuery, assistenciaQuery, searchType]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      if (searchType === 'cliente') {
        const response = await apiService.searchClientes(clienteQuery);
        setResultados(response.data || []);
      } else {
        const response = await apiService.searchAssistencias({
          marca: assistenciaQuery.marca,
          modelo: assistenciaQuery.modelo,
          dataInicio: assistenciaQuery.dataInicio || undefined,
          dataFim: assistenciaQuery.dataFim || undefined
        });
        setResultados(response.data || []);
      }
      setSugestoes([]);
    } catch (err: any) {
      setError(`Erro na pesquisa: ${err.message}`);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClienteClick = (clienteId: number) => {
    navigate(`/cliente/${clienteId}`);
  };

  const clearSearch = () => {
    setClienteQuery({ nome: '', telefone: '' });
    setAssistenciaQuery({ marca: '', modelo: '', dataInicio: '', dataFim: '' });
    setResultados([]);
    setSugestoes([]);
    setError('');
  };

  const handleSugestaoClick = (sugestao: Cliente | Assistencia) => {
    if ('nome' in sugestao) {
      handleClienteClick(sugestao.id);
    } else {
      navigate(`/assistencia/${sugestao.id}`);
    }
  };

  return (
    <div className="page pesquisar-page">
      <Search className="page-icon" />
      <h1>Pesquisar</h1>

      <div className="search-type-selector">
        <button 
          className={`type-button ${searchType === 'cliente' ? 'active' : ''}`}
          onClick={() => {
            setSearchType('cliente');
            clearSearch();
          }}
        >
          <User size={20} />
          Pesquisar Cliente
        </button>
        <button 
          className={`type-button ${searchType === 'assistencia' ? 'active' : ''}`}
          onClick={() => {
            setSearchType('assistencia');
            clearSearch();
          }}
        >
          <Smartphone size={20} />
          Pesquisar Assistência
        </button>
      </div>

      <div className="search-container">
        {searchType === 'cliente' ? (
          <div className="search-fields">
            <div className="field-group">
              <label>Nome do Cliente</label>
              <input
                type="text"
                value={clienteQuery.nome}
                onChange={(e) => setClienteQuery({ ...clienteQuery, nome: e.target.value })}
                placeholder="Digite o nome do cliente"
              />
            </div>
            <div className="field-group">
              <label>Telefone</label>
              <input
                type="text"
                value={clienteQuery.telefone}
                onChange={(e) => setClienteQuery({ ...clienteQuery, telefone: e.target.value })}
                placeholder="Digite o número de telefone"
              />
            </div>
          </div>
        ) : (
          <div className="search-fields">
            <div className="field-group">
              <label>Marca</label>
              <input
                type="text"
                value={assistenciaQuery.marca}
                onChange={(e) => setAssistenciaQuery({ ...assistenciaQuery, marca: e.target.value })}
                placeholder="Digite a marca do dispositivo"
              />
            </div>
            <div className="field-group">
              <label>Modelo</label>
              <input
                type="text"
                value={assistenciaQuery.modelo}
                onChange={(e) => setAssistenciaQuery({ ...assistenciaQuery, modelo: e.target.value })}
                placeholder="Digite o modelo do dispositivo"
              />
            </div>
            <div className="field-group date-range">
              <div className="date-field">
                <label>Data Início   </label>
                <input
                  type="date"
                  value={assistenciaQuery.dataInicio}
                  onChange={(e) => setAssistenciaQuery({ ...assistenciaQuery, dataInicio: e.target.value })}
                />
              </div>
              <div className="date-field">
                <label>Data Fim   </label>
                <input
                  type="date"
                  value={assistenciaQuery.dataFim}
                  onChange={(e) => setAssistenciaQuery({ ...assistenciaQuery, dataFim: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {sugestoes.length > 0 && (
          <div className="sugestoes-lista">
            {sugestoes.map((sugestao: any) => (
              <div
                key={sugestao.id}
                className="sugestao-item"
                onClick={() => handleSugestaoClick(sugestao)}
              >
                {'nome' in sugestao ? (
                  <div className="sugestao-cliente">
                    <User size={16} />
                    <span>{sugestao.nome}</span>
                    <span className="sugestao-info">{sugestao.telefone}</span>
                  </div>
                ) : (
                  <div className="sugestao-assistencia">
                    <Smartphone size={16} />
                    <span>#{sugestao.id} - {sugestao.marca} {sugestao.modelo}</span>
                    <span className="sugestao-info">{sugestao.cliente?.nome}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="search-actions">
          <button className="search-button" onClick={handleSearch} disabled={loading}>
            <Search size={20} />
            Pesquisar
          </button>
          <button className="clear-button" onClick={clearSearch}>
            <X size={20} />
            Limpar
          </button>
        </div>
      </div>

      {loading && <div className="loading-state">Pesquisando...</div>}
      {error && <div className="error-message">{error}</div>}

      {resultados.length > 0 && (
        <div className="resultados-container">
          <h2>Resultados da Pesquisa</h2>
          <div className="resultados-grid">
            {resultados.map((resultado: any) => (
              <div 
                key={resultado.id} 
                className="resultado-card"
                onClick={() => 'nome' in resultado ? 
                  handleClienteClick(resultado.id) : 
                  navigate(`/assistencia/${resultado.id}`)}
              >
                {'nome' in resultado ? (
                  <>
                    <div className="card-header">
                      <User size={20} />
                      <h3>{resultado.nome}</h3>
                    </div>
                    <div className="card-content">
                      <p><strong>Telefone:</strong> {resultado.telefone}</p>
                      <p><strong>Email:</strong> {resultado.email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="card-header">
                      <Smartphone size={20} />
                      <h3>{resultado.id} - {resultado.marca} {resultado.modelo}</h3>
                    </div>
                    <div className="card-content">
                      <p><strong>Cliente:</strong> {resultado.cliente?.nome}</p>
                      <p><strong>Data:</strong> {new Date(resultado.data_entrada).toLocaleDateString()}</p>
                      <p><strong>Estado:</strong> {resultado.estado}</p>
                      <p><strong>Valor:</strong> {resultado.valor != null ? resultado.valor.toFixed(2) : "0.00"}€</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};