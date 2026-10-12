import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import api from '../../services/api';

export default function AdminComments() {
  const [comments, setComments] = useState([]);

  const load = () => api.get('/api/admin/comments').then((res) => setComments(res.data.comments));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/api/admin/comments/${id}`, { status });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    await api.delete(`/api/admin/comments/${id}`);
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="admin-layout">
      <AdminNav />
      <section>
        <h1>Comments</h1>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Author</th>
                <th>Post</th>
                <th>Comment</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {comments.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>
                    {c.post ? <Link to={`/posts/${c.post.slug}`}>{c.post.title}</Link> : '—'}
                  </td>
                  <td>{c.body}</td>
                  <td>
                    <select value={c.status} onChange={(e) => setStatus(c._id, e.target.value)}>
                      <option value="approved">approved</option>
                      <option value="pending">pending</option>
                      <option value="hidden">hidden</option>
                    </select>
                  </td>
                  <td>
                    <button type="button" className="link-danger" onClick={() => remove(c._id)}>
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
