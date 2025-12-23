// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { logout, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Fetch profile ONCE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");

        const normalizedUser = {
          ...res.data.data,
          skills: res.data.data.skills || [],
        };

        setProfile(normalizedUser);
        setFormData(normalizedUser);
        updateUser(normalizedUser);
      } catch (err) {
        setError("Failed to load profile");
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout, updateUser]);

  // 🔹 Save profile
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    console.log("Saving formData.skills:", formData.skills);

    try {
      const res = await api.put("/profile", formData);

      const savedUser = {
        ...res.data.data,
        skills: res.data.data.skills || [],
      };

      setProfile(savedUser);
      setFormData(savedUser);
      updateUser(savedUser);

      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Cancel edit
  const handleCancel = () => {
    setFormData(profile); // restore LAST SAVED data
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const user = isEditing ? formData : profile;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>My Profile</h1>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Experience */}
      {!isEditing ? (
        <p><strong>Experience:</strong> {user.experienceLevel || "Not set"}</p>
      ) : (
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
      )}

      {/* Location */}
      {!isEditing ? (
        <p><strong>Location:</strong> {user.location || "Not set"}</p>
      ) : (
        <input
          value={formData.location || ""}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
      )}

      {/* Bio */}
      {!isEditing ? (
        <p><strong>Bio:</strong> {user.bio || "Not set"}</p>
      ) : (
        <textarea
          value={formData.bio || ""}
          onChange={(e) =>
            setFormData({ ...formData, bio: e.target.value })
          }
        />
      )}

      {/* Skills */}
      <div style={{ marginTop: 20 }}>
        {!isEditing ? (
          <p>
            <strong>Skills:</strong>{" "}
            {user.skills.length > 0 ? user.skills.join(", ") : "No skills yet"}
          </p>
        ) : (
          <>
            <div style={{ marginBottom: 10 }}>
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: "5px 10px",
                    background: "#eee",
                    marginRight: 5,
                    borderRadius: 4,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <input
              type="text"
              value={newSkill}
              placeholder="Add skill"
              onChange={(e) => setNewSkill(e.target.value)}
            />

            <button
            type="button"
              onClick={() => {
                const skill = newSkill.trim();
                if (!skill) return;
                if (formData.skills.includes(skill)) return;

                setFormData({
                  ...formData,
                  skills: [...formData.skills, skill],
                });

                setNewSkill("");
              }}
            >
              Add
            </button>
          </>
        )}
      </div>

      {/* Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Actions */}
      <div style={{ marginTop: 20 }}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        ) : (
          <>
            <button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
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
