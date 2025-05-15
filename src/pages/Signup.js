import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';
import axios from 'axios';

const Signup = () => {
  const [role, setRole] = useState('learner');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Handle signup logic here (API call)
  //   console.log({ role, username, email, password });
  //   navigate('/login');
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/api/auth/signup", {
      name: username,
      email,
      password,
      role,
    });

    navigate("/login");
  } catch (err) {
    console.error("Signup failed", err);
    alert("Signup failed. Try a different email.");
  }
};


  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Row className="w-100" style={{ maxWidth: '400px' }}>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Create an Account</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="learner">Learner</option>
                    <option value="creator">Creator</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
