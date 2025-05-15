import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, Button, Form } from 'react-bootstrap';

const QuizPage = () => {
  const { courseId, topicId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const learnerId = 'learner123'; // replace with real auth-based ID

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        const topic = res.data.topics.find(t => t._id === topicId || t._id.$oid === topicId);
        const quizData = JSON.parse(topic.quiz || '[]');
        setQuiz(quizData);
      } catch (err) {
        console.error('Error loading quiz:', err);
      }
    };

    fetchQuiz();
  }, [courseId, topicId]);

  const handleChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let correct = 0;
    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) correct++;
    });
    setScore(correct);

    try {
      await axios.post(`http://localhost:5000/api/learners/${learnerId}/progress`, {
        courseId,
        topicId,
        xpEarned: correct * 5,
        completed: true
      });
    } catch (err) {
      console.error("Error saving quiz progress", err);
    }
  };

  if (!quiz.length) return <p>Loading quiz...</p>;

  return (
    <div>
      <h2>Quiz</h2>
      <Form onSubmit={handleSubmit}>
        {quiz.map((q, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <Card.Title>{q.question}</Card.Title>
              {q.options.map((opt, i) => (
                <Form.Check
                  key={i}
                  type="radio"
                  label={opt}
                  name={`q-${index}`}
                  value={opt}
                  checked={answers[index] === opt}
                  onChange={() => handleChange(index, opt)}
                />
              ))}
            </Card.Body>
          </Card>
        ))}
        <Button type="submit">Submit</Button>
      </Form>
      {score !== null && (
        <div className="mt-4">
          <h4>Your Score: {score} / {quiz.length}</h4>
        </div>
      )}
    </div>
  );
};

export default QuizPage;