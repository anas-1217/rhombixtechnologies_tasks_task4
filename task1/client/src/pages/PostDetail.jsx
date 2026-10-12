import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { assetUrl } from '../services/api';

export default function PostDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/posts/${slug}`)
      .then((res) => {
        setPost(res.data.post);
        setComments(res.data.comments);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const submitComment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post(`/api/posts/${post._id}/comments`, { body });
      setComments((prev) => [data.comment, ...prev]);
      setBody('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not post comment');
    }
  };

  if (loading) return <p className="muted">Opening story…</p>;
  if (!post) return <p className="empty">This story could not be found.</p>;

  const date = new Date(post.createdAt).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="article">
      <p className="eyebrow">{post.category}</p>
      <h1>{post.title}</h1>
      <p className="article-meta">
        {post.author?.name || 'Editor'} · {date} · {post.views} views
      </p>
      {post.tags?.length > 0 && (
        <p className="tag-row">
          {post.tags.map((t) => (
            <Link key={t} to={`/?tag=${encodeURIComponent(t)}`} className="chip ghost">
              #{t}
            </Link>
          ))}
        </p>
      )}
      {post.coverImage && (
        <img className="cover" src={assetUrl(post.coverImage)} alt="" />
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

      <section className="comments" id="comments">
        <h2>Conversation</h2>
        {user ? (
          <form className="comment-form" onSubmit={submitComment}>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a thoughtful note…"
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">
              Publish comment
            </button>
          </form>
        ) : (
          <p className="muted">
            <Link to="/login">Log in</Link> or <Link to="/register">join</Link> to leave a comment.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="muted">No comments yet. Be the first voice.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((c) => (
              <li key={c._id}>
                <strong>{c.name}</strong>
                <span className="faint">
                  {' '}
                  · {new Date(c.createdAt).toLocaleString()}
                </span>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
