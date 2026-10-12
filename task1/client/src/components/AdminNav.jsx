import { NavLink } from 'react-router-dom';

export default function AdminNav() {
  return (
    <aside className="admin-nav">
      <p className="admin-nav-label">Studio</p>
      <NavLink to="/admin" end>
        Overview
      </NavLink>
      <NavLink to="/admin/posts">Posts</NavLink>
      <NavLink to="/admin/posts/new">New post</NavLink>
      <NavLink to="/admin/comments">Comments</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
    </aside>
  );
}
