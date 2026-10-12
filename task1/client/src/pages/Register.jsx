import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h1>Join the readership</h1>
      <p className="muted">Create an account to comment on stories.</p>
      <form onSubmit={onSubmit} className="form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn wide">
          Create account
        </button>
      </form>
      <p className="muted">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
