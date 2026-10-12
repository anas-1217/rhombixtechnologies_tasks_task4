import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import api from '../services/api';

export default function Home() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState(params.get('tag') || '');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/posts/meta/categories').then((res) => setCategories(res.data.categories));
    api.get('/api/posts/meta/tags').then((res) => setTags(res.data.tags));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/api/posts', { params: { q, category, tag, page, limit: 9 } })
      .then((res) => {
        setPosts(res.data.posts);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .finally(() => setLoading(false));
  }, [q, category, tag, page]);

  const submitSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQ(search.trim());
  };

  return (
    <div>
      <section className="hero">
        <p className="eyebrow">A living magazine</p>
        <h1>Stories worth sitting with.</h1>
        <p className="lede">
          Read, search, and leave a mark. Editors keep the archive honest from the studio.
        </p>
        <form className="search-bar" onSubmit={submitSearch}>
          <input
            type="search"
            placeholder="Search titles, tags, or passages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn">
            Search
          </button>
        </form>
      </section>

      <div className="filters">
        <button
          type="button"
          className={!category ? 'chip active' : 'chip'}
          onClick={() => {
            setCategory('');
            setPage(1);
          }}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={category === c ? 'chip active' : 'chip'}
            onClick={() => {
              setCategory(c);
              setPage(1);
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="filters tags">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={tag === t ? 'chip ghost active' : 'chip ghost'}
              onClick={() => {
                setTag(tag === t ? '' : t);
                setPage(1);
              }}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      <p className="muted count">{total} {total === 1 ? 'story' : 'stories'}</p>

      {loading ? (
        <p className="muted">Loading stories…</p>
      ) : posts.length === 0 ? (
        <p className="empty">No stories match that filter yet.</p>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="pager">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            {page} / {pages}
          </span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
