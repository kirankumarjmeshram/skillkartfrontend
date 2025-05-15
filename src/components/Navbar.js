import React, { useState, useEffect } from "react";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    const onAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("authChanged", onAuthChange);
    return () => {
      window.removeEventListener("authChanged", onAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
          SkillKart
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="navbar-nav" />
        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <NavDropdown title="Profile" id="profile-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">
                    View Profile
                  </NavDropdown.Item>
                  {role === "creator" && (
                    <NavDropdown.Item as={Link} to="/upload-course">
                      Upload Course
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
