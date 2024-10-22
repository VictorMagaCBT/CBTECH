
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Clientes } from './pages/Clientes';
import { ClienteDetalhes } from './pages/ClienteDetalhes';
import { NovoCliente } from './pages/NovoCliente';
import { NovaAssistencia } from './pages/NovaAssistencia';
import { Pesquisar } from './pages/Pesquisar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/cliente/:id" element={<ClienteDetalhes />} />
          <Route path="/novoCliente" element={<NovoCliente />} />
          <Route path="/novaAssistencia" element={<NovaAssistencia />} />
          <Route path="/pesquisar" element={<Pesquisar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;