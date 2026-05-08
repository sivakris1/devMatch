// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../api/UiContext';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { loading, setLoading, setError } = useUi();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      login({ token, user });
      toast.success('Login Successful');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Background blobs */}
      <div className="gradient-blob-1" />
      <div className="gradient-blob-2" />
      <div className="gradient-blob-3" />

      {/* Card */}
      <div className="fade-in-up" style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>
            <span className="gradient-text">&lt;DevMatch /&gt;</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            Connect with developers who match your stack
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass-card" style={{ padding: '36px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 6px 0' }}>
            Welcome back 👋
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 28px 0' }}>
            Sign in to continue to DevMatch
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label className="dm-label">Email address</label>
              <input
                type="email"
                className="dm-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="dm-label">Password</label>
              <input
                type="password"
                className="dm-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              <span>{loading ? '⏳ Signing in...' : 'Sign In →'}</span>
            </button>
          </form>

          <div className="dm-divider" />

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
            New to DevMatch?{' '}
            <Link to="/register" style={{ color: '#a5b4fc', fontWeight: '600', textDecoration: 'none' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

