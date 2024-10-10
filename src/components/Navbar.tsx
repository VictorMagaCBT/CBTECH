import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/clientes">Clientes</Link>
          <Link className="nav-link" to="/novoCliente">Novo Cliente</Link>
          <Link className="nav-link" to="/novaAssistencia">Criar Assistência</Link>
          <Link className="nav-link" to="/pesquisar">Pesquisar</Link>
        </div>
      </div>
    </nav>  
  );
};