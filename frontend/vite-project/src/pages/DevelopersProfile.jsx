import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useUi } from "../api/UiContext";



export default function DevelopersProfile() {
  const { id } = useParams();
  const {setLoading,setError} = useUi();

  const [developer, setDeveloper] = useState(null);

  useEffect(() => {
    
    const fetchDeveloper = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/profile/${id}`);
        setDeveloper(res.data.data);
        setError("");
      } catch (err) {
        setError("Developer not found");
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  if(!developer){
    return null;
  }

  // if (loading) return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  // if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8 }}>
        <h2>{developer.name}</h2>

        <p>
          <b>Experience:</b> {developer.experienceLevel}
        </p>

        {developer.location && (
          <p>
            <b>Location:</b> {developer.location}
          </p>
        )}

        {/* Skills */}
        <div style={{ marginTop: 16 }}>
          <b>Skills:</b>
          <div style={{ marginTop: 8 }}>
            {developer.skills && developer.skills.length > 0 ? (
              developer.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    margin: "4px",
                    background: "#f1f1f1",
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                >
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills added</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {developer.bio && (
          <div style={{ marginTop: 16 }}>
            <b>Bio:</b>
            <p>{developer.bio}</p>
          </div>
        )}

        {/* Links */}
        <div style={{ marginTop: 16 }}>
          {developer.github && (
            <p>
              🔗{" "}
              <a href={developer.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </p>
          )}
          {developer.linkedin && (
            <p>
              🔗{" "}
              <a href={developer.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          )}
          {developer.portfolio && (
            <p>
              🔗{" "}
              <a href={developer.portfolio} target="_blank" rel="noreferrer">
                Portfolio
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
