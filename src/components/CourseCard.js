import React, { useState } from "react";
import { Card, Col, Button, Collapse, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo")) || {};
  const enrolledCourses = user.enrolledCourses || [];
  const isAlreadyEnrolled = enrolledCourses.includes(course._id);

  const handleEnroll = () => {
    if (!isAlreadyEnrolled) {
      const updatedUser = {
        ...user,
        enrolledCourses: [...enrolledCourses, course._id]
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    }
    navigate(`/course/${course._id}`);
  };

  return (
    <Col xs={12} sm={6} md={4}>
      <Card className="h-100 shadow-sm">
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-semibold text-primary">{course.title}</Card.Title>
          <Card.Text className="text-muted">{course.description?.slice(0, 80)}...</Card.Text>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="mt-2"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </Button>

          {/* <Collapse in={showDetails}>
            <div className="mt-3">
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Created By:</strong> {course.createdBy?.name || "Unknown"}</p>
              <p>
                <label>Will Complete in Week</label>
<br />
<input type="number" placeholder="Enter number of weeks" />
              </p>
              <p>
                <strong>XP:</strong> {course.topics?.length * 10} {" "}
                <Badge bg="info">Est. XP</Badge>
              </p>

              <div className="d-grid">
                <Button
                  variant={isAlreadyEnrolled ? "success" : "primary"}
                  onClick={handleEnroll}
                >
                  {isAlreadyEnrolled ? "Continue Learning" : "Enroll & Start"}
                </Button>
              </div>
            </div>
          </Collapse>
           */}
           <Collapse in={showDetails}>
  <div className="mt-3">
    <p><strong>Category:</strong> {course.category}</p>
    <p><strong>Created By:</strong> {course.createdBy?.name || "Unknown"}</p>
    
    <div className="mb-3">
      <label htmlFor="weekInput" className="form-label"><strong>Will Complete in Week</strong></label>
      <input
        type="number"
        id="weekInput"
        placeholder="Enter number of weeks"
        className="week-input"
      />
    </div>

    <p>
      <strong>XP:</strong> {course.topics?.length * 10} <Badge bg="info">Est. XP</Badge>
    </p>

    <div className="d-grid">
      <Button
        variant={isAlreadyEnrolled ? "success" : "primary"}
        onClick={handleEnroll}
      >
        {isAlreadyEnrolled ? "Continue Learning" : "Enroll & Start"}
      </Button>
    </div>
  </div>
</Collapse>

        </Card.Body>
      </Card>
    </Col>
  );
};

export default CourseCard;
