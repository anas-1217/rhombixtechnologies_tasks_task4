import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/admin/stats').then((res) => setStats(res.data));
  }, []);

  return (
    <div className="admin-layout">
      <AdminNav />
      <section>
        <h1>Studio overview</h1>
        <p className="muted">Manage posts, readers, and the comment floor.</p>
        <div className="stat-grid">
          <div className="stat">
            <strong>{stats?.posts ?? '—'}</strong>
            <span>Posts</span>
          </div>
          <div className="stat">
            <strong>{stats?.published ?? '—'}</strong>
            <span>Published</span>
          </div>
          <div className="stat">
            <strong>{stats?.users ?? '—'}</strong>
            <span>Users</span>
          </div>
          <div className="stat">
            <strong>{stats?.comments ?? '—'}</strong>
            <span>Comments</span>
          </div>
        </div>
        <Link to="/admin/posts/new" className="btn">
          Write a post
        </Link>
      </section>
    </div>
  );
}
