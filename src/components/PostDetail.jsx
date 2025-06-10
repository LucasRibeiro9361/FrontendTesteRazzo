import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../lib/utils';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPost, deletePost } = usePosts();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const API_BASE_URL = 'http://localhost:5000';
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        const postData = await getPost(id);
        setPost(postData);
      } catch (err) {
        setError('Erro ao carregar post');
        console.error('Erro ao carregar post:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      setError('');
      await deletePost(id);
      setShowDeleteModal(false);
      navigate('/');
    } catch (err) {
      console.error('Erro ao excluir post:', err);
      setError(err.message || err.msg || 'Erro ao excluir post');
      setShowDeleteModal(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Carregando...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post não encontrado</h1>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }
  
  const isAuthor = user && post.user && (
    user._id === post.user._id || 
    user._id === post.user || 
    user.id === post.user._id || 
    user.id === post.user ||
    user._id?.toString() === post.user._id?.toString() ||
    user._id?.toString() === post.user?.toString() ||
    user.id?.toString() === post.user._id?.toString() ||
    user.id?.toString() === post.user?.toString()
  );

  console.log('Debug autorização:', {
    user: user,
    postUser: post.user,
    isAuthor: isAuthor,
    userIdType: typeof user?._id,
    postUserIdType: typeof post.user?._id,
    postUserType: typeof post.user
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="mb-4">
            <span className="text-sm text-blue-600 font-medium">Technology</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {post.imageUrl && (
            <div className="w-full mb-8">
              <img 
                src={`${API_BASE_URL}${post.imageUrl}`}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between mb-8">
            <div className="blog-author">
              <div className="author-avatar"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.user?.name || 'Autor'}
                </p>
                <p className="blog-date">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            
            {isAuthor && (
              <div className="flex space-x-2">
                <Link 
                  to={`/edit-post/${post._id}`}
                  className="btn-secondary text-sm"
                >
                  Editar
                </Link>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-danger text-sm"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="post-content">
          <div className="prose max-w-none">
            {post.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t">
          <Link 
            to="/" 
            className="text-blue-600 hover:underline"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </article>
      
      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir esta postagem? Esta ação não pode ser desfeita.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={handleDelete}
                className="btn-danger"
              >
                Excluir
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;

