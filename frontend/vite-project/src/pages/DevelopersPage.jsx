import React from "react";
import { useEffect } from "react";
import api from "../api/client";
import { useState } from "react";

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await api.get("/developers/recommend");
        setDevelopers(res.data.data.developers);
      } catch (err) {
        console.error("Failed to fetch developers", err);
      } finally {
        setLoading(false);
      }

    };

    fetchDevelopers();
  }, []);

    if (loading) return <p>Loading developers...</p>;

  return (
    <div>
      <h2>Recommended Developers</h2>

      {developers.length === 0 ? (
        <p>No recommendations found</p>
      ) : (
        developers.map((dev) => (
          <div key={dev._id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
            <p><b>Name:</b> {dev.name}</p>
            <p><b>Experience:</b> {dev.experienceLevel}</p>
            <p><b>Skills:</b> {dev.skills.join(", ")}</p>
            <p><b>Matched Skills:</b> {dev.skillOverlapCount}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default DevelopersPage;