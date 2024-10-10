import React from 'react';
import { Wrench } from 'lucide-react';
import "../styles/pages.css";

export const NovaAssistencia = () => {
  return (
    <div className="page">
      <Wrench className="page-icon" />
      <h1>Nova Assistência</h1>
      <p>Formulário para criar nova assistência será exibido aqui.</p>
    </div>
  );
};