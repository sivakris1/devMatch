// src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';


function ProfilePage() {

  const { user: authUser, logout, updatedUser } = useAuth();
  // const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  //for editing the profile
  const [isEditing,setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');


  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const res = await api.get('/profile');
        setProfile(res.data.data);
        setFormData(res.data.data);
        updatedUser(res.data.data);

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


    // Save profile
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.put('/profile', formData);
      const updatedUser = res.data.data;

      setProfile(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(profile); // revert changes
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

  if (error && !profile) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  const user = profile || authUser;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h1>My Profile</h1>

      {/* Name & Email (view only) */}
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      {/* Experience */}
      {!isEditing ? (
        <p>
          <strong>Experience:</strong>{' '}
          {user?.experienceLevel || 'Not set'}
        </p>
      ) : (
        <>
          <label>Experience Level</label>
          <select
            value={formData.experienceLevel}
            onChange={(e) =>
              setFormData({ ...formData, experienceLevel: e.target.value })
            }
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </>
      )}

      {/* Location */}
      {!isEditing ? (
        <p>
          <strong>Location:</strong> {user?.location || 'Not set'}
        </p>
      ) : (
        <>
          <label>Location</label>
          <input
            value={formData.location || ''}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
        </>
      )}

      {/* Bio */}
      {!isEditing ? (
        <p>
          <strong>Bio:</strong> {user?.bio || 'Not set'}
        </p>
      ) : (
        <>
          <label>Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value }) 
            }
          />
        </>
      )}

      {/* Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Actions */}
      <div style={{ marginTop: 20 }}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <>
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </>
        )}
      </div>

      <button onClick={logout} style={{ marginTop: 30 }}>
        Logout
      </button>
    </div>
  );
}

export default ProfilePage;