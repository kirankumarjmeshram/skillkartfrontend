import React, { useState, useEffect } from "react";
import { Container, Accordion } from "react-bootstrap";
import axios from "axios";

const RoadmapPage = ({ courseId }) => {
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      const res = await axios.get(`http://localhost:5000/api/roadmaps/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRoadmap(res.data);
    };
    fetchRoadmap();
  }, [courseId]);

  if (!roadmap) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <h3>Your Roadmap</h3>
      <Accordion>
        {roadmap.weekWisePlan.map((week, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>Week {week.week}</Accordion.Header>
            <Accordion.Body>
              {week.topics.map((topic, idx) => (
                <p key={idx}>{topic.title}</p>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default RoadmapPage;
