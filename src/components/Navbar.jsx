import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onNewPostClick }) => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="logo flex items-center">
            <span className="text-blue-600">RAZZO</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="nav-link">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <button 
                  onClick={onNewPostClick}
                  className="nav-link hover:text-blue-600 transition-colors"
                >
                  Nova postagem
                </button>
                <span className="text-gray-600">Olá, {user?.username}</span>
                <button 
                  onClick={logout} 
                  className="btn-secondary"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

