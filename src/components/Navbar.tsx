import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import "../styles/navbar.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="menu-icon" onClick={toggleMenu}>
          <Menu size={24} />
        </div>
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link className="nav-link" to="/clientes" onClick={() => setIsMenuOpen(false)}>Clientes</Link>
          <Link className="nav-link" to="/novoCliente" onClick={() => setIsMenuOpen(false)}>Novo Cliente</Link>
          <Link className="nav-link" to="/novaAssistencia" onClick={() => setIsMenuOpen(false)}>Criar Assistência</Link>
          <Link className="nav-link" to="/pesquisar" onClick={() => setIsMenuOpen(false)}>Pesquisar</Link>
        </div>
      </div>
    </nav>  
  );
};