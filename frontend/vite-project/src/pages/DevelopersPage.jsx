import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { useUi } from "../api/UiContext";



const DevelopersPage = () => {
  const navigate = useNavigate();
  const {loading,setLoading,setError} = useUi();

  const [developers, setDevelopers] = useState([]);

  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");


  // 🔹 Fetch recommended developers
  useEffect(() => {
    const fetchDevelopers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/developers/recommend");
        setDevelopers(res.data.data.developers);
        setError("");
      } catch (err) {
        console.error("Failed to fetch developers", err);
        setError("Failed to load developers");
        setDevelopers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // 🔹 Search developers
  const searchDevelopers = async () => {
    setLoading(true);

    try {
      const payload = {
        skills: skills ? skills.split(",").map((s) => s.trim()) : undefined,
        experienceLevel: experienceLevel || undefined,
        location: location || undefined,
      };

      const res = await api.post("/developers/search", payload);
      setDevelopers(res.data.data.developers);
    } catch (err) {
      console.error("Search developers failed", err);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <p>Loading developers...</p>;

  return (
    <div>
      <h2>Find Developers</h2>

      {/* Filters */}
      <input
        placeholder="Skills (comma separated)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />

      <select
        value={experienceLevel}
        onChange={(e) => setExperienceLevel(e.target.value)}
      >
        <option value="">Any level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Expert">Expert</option>
      </select>

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={searchDevelopers}>Search</button>

      {/* {!loading && developers.length === 0 && !error && (
        <p>No developers found. Try changing filters.</p>
      )} */}

      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

      {/* Results */}
      {developers.length === 0 ? (
        <p>No developers found</p>
      ) : (
        developers.map((dev) => (
          <div
            key={dev._id}
            style={{
              border: "1px solid #ccc",
              margin: 10,
              padding: 10,
              cursor: "pointer",
            }}
            onClick={() => navigate(`/developers/${dev._id}`)}
          >
            <p>
              <b>Name:</b> {dev.name}
            </p>
            <p>
              <b>Experience:</b> {dev.experienceLevel}
            </p>
            <p>
              <b>Skills:</b> {dev.skills.join(", ")}
            </p>
            {dev.skillOverlapCount !== undefined && (
              <p>
                <b>Matched Skills:</b> {dev.skillOverlapCount}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DevelopersPage;
