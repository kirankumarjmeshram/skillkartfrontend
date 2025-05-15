import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfileSetup from "./pages/ProfileSetup";
// import CreatorDashboard from './pages/CreatorDashboard';
// import LearnerDashboardWrapper from './pages/LearnerDashboardWrapper';
import ProfilePage from "./pages/ProfilePage";
import Home from "./pages/Home";
import CourseUpload from "./pages/CourseUpload";
import CourseDetail from "./pages/CourseDetail";
import RoadmapPage from "./pages/RoadmapPage";
import QuizPage from "./pages/QuizPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import "bootstrap/dist/css/bootstrap.min.css";
// import LearnerDashboard from "./pages/LearnerDashboard";
// import CourseContent from "./components/CourseContent";
// import CourseInfo from "./pages/CourseInfo";

function App() {
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <Container className="flex-grow-1 mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dashboard and Profile */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {userRole === "creator" ? (
                    <Home />
                  ) : (
                    <Home />
                  )}
                </ProtectedRoute>
              }
            />
                        <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/creator/dashboard"
              element={
                <ProtectedRoute>
                  <Home/>
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload-course"
              element={
                <ProtectedRoute>
                  <CourseUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                
                  <CourseDetail />
              }
            />
                        {/* <Route
              path="/course/:courseId"
              element={
                <ProtectedRoute>
                  <CourseInfo />
                </ProtectedRoute>
              }
            /> */}
            
            <Route
              path="/roadmap/:courseId"
              element={
                <ProtectedRoute>
                  <RoadmapPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/courses/:id/content" element={<CourseContent />} /> */}

            <Route
              path="/course/:courseId/topic/:topicId/quiz"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route path="/learner/profile-setup" element={<ProfileSetup />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
