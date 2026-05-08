// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import api from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { useUi } from '../api/UiContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loading, setLoading, setError } = useUi();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message);
      toast.error(err.response?.data?.message || 'Registration failed');
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
            Join DevMatch 🚀
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 28px 0' }}>
            Create your developer profile and start connecting
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label className="dm-label">Full Name</label>
              <input
                type="text"
                className="dm-input"
                placeholder="Siva Krishna"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              <span>{loading ? '⏳ Creating account...' : 'Create Account →'}</span>
            </button>
          </form>

          <div className="dm-divider" />

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a5b4fc', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

