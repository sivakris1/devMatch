import { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useUi } from '../api/UiContext';
import Navbar from '../components/Navbar';
import SkillInput from '../components/SkillInput';
import { useAuth } from '../context/AuthContext';


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
  const { onlineUsers, user } = useAuth();

  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'ai'
  const [aiLoading, setAiLoading] = useState(false)
  const [skills, setSkills] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');

  // Fetch normal recommendations
  useEffect(() => {
    const fetchDevelopers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/developers/recommend');
        setDevelopers(res.data.data.developers);
        setError('');
      } catch (err) {
        setError('Failed to load developers');
        setDevelopers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  // Fetch AI recommendations
  const fetchAiRecommendations = async () => {
    setAiLoading(true)
    try {
      const res = await api.get('/ai/recommend')
      setAiRecommendations(res.data.data)
    } catch (err) {
      console.error('AI recommend failed:', err)
    } finally {
      setAiLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'ai' && aiRecommendations.length === 0) {
      fetchAiRecommendations()
    }
  }

  const searchDevelopers = async () => {
    setLoading(true);
    try {
      const payload = {
        skills:  skills.length > 0 ? skills : undefined ,
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
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <h1 className="section-title">Find Developers</h1>
          <p className="section-subtitle">Connect with developers who match your stack</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          <button
            onClick={() => handleTabChange('discover')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              background: activeTab === 'discover'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'rgba(255,255,255,0.05)',
              color: activeTab === 'discover' ? 'white' : '#64748b',
              border: activeTab === 'discover'
                ? 'none'
                : '1px solid rgba(255,255,255,0.08)'
            }}
          >
            🔍 Discover
          </button>
          <button
            onClick={() => handleTabChange('ai')}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              background: activeTab === 'ai'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'rgba(255,255,255,0.05)',
              color: activeTab === 'ai' ? 'white' : '#64748b',
              border: activeTab === 'ai'
                ? 'none'
                : '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🤖 AI Match
          </button>
        </div>

        {/* DISCOVER TAB */}
        {activeTab === 'discover' && (
          <>
            {/* Search Filters */}
                        {/* Search Filters */}
            <div className="glass-card fade-in-up" style={{ 
              padding: '24px', 
              marginBottom: '28px',
              position: 'relative', // Enables proper z-index stacking
              zIndex: 10            // Floats suggestions OVER the developer cards list below
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                
                {/* 1. Skills Autocomplete */}
                <div style={{ position: 'relative' }}>
                  <label className="dm-label" style={{ marginBottom: '8px', display: 'block' }}>🛠 Skills</label>

                  <SkillInput  skills={skills} 
                  setSkills={setSkills}    />
                  
                </div>

                {/* 2. Experience level */}
                <div>
                  <label className="dm-label" style={{ marginBottom: '8px', display: 'block' }}>📊 Experience</label>
                  <select className="dm-select" value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}>
                    <option value="">Any level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                
                {/* 3. Location */}
                <div>
                  <label className="dm-label" style={{ marginBottom: '8px', display: 'block' }}>📍 Location</label>
                  <input className="dm-input" placeholder="City, Country..." value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchDevelopers()} />
                </div>
                
                {/* 4. Search Button */}
                <button className="btn-primary" onClick={searchDevelopers} disabled={loading}>
                  <span>Search</span>
                </button>
              </div>
            </div>


            {/* Developer Cards */}
            {developers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No developers found</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Try updating your profile skills</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                {developers.map((dev, index) => (
                  <div key={dev._id} className="glass-card fade-in-up"
                    style={{ padding: '24px', cursor: 'pointer', animationDelay: `${index * 0.05}s`, opacity: 0 }}
                    onClick={() => navigate(`/developers/${dev._id}`)}>
                    
                    {/* Header Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                      {dev.avatar ? (
                        <img 
                          src={dev.avatar} 
                          alt={dev.name} 
                          className="avatar" 
                          style={{ objectFit: 'cover' }} 
                        />
                      ) : (
                        <div className="avatar" style={{ background: avatarColors[index % avatarColors.length] }}>
                          {dev.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '16px', margin: 0 }}>{dev.name}</h3>
                          {onlineUsers.includes(dev._id) && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              background: '#10b981',
                              borderRadius: '50%',
                              boxShadow: '0 0 8px #10b981',
                              display: 'inline-block'
                            }} title="Online" />
                          )}
                        </div>
                        <span className={`badge ${getBadgeClass(dev.experienceLevel)}`}>{dev.experienceLevel}</span>
                      </div>

                      {dev.skillOverlapCount > 0 && (
                        <div className="match-badge">✨ {dev.skillOverlapCount}</div>
                      )}
                    </div>

                    {/* Card Body */}
                    {dev.location && <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 14px 0' }}>📍 {dev.location}</p>}
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {dev.skills.slice(0, 5).map((skill, i) => (
                        <span key={skill} className={`skill-tag ${i % 2 === 0 ? 'skill-tag-primary' : 'skill-tag-secondary'}`}>{skill}</span>
                      ))}
                      {dev.skills.length > 5 && (
                        <span className="skill-tag" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}>
                          +{dev.skills.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
                      <span style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: '600' }}>View Profile →</span>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </>
        )}

        {/* AI MATCH TAB */}
        {activeTab === 'ai' && (
          <>
            {!user?.isPremium ?
             (
              // Show this box if user is a free member
              <div className="glass-card" style={{ 
                padding: '48px 24px', 
                textAlign: 'center', 
                maxWidth: '550px', 
                margin: '40px auto',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.1)'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>👑</div>
                <h2 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
                  DevMatch <span style={{ color: '#fcd34d' }}>Premium</span> Feature
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginBottom: '28px' }}>
                  Unlock AI Matching to let Gemini analyze your stack, bio, and experience level, and recommend the best rank-ordered developers for you!
                </p>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/premium')}
                  style={{
                    padding: '12px 32px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '15px',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
                  }}
                >
                  Unlock AI Matches Now
                </button>
              </div>
            ): aiLoading ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }}>🤖</div>
                <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                  AI is analyzing profiles...
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Gemini is finding your best matches</p>
              </div>
            ) : aiRecommendations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No AI matches yet</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Make sure your profile has skills and bio filled in</p>
                <button className="btn-primary" onClick={fetchAiRecommendations}>
                  <span>🤖 Try Again</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {aiRecommendations.map((rec, index) => (
                  <div key={rec.developerId} className="glass-card fade-in-up"
                    style={{ padding: '24px', cursor: 'pointer', display: 'flex', gap: '20px', alignItems: 'flex-start', animationDelay: `${index * 0.1}s`, opacity: 0 }}
                    onClick={() => navigate(`/developers/${rec.developerId}`)}>

                    {/* Rank */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                        : index === 1 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: '700', color: 'white'
                    }}>
                      #{index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="avatar" style={{ background: avatarColors[index % avatarColors.length], flexShrink: 0 }}>
                      {rec.developer?.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '17px', margin: 0 }}>
                          {rec.developer?.name}
                        </h3>
                        <span className={`badge ${getBadgeClass(rec.developer?.experienceLevel)}`}>
                          {rec.developer?.experienceLevel}
                        </span>
                      </div>

                      {/* AI Reason */}
                      <div style={{
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: '10px', padding: '12px 14px', marginBottom: '12px'
                      }}>
                        <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px 0' }}>
                          🤖 AI Analysis
                        </p>
                        <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                          {rec.reason}
                        </p>
                      </div>

                      {/* Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {rec.developer?.skills?.slice(0, 5).map((skill, i) => (
                          <span key={skill} className={`skill-tag ${i % 2 === 0 ? 'skill-tag-primary' : 'skill-tag-secondary'}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: `conic-gradient(#6366f1 ${rec.matchScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: '#0d0e21',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '13px', fontWeight: '700', color: '#a5b4fc'
                        }}>
                          {rec.matchScore}%
                        </div>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '11px', margin: '6px 0 0 0' }}>Match</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DevelopersPage;
