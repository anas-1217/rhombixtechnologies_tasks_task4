import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import AdminPosts from './pages/admin/AdminPosts';
import PostEditor from './pages/admin/PostEditor';
import AdminUsers from './pages/admin/AdminUsers';
import AdminComments from './pages/admin/AdminComments';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <AdminRoute>
              <AdminPosts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/posts/new"
          element={
            <AdminRoute>
              <PostEditor />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/posts/:id/edit"
          element={
            <AdminRoute>
              <PostEditor />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/comments"
          element={
            <AdminRoute>
              <AdminComments />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
