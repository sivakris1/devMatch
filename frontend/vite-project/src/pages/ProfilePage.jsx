import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔥 FETCH PROFILE ONCE
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/profile");
        const user = {
          ...res.data.data,
          skills: res.data.data.skills || [],
        };
        setProfile(user);
        setFormData(user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [logout]);

  // 🔥 SAVE PROFILE (ONLY BACKEND TRUTH)
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/profile", {
        skills: formData.skills,
        experienceLevel: formData.experienceLevel,
        bio: formData.bio,
        location: formData.location,
      });

      const fresh = await api.get("/profile");
      const user = {
        ...fresh.data.data,
        skills: fresh.data.data.skills || [],
      };

      setProfile(user);
      setFormData(user);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  const user = isEditing ? formData : profile;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>My Profile</h2>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Experience:</b> {user.experienceLevel}</p>
      <p><b>Location:</b> {user.location || "Not set"}</p>
      <p><b>Bio:</b> {user.bio || "Not set"}</p>

      {/* SKILLS */}
      {!isEditing ? (
        <p><b>Skills:</b> {user.skills.length ? user.skills.join(", ") : "No skills yet"}</p>
      ) : (
        <>
          <div>
            {formData.skills.map(s => (
              <span key={s} style={{ marginRight: 6 }}>{s}</span>
            ))}
          </div>

          <input
            value={newSkill}
            placeholder="Add skill"
            onChange={e => setNewSkill(e.target.value)}
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

      <div style={{ marginTop: 20 }}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <>
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => {
              setFormData(profile);
              setIsEditing(false);
            }}>
              Cancel
            </button>
          </>
        )}
      </div>

      <button style={{ marginTop: 30 }} onClick={logout}>Logout</button>
    </div>
  );
}
