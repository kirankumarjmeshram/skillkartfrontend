import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const CourseInfo = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourse(response.data);
        // Check if user is already enrolled
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setEnrolled(response.data.enrolledUsers.includes(userInfo._id));
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/courses/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrolled(true);
      navigate(`/courses/${id}/content`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Course not found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p>Category: {course.category}</p>
      <p>Created By: {course.createdBy.name}</p>
      {enrolled ? (
        <Button variant="success" onClick={() => navigate(`/courses/${id}/content`)}>
          Start Learning
        </Button>
      ) : (
        <Button variant="primary" onClick={handleEnroll}>
          Enroll Now
        </Button>
      )}
    </Container>
  );
};

export default CourseInfo;
