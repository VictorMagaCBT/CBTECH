import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { api } from '../../api';
import "../styles/pages.css";

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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="nif"
          value={formData.nif}
          onChange={handleChange}
          placeholder="NIF"
          required
        />
        <input
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="Telefone"
          required
        />
        <input
          type="text"
          name="morada"
          value={formData.morada}
          onChange={handleChange}
          placeholder="Morada"
          required
        />
        <button type="submit">Criar Cliente</button>
      </form>
    </div>
  );
};