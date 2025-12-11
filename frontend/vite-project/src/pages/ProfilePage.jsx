// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // token will be auto-attached by axios interceptor
        const res = await api.get('/profile');
        setProfile(res.data.data); // backend sends { success, data: user }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load profile');
        if (err.response?.status === 401) {
          // token invalid/expired → force logout
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout]);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  if (error)
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );

  const user = profile || authUser;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>My Profile</h1>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Experience:</strong> {user?.experienceLevel || 'Not set'}</p>
      <p><strong>Location:</strong> {user?.location || 'Not set'}</p>

      <p><strong>Skills:</strong> {(user?.skills || []).join(', ') || 'No skills yet'}</p>

      <button onClick={logout} style={{ marginTop: 20 }}>
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;
