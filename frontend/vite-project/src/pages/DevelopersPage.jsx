import React from "react";
import { useEffect } from "react";
import api from "../api/client";
import { useState } from "react";

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [skills,setSkills] = useState("");
  const [experienceLevel,setExperienceLevel] = useState("");
  const [location,setLocation] = useState("");

  const searchDevelopers = async() => {
      try {

        const payload = {
          skills : skills?skills.split(",").map(s => s.trim()) :  undefined,
          experienceLevel: experienceLevel || undefined,
          location: location || undefined,
        }
        const res = await api.post('/developers/search',payload);
        setDevelopers(res.data.data.developers);
        console.log(res)

      } catch (err) {
        console.error("Failed to fetch developers", err);
      } finally {
        setLoading(false);
      }
    }

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

<button onClick={()=>searchDevelopers()}>Search</button>


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