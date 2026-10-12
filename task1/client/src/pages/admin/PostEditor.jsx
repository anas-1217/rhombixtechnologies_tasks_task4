import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import RichEditor from '../../components/RichEditor';
import api, { API_URL, assetUrl } from '../../services/api';

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/posts/meta/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/admin/posts/${id}`).then((res) => {
      const p = res.data.post;
      setTitle(p.title);
      setExcerpt(p.excerpt || '');
      setContent(p.content);
      setCategory(p.category);
      setTags((p.tags || []).join(', '));
      setCoverImage(p.coverImage || '');
      setPublished(p.published);
    });
  }, [id]);

  const uploadCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('image', file);
    const { data } = await api.post('/api/admin/upload', form);
    setCoverImage(data.url);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { title, excerpt, content, category, tags, coverImage, published };
    try {
      if (id) await api.put(`/api/admin/posts/${id}`, payload);
      else await api.post('/api/admin/posts', payload);
      navigate('/admin/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminNav />
      <section>
        <h1>{id ? 'Edit post' : 'New post'}</h1>
        <form className="form editor-form" onSubmit={onSubmit}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Excerpt
            <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          </label>
          <div className="form-row">
            <label>
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Tags (comma separated)
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="mern, design" />
            </label>
          </div>
          <label>
            Cover image
            <input type="file" accept="image/*" onChange={uploadCover} />
          </label>
          {coverImage && (
            <img className="cover-preview" src={assetUrl(coverImage)} alt="Cover preview" />
          )}
          <label>Body</label>
          <RichEditor value={content} onChange={setContent} />
          <label className="check">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving…' : 'Save post'}
          </button>
        </form>
        <p className="hint">Images upload to {API_URL}/uploads</p>
      </section>
    </div>
  );
}
