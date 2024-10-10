import React from 'react';
import { UserPlus } from 'lucide-react';
import "../styles/pages.css";

export const NovoCliente = () => {
  return (
    <div className="page">
      <UserPlus className="page-icon" />
      <h1>Novo Cliente</h1>
      <p>Formulário para adicionar novo cliente será exibido aqui.</p>
    </div>
  );
};