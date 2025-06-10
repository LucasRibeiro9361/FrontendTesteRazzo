import { useState } from 'react';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../hooks/useAuth';

const PostModal = ({ isOpen, onClose }) => {
  const { createPost, uploadImage } = usePosts();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const { title, body } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
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
    
    if (!isAuthenticated) {
      setError('Você precisa estar logado para criar uma postagem');
      return;
    }
    
    try {
      setLoading(true);
      
      let imageUrl = '';
      
      // Se há uma imagem para upload
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) return; // Se o upload falhou
      }
      
      const postData = {
        title,
        body,
        imageUrl
      };
      
      await createPost(postData);
      
      // Limpar formulário e fechar modal
      setFormData({ title: '', body: '' });
      setImageFile(null);
      onClose();
    } catch (err) {
      setError(err.msg || 'Erro ao criar postagem');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: '', body: '' });
    setImageFile(null);
    setError('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Nova postagem</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Título da postagem"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Corpo
            </label>
            <textarea
              id="body"
              name="body"
              rows="8"
              required
              value={body}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Escreva o conteúdo da sua postagem..."
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem (opcional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'Solte um arquivo aqui para fazer o upload'}
                  </p>
                </div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || uploading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;

