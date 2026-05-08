// src/pages/DevelopersPage.jsx
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useUi } from '../api/UiContext';
import Navbar from '../components/Navbar';

const avatarColors = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #10b981, #3b82f6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #06b6d4, #8b5cf6)',
];

const getBadgeClass = (level) => {
  const map = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
    Expert: 'badge-expert',
  };
  return map[level] || 'badge-beginner';
};

const DevelopersPage = () => {
  const navigate = useNavigate();
  const { loading, setLoading, setError } = useUi();
  const [developers, setDevelopers] = useState([]);
  const [skills, setSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchDevelopers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/developers/recommend');
        setDevelopers(res.data.data.developers);
        setError('');
      } catch (err) {
        console.error('Failed to fetch developers', err);
        setError('Failed to load developers');
        setDevelopers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  const searchDevelopers = async () => {
    setLoading(true);
    try {
      const payload = {
        skills: skills ? skills.split(',').map((s) => s.trim()) : undefined,
        experienceLevel: experienceLevel || undefined,
        location: location || undefined,
      };
      const res = await api.post('/developers/search', payload);
      setDevelopers(res.data.data.developers);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }}>
      <div className="gradient-blob-1" />
      <div className="gradient-blob-2" />
      <Navbar />

      <div className="page-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="fade-in-up" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">Discover Developers</h1>
          <p className="section-subtitle">Find your perfect collaboration partner</p>
        </div>

        {/* Search Filters */}
        <div className="glass-card fade-in-up fade-in-up-delay-1" style={{ padding: '24px', marginBottom: '32px', borderRadius: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
            <div>
              <label className="dm-label">🛠 Skills</label>
              <input
                className="dm-input"
                placeholder="React, Node.js, Python..."
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDevelopers()}
              />
            </div>
            <div>
              <label className="dm-label">📊 Experience</label>
              <select
                className="dm-select"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="">Any level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="dm-label">📍 Location</label>
              <input
                className="dm-input"
                placeholder="City, Country..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchDevelopers()}
              />
            </div>
            <button className="btn-primary" onClick={searchDevelopers} disabled={loading}>
              <span>🔍 Search</span>
            </button>
          </div>
        </div>

        {/* Results count */}
        {developers.length > 0 && (
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
            Showing <span style={{ color: '#a5b4fc', fontWeight: '600' }}>{developers.length}</span> developers
          </p>
        )}

        {/* Developer Cards Grid */}
        {developers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              No developers found
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              Try updating your profile skills or changing search filters
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {developers.map((dev, index) => (
              <div
                key={dev._id}
                className="glass-card fade-in-up"
                style={{
                  padding: '24px',
                  cursor: 'pointer',
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0,
                }}
                onClick={() => navigate(`/developers/${dev._id}`)}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div
                    className="avatar"
                    style={{ background: avatarColors[index % avatarColors.length] }}
                  >
                    {dev.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {dev.name}
                    </h3>
                    <span className={`badge ${getBadgeClass(dev.experienceLevel)}`}>
                      {dev.experienceLevel}
                    </span>
                  </div>
                  {dev.skillOverlapCount > 0 && (
                    <div className="match-badge">
                      ✨ {dev.skillOverlapCount}
                    </div>
                  )}
                </div>

                {/* Location */}
                {dev.location && (
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 14px 0' }}>
                    📍 {dev.location}
                  </p>
                )}

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {dev.skills.slice(0, 5).map((skill, i) => (
                    <span key={skill} className={`skill-tag ${i % 2 === 0 ? 'skill-tag-primary' : 'skill-tag-secondary'}`}>
                      {skill}
                    </span>
                  ))}
                  {dev.skills.length > 5 && (
                    <span className="skill-tag" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
                      +{dev.skills.length - 5}
                    </span>
                  )}
                </div>

                {/* View Profile */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: '600' }}>
                    View Profile →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DevelopersPage;

