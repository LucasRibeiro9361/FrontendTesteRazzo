import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PostDetail from './components/PostDetail';
import PostForm from './components/PostForm';
import PostModal from './components/PostModal';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleNewPostClick = () => {
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar onNewPostClick={handleNewPostClick} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route 
                path="/edit-post/:id" 
                element={
                  <PrivateRoute>
                    <PostForm />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="bg-gray-100 py-4 text-center text-gray-600">
            <div className="container mx-auto">
              &copy; {new Date().getFullYear()} RAZZO
            </div>
          </footer>
          
          <PostModal 
            isOpen={isPostModalOpen} 
            onClose={handleClosePostModal} 
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

