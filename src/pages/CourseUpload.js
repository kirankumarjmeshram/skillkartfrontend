import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const CourseUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState([{}]);

  const handleTopicChange = (index, event) => {
    const { name, value } = event.target;
    const newTopics = [...topics];
    newTopics[index][name] = value;
    setTopics(newTopics);
  };

  const addTopic = () => {
    setTopics([...topics, {}]);
  };

  const removeTopic = (index) => {
    if (topics.length === 1) return;
    const updated = [...topics];
    updated.splice(index, 1);
    setTopics(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transformedTopics = topics.map((topic, index) => {
        let parsedQuiz = [];
        try {
          parsedQuiz = topic.quiz ? JSON.parse(topic.quiz) : [];
        } catch (e) {
          throw new Error(`Quiz for topic ${index + 1} is not valid JSON.`);
        }

        return {
          order: index + 1,
          title: topic.title,
          videos: topic.videos
            ? topic.videos.split(",").map((v) => v.trim())
            : [],
          blogs: topic.blogs ? topic.blogs.split(",").map((b) => b.trim()) : [],
          notes: topic.notes || "",
          quiz: parsedQuiz,
        };
      });

      const courseData = {
        title,
        description,
        topics: transformedTopics,
      };

      await axios.post("http://localhost:5000/api/courses", courseData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("✅ Course uploaded successfully!");
      setTitle("");
      setDescription("");
      setTopics([{}]);
    } catch (err) {
      console.error(err);
      alert(
        "❌ Error uploading course: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <h2 className="text-center mb-4 fw-bold">🚀 Upload a New Course</h2>
      <Card className="shadow p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Course Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              placeholder="Enter course title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Course Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter a brief course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <h4 className="mb-3">📚 Topics</h4>
          {topics.map((topic, index) => (
            <Card key={index} className="mb-4 shadow-sm">
              <Card.Body>
                <Row>
                  <Col xs={10}>
                    <h5 className="fw-semibold text-primary">
                      Topic {index + 1}
                    </h5>
                  </Col>
                  <Col xs={2} className="text-end">
                    {topics.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeTopic(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Topic title"
                    value={topic.title || ""}
                    onChange={(e) => handleTopicChange(index, e)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Videos (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="videos"
                    placeholder="https://video1.com, https://video2.com"
                    value={topic.videos || ""}
                    onChange={(e) => handleTopicChange(index, e)}
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Blogs (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    name="blogs"
                    placeholder="https://blog1.com, https://blog2.com"
                    value={topic.blogs || ""}
                    onChange={(e) => handleTopicChange(index, e)}
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    type="text"
                    name="notes"
                    placeholder="Notes link or summary"
                    value={topic.notes || ""}
                    onChange={(e) => handleTopicChange(index, e)}
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Quiz (JSON format)</Form.Label>
                  <Form.Control
                    type="text"
                    name="quiz"
                    placeholder='[{"question": "Q1?", "options": ["a", "b"], "answer": "a"}]'
                    value={topic.quiz || ""}
                    onChange={(e) => handleTopicChange(index, e)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-between mt-3">
            <Button variant="outline-primary" onClick={addTopic}>
              ➕ Add Topic
            </Button>
            <Button type="submit" variant="success">
              ✅ Submit Course
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default CourseUpload;
