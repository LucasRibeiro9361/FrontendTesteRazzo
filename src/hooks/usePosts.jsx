import { useState, useEffect } from 'react';
import { postService } from '../lib/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postService.getPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err.msg || 'Erro ao carregar posts');
      console.error('Erro ao carregar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getPost = async (id) => {
    try {
      return await postService.getPost(id);
    } catch (err) {
      setError(err.msg || 'Erro ao carregar post');
      throw err;
    }
  };

  const createPost = async (postData) => {
    try {
      const newPost = await postService.createPost(postData);
      setPosts([newPost, ...posts]);
      return newPost;
    } catch (err) {
      setError(err.msg || 'Erro ao criar post');
      throw err;
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const updatedPost = await postService.updatePost(id, postData);
      setPosts(posts.map(post => post._id === id ? updatedPost : post));
      return updatedPost;
    } catch (err) {
      console.error('Erro no hook updatePost:', err);
      const errorMessage = err.message || err.msg || 'Erro ao atualizar post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deletePost = async (id) => {
    try {
      await postService.deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      console.error('Erro no hook deletePost:', err);
      const errorMessage = err.message || err.msg || 'Erro ao excluir post';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const uploadImage = async (imageFile) => {
    try {
      return await postService.uploadImage(imageFile);
    } catch (err) {
      setError(err.msg || 'Erro ao fazer upload da imagem');
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    uploadImage
  };
};

