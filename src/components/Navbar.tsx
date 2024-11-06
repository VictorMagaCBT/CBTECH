import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import "../styles/navbar.css";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          <Link className="nav-link" to="/assistencias" onClick={() => setIsMenuOpen(false)}>Assistências</Link>
          <Link className="nav-link" to="/novoCliente" onClick={() => setIsMenuOpen(false)}>Novo Cliente</Link>
          <Link className="nav-link" to="/novaAssistencia" onClick={() => setIsMenuOpen(false)}>Criar Assistência</Link>
          <Link className="nav-link" to="/pesquisar" onClick={() => setIsMenuOpen(false)}>Pesquisar</Link>
          <button className="nav-link logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>  
  );
};
