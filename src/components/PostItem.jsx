import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';

const PostItem = ({ post }) => {
  const API_BASE_URL = 'http://localhost:5000';

  return (
    <article className="blog-card">
      {post.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={`${API_BASE_URL}${post.imageUrl}`}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium">Technology</span>
        </div>
        
        <h2 className="blog-title">
          <Link 
            to={`/posts/${post._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.body.substring(0, 150)}...
        </p>
        
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
      </div>
    </article>
  );
};

export default PostItem;

