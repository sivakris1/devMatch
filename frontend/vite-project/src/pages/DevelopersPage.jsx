import React from "react";
import { useEffect } from "react";
import api from "../api/client";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const DevelopersPage = () => {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [isSearching, setIsSearching] = useState(false);

  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [location, setLocation] = useState("");

  const searchDevelopers = async () => {
    setPage(1);
    setIsSearching(true);
    setLoading(true);

    const payload = {
      skills: skills ? skills.split(",").map((s) => s.trim()) : undefined,
      experienceLevel: experienceLevel || undefined,
      location: location || undefined,
    };

    const res = await api.post(`/developers/search?page=1&limit=5`, payload);

    setDevelopers(res.data.data.developers);
    setPagination(res.data.data.pagination);
    setLoading(false);
  };

  useEffect(() => {
    const fetchDevelopers = async () => {
      setLoading(true);

      const url = isSearching
        ? `/developers/search?page=${page}&limit=5`
        : `/developers/recommend?page=${page}&limit=5`;

      const method = isSearching ? api.post : api.get;
      const payload = isSearching
        ? {
            skills: skills ? skills.split(",").map((s) => s.trim()) : undefined,
            experienceLevel: experienceLevel || undefined,
            location: location || undefined,
          }
        : undefined;

      const res = isSearching ? await method(url, payload) : await method(url);

      setDevelopers(res.data.data.developers);
      setPagination(res.data.data.pagination);
      setLoading(false);
    };

    fetchDevelopers();
  }, [page, isSearching]);

  if (loading) return <p>Loading developers...</p>;

  return (
    <div>
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

      <button disabled={loading} onClick={searchDevelopers}>
        {loading ? "Searching..." : "Search"}
      </button>

      <h2>Recommended Developers</h2>

      {developers.length === 0 ? (
        <p>No recommendations found</p>
      ) : (
        developers.map((dev) => (
          <div
            key={dev._id}
            // style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: 10,
            }}
            onClick={() => {
              navigate(`/developers/${dev._id}`);
            }}
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
            <p>
              <b>Matched Skills:</b> {dev.skillOverlapCount}
            </p>
          </div>
        ))
      )}

      {pagination && (
        <div style={{ marginTop: 20 }}>
          <button
            disabled={!pagination.hasPrev}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span style={{ margin: "0 10px" }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            disabled={!pagination.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DevelopersPage;
