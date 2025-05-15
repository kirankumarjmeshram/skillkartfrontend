import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// JWT decode helper (no library needed)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const ProfileSetup = () => {
  const navigate = useNavigate();

  // Get userId from token (NOT from userInfo)
  const token = localStorage.getItem("token");
  const decodedToken = token ? parseJwt(token) : null;
  const userId = decodedToken?.userId || decodedToken?._id;

  const interestOptions = [
    "Web Development",
    "UI/UX Design",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "DevOps",
    "Mobile Development",
    "Cloud Computing",
    "Digital Marketing",
  ];

  const skillOptions = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "MS Office",
    "Excel",
    "Machine Learning",
    "Artificial Intelligence",
    "Python",
    "SQL",
    "DevOps",
  ];

  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState("");
  const [weeklyTime, setWeeklyTime] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInterestChange = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSkillsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setSkills(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        interests,
        goals,
        weeklyTime: Number(weeklyTime),
        avatarUrl,
        skills,
        name,
      };

      await axios.put(
        `http://localhost:5000/api/users/profile-setup/${userId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to dashboard after successful profile setup
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to setup profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Set Up Your Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Your Name (optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="avatarUrl">
          <Form.Label>Avatar URL (optional)</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Your Interests / Skill Areas</Form.Label>
          <div>
            {interestOptions.map((interest) => (
              <Form.Check
                key={interest}
                inline
                type="checkbox"
                label={interest}
                id={`interest-${interest}`}
                checked={interests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="goals">
          <Form.Label>Your Learning Goals</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="E.g., Become a Front-End Developer"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="weeklyTime">
          <Form.Label>Weekly Time Commitment (hours)</Form.Label>
          <Form.Control
            type="number"
            min={1}
            max={168}
            placeholder="How many hours per week can you dedicate?"
            value={weeklyTime}
            onChange={(e) => setWeeklyTime(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="skills">
          <Form.Label>Select Your Skills</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={skills}
            onChange={handleSkillsChange}
          >
            {skillOptions.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </Form.Control>
          <Form.Text className="text-muted">
            Hold Ctrl (Cmd on Mac) to select multiple skills
          </Form.Text>
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </Form>
    </Container>
  );
};

export default ProfileSetup;
