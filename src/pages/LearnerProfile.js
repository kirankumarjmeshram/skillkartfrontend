import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container } from "react-bootstrap";

const LearnerProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <Card className="p-3">
        <h3>{profile.name}</h3>
        <p>Email: {profile.email}</p>
        <p>Role: Learner</p>
        <p>Total XP: {profile.xp || 0}</p>
        <p>Badges: {profile.badges?.join(", ") || "None"}</p>
      </Card>
    </Container>
  );
};

export default LearnerProfile;