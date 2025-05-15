import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CourseCard from "../components/CourseCard";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const hasVisited = localStorage.getItem("hasVisited");

  if (!hasVisited) {
    localStorage.removeItem("progress");
    localStorage.setItem("hasVisited", "true");
  }
}, []);
  useEffect(() => {
    axios
      .get("https://skillcartbackend.onrender.com/api/courses")
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch courses", err);
        setLoading(false);
      });
  }, []);

  // Render shimmer/skeleton cards
  const renderSkeletonCards = () => {
    return Array(6)
      .fill(0)
      .map((_, idx) => (
        <Col key={idx} xs={12} sm={6} md={4}>
          <div className="card h-100 shadow-sm p-3">
            <h5><Skeleton width="70%" height={25} /></h5>
            <p><Skeleton count={3} /></p>
            <Skeleton height={36} width={100} />
          </div>
        </Col>
      ));
  };

  // Render actual course cards
  const renderCourses = () => {
    return courses.map((course) => (
      <CourseCard key={course._id} course={course} />
    ));
  };

  return (
    <Container className="mt-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold">📚 Explore Our Courses</h2>
        <p className="text-muted">Choose from a variety of expertly designed courses</p>
      </div>

      <Row className="g-4">
        {loading ? renderSkeletonCards() : renderCourses()}
      </Row>
    </Container>
  );
};

export default Home;
