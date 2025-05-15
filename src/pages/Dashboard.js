import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const Dashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    interests: [],
    goals: "",
    weeklyTime: 5,
    avatarUrl: ""
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${user._id}`).then((res) => {
      setProfile(res.data);
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5000/api/users/profile-setup/${user._id}`, form);
    window.location.reload();
  };

  if (!profile) return <p>Loading...</p>;

  // 👇 First-time setup form
  if (!profile.profileSetup) {
    return (
      <Container className="mt-4">
        <h3>Complete Your Profile</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Interests</Form.Label>
            <Form.Check type="checkbox" label="Web Development" onChange={e => toggleInterest("Web Development")} />
            <Form.Check type="checkbox" label="UI/UX" onChange={e => toggleInterest("UI/UX")} />
            <Form.Check type="checkbox" label="Data Science" onChange={e => toggleInterest("Data Science")} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Learning Goals</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Become a fullstack developer"
              value={form.goals}
              onChange={e => setForm({ ...form, goals: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Weekly Time Commitment (in hours)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={form.weeklyTime}
              onChange={e => setForm({ ...form, weeklyTime: e.target.value })}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Avatar URL (optional)</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://your-avatar.png"
              value={form.avatarUrl}
              onChange={e => setForm({ ...form, avatarUrl: e.target.value })}
            />
          </Form.Group>

          <Button type="submit" className="mt-3">Save & Continue</Button>
        </Form>
      </Container>
    );
  }

  // 👇 Normal learner dashboard view
  return (
    <Container className="mt-4">
      <h2>Welcome, {profile.name}</h2>
      <Alert variant="info">
        <strong>XP:</strong> {profile.xp} | <strong>Badges:</strong> {profile.badges?.join(", ") || "None"}
      </Alert>
      <p><strong>Interests:</strong> {profile.interests?.join(", ")}</p>
      <p><strong>Goal:</strong> {profile.goals}</p>
      <p><strong>Weekly Time:</strong> {profile.weeklyTime} hrs</p>

      {/* Other dashboard content */}
    </Container>
  );

  function toggleInterest(skill) {
    const already = form.interests.includes(skill);
    setForm({
      ...form,
      interests: already
        ? form.interests.filter(s => s !== skill)
        : [...form.interests, skill]
    });
  }
};

export default Dashboard;
