import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import api from '../../services/api';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState('');

  const load = () => {
    api.get('/api/admin/posts', { params: { q } }).then((res) => setPosts(res.data.posts));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this post and its comments?')) return;
    await api.delete(`/api/admin/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="admin-layout">
      <AdminNav />
      <section>
        <div className="row-between">
          <h1>Posts</h1>
          <Link to="/admin/posts/new" className="btn">
            New post
          </Link>
        </div>
        <form
          className="search-bar compact"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by title…" />
          <button type="submit" className="btn">
            Filter
          </button>
        </form>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td>
                    <Link to={`/posts/${p.slug}`}>{p.title}</Link>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.published ? 'Published' : 'Draft'}</td>
                  <td className="actions">
                    <Link to={`/admin/posts/${p._id}/edit`}>Edit</Link>
                    <button type="button" className="link-danger" onClick={() => remove(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
