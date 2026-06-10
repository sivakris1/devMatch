// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../api/client';


export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

    const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/chat/unread-count')
        setUnreadCount(res.data.count)
      } catch {}
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 10000) // check every 10 seconds
    return () => clearInterval(interval)
  }, [])


  return (
    <nav className="navbar">
      <Link to="/developers" className="nav-logo">
        &lt;DevMatch /&gt;
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Link
          to="/developers"
          className={`nav-link ${isActive('/developers') ? 'active' : ''}`}
        >
          🔍 Discover
        </Link>

                {!user?.isPremium && (
          <Link
            to="/premium"
            className={`nav-link ${isActive('/premium') ? 'active' : ''}`}
            style={{ 
              color: '#fcd34d', // Gold yellow color
              fontWeight: '700',
              textShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
            }}
          >
            Upgrade 👑
          </Link>
        )}

                <Link
          to="/messages"
          className={`nav-link ${isActive('/messages') ? 'active' : ''}`}
          style={{ position: 'relative' }}
        >
          💬 Messages
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#ef4444',
              color: 'white',
              fontSize: '10px',
              fontWeight: '700',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

                <Link
          to="/profile"
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
        >
          👤 Profile {user?.isPremium && <span style={{ color: '#fcd34d', marginLeft: '4px' }}>👑</span>}
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#fca5a5',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(239, 68, 68, 0.2)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

