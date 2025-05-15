import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const CourseContent = () => {
  const { id } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/courses/${id}/lectures`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLectures(response.data);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (lectures.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">No lectures available for this course.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Course Content</h2>
      <ListGroup>
        {lectures.map((lecture, index) => (
          <ListGroup.Item key={lecture._id}>
            <h5>
              Lecture {index + 1}: {lecture.title}
            </h5>
            <p>{lecture.description}</p>
            <video width="100%" controls>
              <source src={lecture.video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default CourseContent;
