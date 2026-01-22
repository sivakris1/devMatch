import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "./PageWrapper";


export default function ProfilePage() {
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");


  // FETCH PROFILE ONCE
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
  setError("Failed to load profile");
  logout();
}
finally {
        setLoading(false);
      }
    };
    load();
  }, [logout]);

  // REMOVE SKILL (UI ONLY)
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // SAVE TO DATABASE
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/profile", {
        skills: formData.skills, // ✅ CORRECT
        experienceLevel: formData.experienceLevel,
        bio: formData.bio,
        location: formData.location,
        github: formData.github,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
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

  {error && <p style={{ color: "red" }}>{error}</p>}


  const user = isEditing ? formData : profile;

  
return (
  <PageWrapper title="My Profile">
    
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>My Profile</h2>

      {/* Details of the User */}
      <p>
        <b>Name:</b> {user.name}
      </p>
      <p>
        <b>Email:</b> {user.email}
      </p>
      <p>
        <b>Experience:</b> {user.experienceLevel}
      </p>
      <p>
        <b>Location:</b> {user.location || "Not set"}
      </p>
      <p>
        <b>Bio:</b> {user.bio || "Not set"}
      </p>

      {/* Clickable Social Links from here */}
      <p>
        <b>Github:</b>{" "}
        {user.github ? (
          <a href={user.github} target="_blank" rel="noopener noreferrer">
            {user.github}
          </a>
        ) : (
          "Not set yet"
        )}
      </p>

      <p>
        <b>Linkedin:</b>{" "}
        {user.linkedin ? (
          <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
            {user.linkedin}
          </a>
        ) : (
          "Not set yet"
        )}
      </p>

      <p>
        <b>Portfolio:</b>{" "}
        {user.portfolio ? (
          <a href={user.portfolio} target="_blank" rel="noopener noreferrer">
            {user.portfolio}
          </a>
        ) : (
          "Not set yet"
        )}
      </p>

      {/* SKILLS */}
      {!isEditing ? (
        <p>
          <b>Skills:</b>{" "}
          {user.skills.length ? user.skills.join(", ") : "No skills yet"}
        </p>
      ) : (
        <>
          <div>
            {formData.skills.map((s) => (
              <span key={s} style={{ marginRight: 6 }}>
                {s} <button onClick={() => removeSkill(s)}>❌</button>
              </span>
            ))}
          </div>

          <input
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

      <div style={{ marginTop: 20 }}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <>
            <div>
              <input
                type="text"
                placeholder="Paste Github Link"
                value={formData.github || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    github: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Paste Linkedin Link"
                value={formData.linkedin || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    linkedin: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Paste Portfolio Link"
                value={formData.portfolio || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    portfolio: e.target.value,
                  })
                }
              />
            </div>

            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setFormData(profile);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <button style={{ marginTop: 30 }} onClick={logout}>
        Logout
      </button>
    </div>
  </PageWrapper>
);
}
