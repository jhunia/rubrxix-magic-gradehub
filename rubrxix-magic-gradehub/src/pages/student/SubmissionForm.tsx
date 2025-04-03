import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const questions = {
  "Q1": "What does KNN stand for in machine learning?",
  "Q2": "KNN is considered a ________ learning algorithm.",
  "Q3": "KNN is mainly used for which type of tasks?",
  "Q4": "What is the key parameter in KNN that determines the number of neighbors to consider?",
  "Q5": "Which distance metric is commonly used in KNN?",
};

const SubmissionForm: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
  const userName = "John Doe"; // Replace with dynamic user data
  const courseName = "Introduction to Artificial Intelligence";

  interface GradingResult {
    [key: string]: "Correct" | "Incorrect";
  }

  const [result, setResult] = useState<GradingResult | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Time is up! Your answers will be submitted automatically.");
      handleSubmit(new Event("submit"));
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error submitting answers:", error);
    } finally {
      setLoading(false);
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-blue-500 text-white py-4 px-6 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{courseName}</h1>
            <p className="text-sm">Welcome, {userName}</p>
          </div>
          <div className="text-lg font-semibold">
            Time Left: <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Submission Form */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Submit KNN Quiz</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(questions).map(([key, question]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{question}</label>
                <Textarea
                  placeholder="Enter your answer here..."
                  value={answers[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  required
                />
              </div>
            ))}
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-500 text-white" disabled={loading}>
                {loading ? "Submitting..." : "Submit Answers"}
              </Button>
            </div>
          </form>
          {result && (
            <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500">
              <h3 className="text-lg font-semibold text-green-700">Grading Results</h3>
              <pre className="text-sm text-gray-700">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionForm;
