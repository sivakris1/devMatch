// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useUi } from '../api/UiContext';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const avatarColors = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
];

export default function ProfilePage() {
  const { logout } = useAuth();
  const { setLoading, setError } = useUi();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/profile');
        const user = { ...res.data.data, skills: res.data.data.skills || [] };
        setProfile(user);
        setFormData(user);
      } catch {
        setError('Failed to load profile');
        logout();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [logout]);

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/profile', {
        skills: formData.skills,
        experienceLevel: formData.experienceLevel,
        bio: formData.bio,
        location: formData.location,
        github: formData.github,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
      });
      const fresh = await api.get('/profile');
      const user = { ...fresh.data.data, skills: fresh.data.data.skills || [] };
      setProfile(user);
      setFormData(user);
      setIsEditing(false);
      toast.success('Profile saved!');
    } finally {
      setSaving(false);
    }
  };

  if (!profile || !formData) return null;

  const user = isEditing ? formData : profile;
  const initials = profile.name.charAt(0).toUpperCase();

  return (
    <div className="gradient-bg" style={{ minHeight: '100vh' }}>
      <div className="gradient-blob-1" />
      <div className="gradient-blob-2" />
      <Navbar />

      <div className="page-content" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 className="section-title fade-in-up">My Profile</h1>
        <p className="section-subtitle fade-in-up">Manage your developer identity</p>

        {/* Profile Card */}
        <div className="glass-card fade-in-up" style={{ padding: '36px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
          {/* Top accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6)' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            <div className="avatar avatar-lg" style={{ background: avatarColors[profile.name.charCodeAt(0) % avatarColors.length] }}>
              {initials}
            </div>
            <div>
              <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>{profile.name}</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{profile.email}</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {!isEditing ? (
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  <span>✏️ Edit Profile</span>
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    <span>{saving ? '⏳ Saving...' : '💾 Save'}</span>
                  </button>
                  <button className="btn-secondary" onClick={() => { setFormData(profile); setIsEditing(false); }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="dm-divider" />

          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label className="dm-label">📊 Experience Level</label>
              {isEditing ? (
                <select className="dm-select" value={formData.experienceLevel} onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              ) : (
                <p style={{ color: '#f1f5f9', fontSize: '15px', margin: '4px 0 0 0' }}>{user.experienceLevel || '—'}</p>
              )}
            </div>
            <div>
              <label className="dm-label">📍 Location</label>
              {isEditing ? (
                <input className="dm-input" placeholder="City, Country" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              ) : (
                <p style={{ color: '#f1f5f9', fontSize: '15px', margin: '4px 0 0 0' }}>{user.location || 'Not set'}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div style={{ marginBottom: '24px' }}>
            <label className="dm-label">📝 Bio</label>
            {isEditing ? (
              <textarea
                className="dm-input"
                placeholder="Tell other developers about yourself..."
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            ) : (
              <p style={{ color: user.bio ? '#cbd5e1' : '#475569', fontSize: '14px', margin: '4px 0 0 0', lineHeight: '1.6' }}>
                {user.bio || 'No bio added yet'}
              </p>
            )}
          </div>

          <div className="dm-divider" />

          {/* Skills */}
          <div style={{ marginBottom: '24px' }}>
            <label className="dm-label">🛠 Skills</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {user.skills.length > 0 ? (
                user.skills.map((s, i) => (
                  isEditing ? (
                    <span key={s} className="skill-tag skill-tag-remove" onClick={() => removeSkill(s)}>
                      {s} <span style={{ fontSize: '10px' }}>✕</span>
                    </span>
                  ) : (
                    <span key={s} className={`skill-tag ${i % 2 === 0 ? 'skill-tag-primary' : 'skill-tag-secondary'}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
                      {s}
                    </span>
                  )
                ))
              ) : (
                <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>No skills added yet</p>
              )}
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <input
                  className="dm-input"
                  placeholder="Add a skill (e.g. React)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const skill = newSkill.trim();
                      if (!skill || formData.skills.includes(skill)) return;
                      setFormData({ ...formData, skills: [...formData.skills, skill] });
                      setNewSkill('');
                    }
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  className="btn-primary"
                  onClick={() => {
                    const skill = newSkill.trim();
                    if (!skill || formData.skills.includes(skill)) return;
                    setFormData({ ...formData, skills: [...formData.skills, skill] });
                    setNewSkill('');
                  }}
                >
                  <span>+ Add</span>
                </button>
              </div>
            )}
          </div>

          <div className="dm-divider" />

          {/* Social Links */}
          <div>
            <label className="dm-label">🔗 Social Links</label>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <input className="dm-input" placeholder="⚡ GitHub URL" value={formData.github || ''} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                <input className="dm-input" placeholder="💼 LinkedIn URL" value={formData.linkedin || ''} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                <input className="dm-input" placeholder="🌐 Portfolio URL" value={formData.portfolio || ''} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="social-link">⚡ GitHub</a>}
                {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="social-link">💼 LinkedIn</a>}
                {user.portfolio && <a href={user.portfolio} target="_blank" rel="noreferrer" className="social-link">🌐 Portfolio</a>}
                {!user.github && !user.linkedin && !user.portfolio && (
                  <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>No links added yet. Click Edit to add.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

