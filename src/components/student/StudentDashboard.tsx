
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Clock, CheckCircle, AlertTriangle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Course, Assignment, Submission } from '@/types';
import AssignmentCard from './AssignmentCard';

interface StudentDashboardProps {
  courses: Course[];
  submissions: Submission[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  courses, 
  submissions 
}) => {
  // Get all assignments from enrolled courses
  const allAssignments = courses.flatMap(course => course.assignments);
  
  // Count upcoming assignments (due in the future)
  const today = new Date();
  const upcomingAssignments = allAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate >= today;
  });
  
  // Sort upcoming assignments by due date (closest first)
  upcomingAssignments.sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Count overdue assignments
  const overdueAssignments = allAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate < today && !submissions.some(
      s => s.assignmentId === assignment.id
    );
  });
  
  // Count completed assignments
  const completedAssignments = submissions.filter(
    submission => submission.status === 'submitted' || submission.status === 'graded'
  ).length;
  
  // Calculate overall progress
  const totalAssignments = allAssignments.length;
  const progressPercentage = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your courses, assignments, and academic progress</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-rubrxix-blue" />
                </div>
                <div className="text-2xl font-bold">{courses.length}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-rubrxix-orange" />
                </div>
                <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{completedAssignments}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold">{overdueAssignments.length}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Assignments</CardTitle>
                <Link to="/student/assignments">
                  <Button variant="ghost" size="sm" className="text-rubrxix-blue">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAssignments.slice(0, 4).map((assignment) => {
                    const course = courses.find(c => c.id === assignment.courseId);
                    return (
                      <AssignmentCard 
                        key={assignment.id} 
                        assignment={assignment} 
                        course={course}
                        studentSubmission={submissions.find(s => s.assignmentId === assignment.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg mb-2">No upcoming assignments</CardTitle>
                  <CardDescription className="max-w-xs">
                    You're all caught up! Check back later for new assignments.
                  </CardDescription>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assignments Completed</span>
                  <span className="font-medium">{completedAssignments} / {totalAssignments}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="space-y-6">
                {courses.map((course) => {
                  const courseAssignments = allAssignments.filter(a => a.courseId === course.id);
                  const courseSubmissions = submissions.filter(s => 
                    courseAssignments.some(a => a.id === s.assignmentId)
                  );
                  const courseProgress = courseAssignments.length > 0 
                    ? Math.round((courseSubmissions.length / courseAssignments.length) * 100)
                    : 0;
                  
                  return (
                    <div key={course.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{course.code}</span>
                        <span className="text-muted-foreground">{courseProgress}%</span>
                      </div>
                      <Progress value={courseProgress} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-4 border-t">
                <Link to="/student/ai-assistant">
                  <Button className="w-full gap-2 bg-rubrxix-blue hover:bg-rubrxix-blue/90">
                    <Brain className="h-4 w-4" />
                    Ask AI Assistant
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Need help with assignments or concepts? Our AI Assistant is available 24/7.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Enrolled Courses</CardTitle>
              <Link to="/student/courses">
                <Button variant="ghost" size="sm" className="text-rubrxix-blue">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => {
                const courseAssignments = allAssignments.filter(a => a.courseId === course.id);
                const courseSubmissions = submissions.filter(s => 
                  courseAssignments.some(a => a.id === s.assignmentId)
                );
                const courseProgress = courseAssignments.length > 0 
                  ? Math.round((courseSubmissions.length / courseAssignments.length) * 100)
                  : 0;
                
                return (
                  <div 
                    key={course.id} 
                    className="bg-muted/30 rounded-lg border p-4 hover:border-rubrxix-blue/30 hover:bg-rubrxix-blue/5 transition-colors"
                  >
                    <Link to={`/student/courses/${course.id}`} className="block">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium line-clamp-1">{course.title}</h3>
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded font-medium">
                          {course.code}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{courseProgress}%</span>
                        </div>
                        <Progress value={courseProgress} className="h-1" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
