import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { api } from '../../api';
import "../styles/pages.css";
import "../styles/forms.css";

export const NovoCliente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    nif: '',
    telefone: '',
    morada: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.createCliente(formData);
      console.log('Response:', response);
      alert('Cliente criado com sucesso!');
      setFormData({ nome: '', email: '', nif: '', telefone: '', morada: '' });
    } catch (err) {
      console.error('Error creating client:', err);
      alert('Erro ao criar cliente: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="page novo-cliente-page">
      <UserPlus className="page-icon" />
      <h1>Novo Cliente</h1>
      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="form-columns">
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nif">NIF</label>
              <input
                type="text"
                id="nif"
                name="nif"
                value={formData.nif}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="morada">Morada</label>
              <input
                type="text"
                id="morada"
                name="morada"
                value={formData.morada}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="submit-button">Criar Cliente</button>
      </form>
    </div>
  );
};