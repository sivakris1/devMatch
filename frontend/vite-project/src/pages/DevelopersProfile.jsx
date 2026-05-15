// src/pages/DevelopersProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useUi } from "../api/UiContext";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";


import ChatWindow from '../components/ChatWindow'

const avatarColors = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #3b82f6, #6366f1)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #10b981, #3b82f6)",
];

const getBadgeClass = (level) => {
  const map = {
    Beginner: "badge-beginner",
    Intermediate: "badge-intermediate",
    Advanced: "badge-advanced",
    Expert: "badge-expert",
  };
  return map[level] || "badge-beginner";
};

export default function DevelopersProfile() {
  const { id } = useParams();
  const { setLoading, setError } = useUi();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const { user } = useAuth()                        
  const [chatOpen, setChatOpen] = useState(false)  

  useEffect(() => {
    const fetchDeveloper = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/profile/${id}`);
        setDeveloper(res.data.data);
        setError("");
      } catch (err) {
        setError("Developer not found");
        navigate("/developers");
      } finally {
        setLoading(false);
      }
    };
    fetchDeveloper();
  }, [id]);

  if (!developer) return null;

  const initials = developer.name.charAt(0).toUpperCase();

  return (
    <div className="gradient-bg" style={{ minHeight: "100vh" }}>
      <div className="gradient-blob-1" />
      <div className="gradient-blob-2" />
      <Navbar />

      <div
        className="page-content"
        style={{ maxWidth: "760px", margin: "0 auto" }}
      >
        {/* Back Button */}
        <button
          className="btn-secondary fade-in-up"
          onClick={() => navigate("/developers")}
          style={{
            marginBottom: "24px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          ← Back to Developers
        </button>

        {/* Profile Card */}
        <div
          className="glass-card fade-in-up"
          style={{ padding: "36px", overflow: "hidden" }}
        >
          {/* Top gradient accent */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6)",
            }}
          />

          {/* Profile Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            <div
              className="avatar avatar-lg"
              style={{
                background:
                  avatarColors[
                    developer.name.charCodeAt(0) % avatarColors.length
                  ],
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: "800",
                  color: "#f1f5f9",
                  margin: "0 0 8px 0",
                }}
              >
                {developer.name}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  className={`badge ${getBadgeClass(developer.experienceLevel)}`}
                >
                  {developer.experienceLevel}
                </span>
                {developer.location && (
                  <span style={{ color: "#64748b", fontSize: "13px" }}>
                    📍 {developer.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* message developer */}
          <button
            className="btn-primary"
            onClick={() => setChatOpen(true)}
            style={{
              marginBottom: "20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>💬 Message {developer.name.split(" ")[0]}</span>
          </button>
          {chatOpen && (
            <ChatWindow
              currentUserId={user._id}
              receiverId={id}
              receiverName={developer.name}
              onClose={() => setChatOpen(false)}
            />
          )}
          <div className="dm-divider" />

          {/* Bio */}
          {developer.bio && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  color: "#94a3b8",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 10px 0",
                }}
              >
                About
              </h3>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  margin: 0,
                }}
              >
                {developer.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {developer.skills && developer.skills.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  color: "#94a3b8",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 12px 0",
                }}
              >
                Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {developer.skills.map((skill, i) => (
                  <span
                    key={skill}
                    className={`skill-tag ${i % 2 === 0 ? "skill-tag-primary" : "skill-tag-secondary"}`}
                    style={{ fontSize: "13px", padding: "6px 14px" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="dm-divider" />

          {/* Social Links */}
          <div>
            <h3
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                margin: "0 0 14px 0",
              }}
            >
              Links
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {developer.github && (
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <span>⚡</span> GitHub
                </a>
              )}
              {developer.linkedin && (
                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <span>💼</span> LinkedIn
                </a>
              )}
              {developer.portfolio && (
                <a
                  href={developer.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="social-link"
                >
                  <span>🌐</span> Portfolio
                </a>
              )}
              {!developer.github &&
                !developer.linkedin &&
                !developer.portfolio && (
                  <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
                    No links added yet
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
