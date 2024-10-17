import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { api } from '../api';
import axios from 'axios';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      console.log('Enviando dados:', formData);
      const response = await api.createCliente(formData);
      console.log('Response:', response);
      setSuccess('Cliente criado com sucesso!');
      setFormData({ nome: '', email: '', nif: '', telefone: '', morada: '' });
    } catch (err) {
      console.error('Error creating client:', err);
      if (axios.isAxiosError(err)) {
        setError(`Erro ao criar cliente: ${err.response?.data?.error || err.message}`);
      } else {
        setError('Erro desconhecido ao criar cliente');
      }
    }
  };

  return (
    <div className="page novo-cliente-page">
      <UserPlus className="page-icon" />
      <h1>Novo Cliente</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="cliente-form">
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
        <button type="submit" className="submit-button">Criar Cliente</button>
      </form>
    </div>
  );
};