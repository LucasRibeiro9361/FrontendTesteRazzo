import { usePosts } from '../hooks/usePosts';
import PostItem from './PostItem';

const Posts = () => {
  const { posts, loading, error, deletePost } = usePosts();

  if (loading) {
    return <div className="text-center py-10">Carregando posts...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Nenhuma postagem encontrada</h2>
        <p className="text-gray-600">Seja o primeiro a criar uma postagem!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <PostItem key={post._id} post={post} onDelete={deletePost} />
      ))}
    </div>
  );
};

export default Posts;

