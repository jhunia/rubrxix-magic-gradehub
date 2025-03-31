
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, BookOpen, Users, Clock, FileText, BarChart, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseCard from './CourseCard';
import { Course, Assignment, Submission } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LecturerDashboardProps {
  courses: Course[];
  recentSubmissions: Submission[];
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ 
  courses, 
  recentSubmissions 
}) => {
  // Get all assignments from all courses
  const allAssignments = courses.flatMap(course => course.assignments);
  
  // Count assignments due in the next 7 days
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingAssignments = allAssignments.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    return dueDate >= today && dueDate <= nextWeek;
  });
  
  // Count recent submissions (last 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  
  const recentSubmissionsCount = recentSubmissions.filter(submission => {
    const submittedDate = new Date(submission.submittedAt);
    return submittedDate >= lastWeek;
  }).length;
  
  // Count pending submissions (submitted but not graded)
  const pendingSubmissions = recentSubmissions.filter(
    submission => submission.status === 'submitted'
  ).length;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses, assignments, and student submissions</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/lecturer/courses/new">
            <Button className="gap-2 bg-rubrix-blue hover:bg-rubrix-blue/90">
              <PlusCircle className="h-4 w-4" />
              New Course
            </Button>
          </Link>
          <Link to="/lecturer/assignments/new">
            <Button variant="outline" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Assignment
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-rubrix-orange" />
                </div>
                <div className="text-2xl font-bold">
                  {/* Get unique student IDs across all courses */}
                  {new Set(courses.flatMap(course => course.enrolledStudents)).size}
                </div>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Due Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-red-500" />
                </div>
                <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{pendingSubmissions}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <Link to="/lecturer/courses">
            <Button variant="ghost" size="sm" className="text-rubrix-blue">
              View All
            </Button>
          </Link>
        </div>
        
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="py-8 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg mb-2">No courses yet</CardTitle>
              <CardDescription className="mb-4">Get started by creating your first course</CardDescription>
              <Link to="/lecturer/courses/new">
                <Button className="gap-2 bg-rubrix-blue hover:bg-rubrix-blue/90">
                  <PlusCircle className="h-4 w-4" />
                  Create Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-rubrix-blue">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.slice(0, 5).map((submission) => {
                  const assignment = allAssignments.find(a => a.id === submission.assignmentId);
                  const course = courses.find(c => c.id === assignment?.courseId);
                  
                  return (
                    <div key={submission.id} className="flex items-start space-x-3">
                      <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mt-1">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          New submission for {assignment?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Course: {course?.title} | Status: {submission.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {recentSubmissions.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
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
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Deadlines</CardTitle>
                <Button variant="ghost" size="sm" className="text-rubrix-blue">
                  View Calendar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAssignments.slice(0, 5).map((assignment) => {
                  const course = courses.find(c => c.id === assignment.courseId);
                  const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={assignment.id} className="flex items-start space-x-3">
                      <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center mt-1">
                        <Clock className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{assignment.title}</p>
                          <p className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-500">
                            {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Course: {course?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due on {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {upcomingAssignments.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-6">
                    <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
