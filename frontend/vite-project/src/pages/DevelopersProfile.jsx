import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const DevelopersProfile = () => {
  const { id } = useParams();
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        const res = await api.get(`/profile/${id}`);
        setDeveloper(res.data.data);
      } catch (err) {
        console.error("Failed to load developer profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id]);

  if (loading) return <p>Loading developer...</p>;
  if (!developer) return <p>Developer not found</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>{developer.name}</h2>

      <p><b>Experience:</b> {developer.experienceLevel}</p>
      <p><b>Location:</b> {developer.location || "Not set"}</p>
      <p><b>Bio:</b> {developer.bio || "Not set"}</p>

      <p>
        <b>Skills:</b>{" "}
        {developer.skills?.length
          ? developer.skills.join(", ")
          : "No skills"}
      </p>
    </div>
  );
};

export default DevelopersProfile;
