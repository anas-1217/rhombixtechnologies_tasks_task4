import { Link } from 'react-router-dom';
import { assetUrl } from '../services/api';

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="post-card">
      {post.coverImage ? (
        <Link to={`/posts/${post.slug}`} className="post-card-media">
          <img src={assetUrl(post.coverImage)} alt="" />
        </Link>
      ) : (
        <Link to={`/posts/${post.slug}`} className="post-card-media placeholder">
          <span>{post.category}</span>
        </Link>
      )}
      <div className="post-card-body">
        <p className="meta">
          <span className="pill">{post.category}</span>
          <span>{date}</span>
        </p>
        <h2>
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="excerpt">{post.excerpt || 'Open the story to read more.'}</p>
        <p className="meta faint">
          {post.author?.name || 'Editor'} · {post.views || 0} views
        </p>
      </div>
    </article>
  );
}
