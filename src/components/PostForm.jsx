import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getPost, createPost, updatePost, uploadImage } = usePosts();
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const isEditing = !!id;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isEditing && id) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          setError('');
          const post = await getPost(id);
          setFormData({
            title: post.title,
            body: post.body,
            imageUrl: post.imageUrl || ''
          });
          if (post.imageUrl) {
            setImagePreview(`http://localhost:5000${post.imageUrl}`);
          }
        } catch (err) {
          setError('Erro ao carregar post');
          console.error('Erro ao carregar post:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isAuthenticated, navigate, isEditing]); 
  
  const { title, body, imageUrl } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    
    try {
      setUploading(true);
      const result = await uploadImage(imageFile);
      return result.imageUrl;
    } catch (err) {
      setError('Erro ao fazer upload da imagem');
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    try {
      let finalImageUrl = imageUrl;
      
      if (imageFile) {
        finalImageUrl = await handleImageUpload();
        if (!finalImageUrl) return; 
      }
      
      const postData = {
        title,
        body,
        imageUrl: finalImageUrl
      };
      
      if (isEditing) {
        await updatePost(id, postData);
        navigate('/');
      } else {
        await createPost(postData);
        navigate('/');
      }
    } catch (err) {
      console.error('Erro ao salvar post:', err);
      setError(err.message || err.msg || 'Erro ao salvar post');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, imageUrl: '' });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-10">Carregando...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">

        
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Postagem' : 'Nova Postagem'}
            </h1>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={onChange}
                className="form-input w-full"
                placeholder="Título da postagem"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Imagem da Postagem
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="form-input w-full"
              />
              
              {imagePreview && (
                <div className="mt-4 relative flex justify-center">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo
              </label>
              <textarea
                id="body"
                name="body"
                rows="10"
                required
                value={body}
                onChange={onChange}
                className="form-input w-full"
                placeholder="Conteúdo da postagem"
              ></textarea>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                type="submit" 
                className="btn-primary px-8 py-3"
                disabled={uploading}
              >
                {uploading ? 'Enviando...' : (isEditing ? 'Atualizar' : 'Publicar')}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/')} 
                className="btn-secondary px-8 py-3"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;

