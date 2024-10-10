import React from 'react';
import { Users } from 'lucide-react';
import "../styles/pages.css";

export const Clientes = () => {
  return (
    <div className="page">
      <Users className="page-icon" />
      <h1>Clientes</h1>
      <p>Lista de clientes será exibida aqui.</p>
    </div>
  );
};