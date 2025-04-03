import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment, Course, Submission } from '@/types';
import { useNavigate } from 'react-router-dom';

interface StudentDashboardProps {
  courses: Course[];
  submissions: Submission[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ courses, submissions }) => {
  const navigate = useNavigate();

  // Define additional assignments
  const additionalAssignments: Assignment[] = [
    {
      id: 'assignment-1',
      courseId: 'course-1',
      title: 'KNN quiz 1',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), // Due in 3 days
      totalPoints: 20,
    },
    {
      id: 'assignment-2',
      courseId: 'course-2',
      title: 'Calculus test 5',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), // Due in 5 days
      totalPoints: 50,
    },
    {
      id: 'assignment-3',
      courseId: 'course-3',
      title: 'Stack implementation in Java assignment',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Due in 7 days
      totalPoints: 30,
    },
  ];

  // State to toggle the visibility of courses, assignments, completed, and graded lists
  const [showCourses, setShowCourses] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showGraded, setShowGraded] = useState(false);

  // Ensure each course has an `assignments` array
  const coursesWithAssignments = courses.map((course) => ({
    ...course,
    assignments: course.assignments || [],
  }));

  // Combine existing assignments with additional ones
  const allAssignments = coursesWithAssignments.flatMap((course) => course.assignments);
  const combinedAssignments = [...allAssignments, ...additionalAssignments];

  // Filter and sort upcoming assignments
  const today = new Date();
  const upcomingAssignments = combinedAssignments
    .filter((assignment) => new Date(assignment.dueDate) >= today)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Filter completed and graded submissions
  const completedSubmissions = submissions.filter(
    (submission) => submission.status === 'submitted'
  );
  const gradedSubmissions = submissions.filter(
    (submission) => submission.status === 'graded'
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your courses, assignments, and academic progress</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowCourses(!showCourses)} // Toggle courses visibility
          className="cursor-pointer"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-rubrix-blue" />
                </div>
                <div className="text-2xl font-bold">{courses.length}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => setShowAssignments(!showAssignments)} // Toggle assignments visibility
          className="cursor-pointer"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-rubrix-orange" />
                </div>
                <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Completed Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => setShowCompleted(!showCompleted)} // Toggle completed visibility
          className="cursor-pointer"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{completedSubmissions.length}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Graded Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => setShowGraded(!showGraded)} // Toggle graded visibility
          className="cursor-pointer"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Graded Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold">{gradedSubmissions.length}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Display courses when the card is clicked */}
      {showCourses && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="text-lg font-medium">{course.courseName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Display assignments when the card is clicked */}
      {showAssignments && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {upcomingAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              onClick={() => {
                if (assignment.title === 'KNN quiz 1') {
                  navigate('/student/assignments/knn-quiz-1/submit');
                }
              }}
              className="cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-lg font-medium">{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Points: {assignment.totalPoints}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Display completed assignments when the card is clicked */}
      {showCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {completedSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Completed Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Assignment ID: {submission.assignmentId}</p>
                <p className="text-sm text-muted-foreground">Status: {submission.status}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Display graded assignments when the card is clicked */}
      {showGraded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {gradedSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Graded Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Assignment ID: {submission.assignmentId}</p>
                <p className="text-sm text-muted-foreground">Status: {submission.status}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default StudentDashboard;
