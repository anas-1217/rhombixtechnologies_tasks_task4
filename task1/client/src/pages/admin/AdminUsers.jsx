import { useEffect, useState } from 'react';
import AdminNav from '../../components/AdminNav';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);

  const load = () => api.get('/api/admin/users').then((res) => setUsers(res.data.users));

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id, role) => {
    await api.patch(`/api/admin/users/${id}`, { role });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/api/admin/users/${id}`);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div className="admin-layout">
      <AdminNav />
      <section>
        <h1>Users</h1>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => setRole(u._id, e.target.value)}
                      disabled={u._id === me?.id}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="link-danger"
                      disabled={u._id === me?.id}
                      onClick={() => remove(u._id)}
                    >
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
