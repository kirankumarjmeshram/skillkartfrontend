import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ProgressBar, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LearnerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const learnerId = 'learner123'; // Replace with real logic

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/learners/${learnerId}`);
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-4">
      <h2>Welcome, {profile.name}</h2>
      <h5>Total XP: {profile.xp}</h5>
      <Row>
        {profile.enrolledCourses.map(course => {
          const progress = ((course.completedTopics.length / course.totalTopics) * 100).toFixed(0);
          return (
            <Col key={course._id} md={4} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <ProgressBar now={progress} label={`${progress}%`} className="mb-2" />
                  <Button variant="success" onClick={() => navigate(`/course/${course._id}`)}>
                    {progress >= 100 ? 'Review' : 'Continue Learning'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default LearnerDashboard;
