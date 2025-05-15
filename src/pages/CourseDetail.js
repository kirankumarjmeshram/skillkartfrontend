import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Row,
  Col,
  ListGroup,
  ProgressBar,
  Spinner,
  Alert,
} from "react-bootstrap";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [videoStep, setVideoStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // const learnerId = "learner123"; // Replace with real learner ID

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(res.data);
        setTopics(res.data.topics || []);
      } catch (err) {
        console.error("Error loading course", err);
        setError("Failed to load course. Please try again later.");
      }
    };

    fetchCourse();

    const savedProgress = JSON.parse(localStorage.getItem("progress")) || {};
    const progress = savedProgress[courseId] || { completedTopics: [], xp: 0 };
    setCompletedTopics(progress.completedTopics);
  }, [courseId]);




  const saveProgressToLocal = (newCompletedTopics) => {
    const progress = JSON.parse(localStorage.getItem("progress")) || {};
    progress[courseId] = {
      completedTopics: newCompletedTopics,
      xp: newCompletedTopics.length * 10,
    };
    localStorage.setItem("progress", JSON.stringify(progress));
  };

  const markStepComplete = () => {
    const topicId = topics[activeTopicIndex]._id.$oid || topics[activeTopicIndex]._id;

    if (currentStep === 0 && videoStep < topics[activeTopicIndex].videos.length - 1) {
      setVideoStep(prev => prev + 1);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      if (currentStep === 0) setVideoStep(0);
    } else {
      if (!completedTopics.includes(topicId)) {
        const updated = [...completedTopics, topicId];
        setCompletedTopics(updated);
        saveProgressToLocal(updated);
      }
      setCurrentStep(0);
      setVideoStep(0);
      if (activeTopicIndex + 1 < topics.length) {
        setActiveTopicIndex(prev => prev + 1);
      }
    }
  };

  const navigateToTopic = (index) => {
    const topicId = topics[index - 1]?._id?.$oid || topics[index - 1]?._id;
    if (index === 0 || completedTopics.includes(topicId)) {
      setActiveTopicIndex(index);
      setCurrentStep(0);
      setVideoStep(0);
    } else {
      alert("Complete previous week to unlock this one.");
    }
  };

  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  if (!course || topics.length === 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const activeTopic = topics[activeTopicIndex];
  const topicProgress = (completedTopics.length / topics.length) * 100;

  return (
    <Row>
      <Col md={3} className="border-end">
        <h5 className="mt-3">Weeks</h5>
        <ListGroup variant="flush">
          {topics.map((t, idx) => {
            const topicId = t._id.$oid || t._id;
            const isUnlocked = idx === 0 || completedTopics.includes(topics[idx - 1]?._id?.$oid || topics[idx - 1]?._id);
            return (
              <ListGroup.Item
                key={topicId}
                action
                active={idx === activeTopicIndex}
                onClick={() => navigateToTopic(idx)}
                style={{
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                  opacity: isUnlocked ? 1 : 0.5,
                }}
              >
                {`Week ${t.order}: ${t.title}`} {completedTopics.includes(topicId) && <span className="text-success ms-2">✔</span>}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Col>

      <Col md={9} className="p-3">
        <h2 className="mb-3">{course.title}</h2>
        <ProgressBar now={topicProgress} label={`${Math.round(topicProgress)}%`} className="mb-4" />

        {completedTopics.length === topics.length ? (
          <Card className="text-center p-5 bg-success text-white">
            <h3>🎉 Congratulations!</h3>
            <p>You’ve completed the course and earned {topics.length * 10} XP!</p>
          </Card>
        ) : (
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{`Week ${activeTopic.order}: ${activeTopic.title}`}</Card.Title>
              {currentStep === 0 && (
                <>
                  <h6>Video {videoStep + 1} of {activeTopic.videos.length}</h6>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={activeTopic.videos[videoStep].replace("watch?v=", "embed/")}
                      title="Video Lesson"
                      allowFullScreen
                    />
                  </div>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <h6>Blogs</h6>
                  <ul>
                    {activeTopic.blogs.map((b, i) => (
                      <li key={i}><a href={b} target="_blank" rel="noreferrer">{b}</a></li>
                    ))}
                  </ul>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <h6>Notes</h6>
                  <p>{activeTopic.notes}</p>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <h6>Quiz</h6>
                  <iframe
                    src={`/course/${courseId}/topic/${activeTopic._id.$oid || activeTopic._id}/quiz`}
                    title="Quiz"
                    width="100%"
                    height="400px"
                  />
                </>
              )}

              <div className="mt-4">
                <Button onClick={markStepComplete} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : currentStep < 3 ? "Next" : "Next Week"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default CourseDetail;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, Link } from "react-router-dom";
// import {
//   Button,
//   Card,
//   Row,
//   Col,
//   ListGroup,
//   ProgressBar,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import ProgressTracker from "../components/ProgressTracker";

// const CourseDetail = () => {
//   const { courseId } = useParams();
//   const [course, setCourse] = useState(null);
//   const [topics, setTopics] = useState([]);
//   const [activeTopicIndex, setActiveTopicIndex] = useState(0);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedTopics, setCompletedTopics] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const learnerId = "learner123"; // Replace with real learner ID

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
//         setCourse(res.data);
//         setTopics(res.data.topics || []);
//       } catch (err) {
//         console.error("Error loading course", err);
//         setError("Failed to load course. Please try again later.");
//       }
//     };

//     fetchCourse();
//   }, [courseId]);

//   const markStepComplete = async () => {
//     const topicId = topics[activeTopicIndex]._id.$oid || topics[activeTopicIndex]._id;

//     if (currentStep < 3) {
//       setCurrentStep(prev => prev + 1);
//     } else {
//       if (!completedTopics.includes(topicId)) {
//         setIsSubmitting(true);
//         try {
//           await axios.post(`http://localhost:5000/api/learners/${learnerId}/progress`, {
//             courseId,
//             topicId,
//             xpEarned: 10,
//             completed: true,
//           });
//           setCompletedTopics(prev => [...prev, topicId]);
//         } catch (err) {
//           console.error("Progress update failed", err);
//           alert("Could not save progress. Try again.");
//         } finally {
//           setIsSubmitting(false);
//         }
//       }
//       setCurrentStep(0);
//       if (activeTopicIndex + 1 < topics.length) {
//         setActiveTopicIndex(prev => prev + 1);
//       }
//     }
//   };

//   const navigateToTopic = (index) => {
//     if (
//       index === 0 ||
//       completedTopics.includes(topics[index - 1]?._id?.$oid || topics[index - 1]?._id)
//     ) {
//       setActiveTopicIndex(index);
//       setCurrentStep(0);
//     } else {
//       alert("Complete previous topic to unlock this one.");
//     }
//   };

//   if (error) {
//     return (
//       <Alert variant="danger" className="mt-4">
//         {error}
//       </Alert>
//     );
//   }

//   if (!course || topics.length === 0) {
//     return (
//       <div className="text-center mt-5">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   }

//   const activeTopic = topics[activeTopicIndex];
//   const topicProgress = (completedTopics.length / topics.length) * 100;

//   return (
//     <Row>
//       {/* Sidebar */}
//       <Col md={3} className="border-end">
//         <h5 className="mt-3">Topics</h5>
//         <ListGroup variant="flush">
//           {topics.map((t, idx) => {
//             const topicId = t._id.$oid || t._id;
//             const isUnlocked =
//               idx === 0 ||
//               completedTopics.includes(topics[idx - 1]?._id?.$oid || topics[idx - 1]?._id);
//             return (
//               <ListGroup.Item
//                 key={topicId}
//                 action
//                 active={idx === activeTopicIndex}
//                 onClick={() => navigateToTopic(idx)}
//                 style={{
//                   cursor: isUnlocked ? "pointer" : "not-allowed",
//                   opacity: isUnlocked ? 1 : 0.5,
//                 }}
//               >
//                 {`Topic ${t.order}: ${t.title}`}
//                 {completedTopics.includes(topicId) && (
//                   <span className="text-success ms-2">✔</span>
//                 )}
//               </ListGroup.Item>
//             );
//           })}
//         </ListGroup>
//       </Col>

//       {/* Main content */}
//       <Col md={9} className="p-3">
//         <h2 className="mb-3">{course.title}</h2>
//         <ProgressBar now={topicProgress} label={`${Math.round(topicProgress)}%`} className="mb-4" />

//         <Card className="mb-3 shadow-sm">
//           <Card.Body>
//             <Card.Title>{`Topic ${activeTopic.order}: ${activeTopic.title}`}</Card.Title>
//             {currentStep === 0 && (
//               <>
//                 <h6>Videos</h6>
//                 <ul>
//                   {activeTopic.videos.map((v, i) => (
//                     <li key={i}>
//                       <a href={v} target="_blank" rel="noreferrer">
//                         {v}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </>
//             )}
//             {currentStep === 1 && (
//               <>
//                 <h6>Blogs</h6>
//                 <ul>
//                   {activeTopic.blogs.map((b, i) => (
//                     <li key={i}>
//                       <a href={b} target="_blank" rel="noreferrer">
//                         {b}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </>
//             )}
//             {currentStep === 2 && (
//               <>
//                 <h6>Notes</h6>
//                 <p>{activeTopic.notes}</p>
//               </>
//             )}
//             {currentStep === 3 && (
//               <>
//                 <h6>Quiz</h6>
//                 <Button
//                   variant="info"
//                   as={Link}
//                   to={`/course/${courseId}/topic/${activeTopic._id.$oid || activeTopic._id}/quiz`}
//                 >
//                   Attempt Quiz
//                 </Button>
//               </>
//             )}

//             <div className="mt-4">
//               <Button onClick={markStepComplete} disabled={isSubmitting}>
//                 {isSubmitting
//                   ? "Processing..."
//                   : currentStep < 3
//                   ? "Complete"
//                   : "Next Topic"}
//               </Button>
//             </div>
//           </Card.Body>
//         </Card>

//         <ProgressTracker courseId={courseId} learnerId={learnerId} />
//       </Col>
//     </Row>
//   );
// };

// export default CourseDetail;
