import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreatorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const creatorId = 'creator123'; // Replace with actual logic

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses`);
        setCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-4">
      <h2>My Created Courses</h2>
      <Row>
        {courses.map(course => (
          <Col key={course._id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Button variant="primary" onClick={() => navigate(`/creator/course/${course._id}/edit`)}>Edit Course</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CreatorDashboard;