
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Clientes } from './pages/Clientes';
import { ClienteDetalhes } from './pages/ClienteDetalhes';
import { NovoCliente } from './pages/NovoCliente';
import { NovaAssistencia } from './pages/NovaAssistencia';
import { AssistenciaDetalhes } from './pages/AssistenciaDetalhes';
import { Assistencias } from './pages/Assistencias';
import { Pesquisar } from './pages/Pesquisar';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Home />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/clientes" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Clientes />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/cliente/:id" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <ClienteDetalhes />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/novoCliente" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <NovoCliente />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/novaAssistencia" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <NovaAssistencia />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/assistencia/:id" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <AssistenciaDetalhes />
            </div>
          </ProtectedRoute>
        } />

<Route path="/assistencias" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <Assistencias />
              </div>
            </ProtectedRoute>
          } />
        
        <Route path="/pesquisar" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Pesquisar />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  </AuthProvider>
);
}

export default App;