import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusCircle, BookOpen, Users, Clock, FileText, Bell, Loader2, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseCard from './CourseCard';
import { Course, Assignment, Submission } from '@/types';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchInstructorCourses } from '@/api/courseApi';
// import { useAuth } from '@/context/AuthContext';

interface LecturerDashboardProps {
  recentSubmissions: Submission[];
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ recentSubmissions }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { currentUser } = useAuth(); // Assuming you have an auth context

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const user = localStorage.getItem('user');
        const parsedUser = JSON.parse(user); // Parse the string into an object
        const userId = parsedUser.userId;
        if (!userId) {
          navigate('/sign-in');
          return;
        }
        
        const response = await fetchInstructorCourses(userId);
        console.log('Fetched courses:', response);
        // Ensure the response is an array
        if (!Array.isArray(response)) {
          throw new Error('Invalid courses data format received from server');
        }
        
        setCourses(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  // Safely calculate derived values
  const allAssignments = React.useMemo(() => {
    try {
      return Array.isArray(courses) ? courses.flatMap(course => 
        Array.isArray(course.assignments) ? course.assignments : []
      ) : [];
    } catch (error) {
      console.error('Error calculating assignments:', error);
      return [];
    }
  }, [courses]);

  const upcomingAssignments = React.useMemo(() => {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      
      return allAssignments.filter(assignment => {
        try {
          const dueDate = new Date(assignment.dueDate);
          return dueDate >= today && dueDate <= nextWeek;
        } catch {
          return false;
        }
      });
    } catch (error) {
      console.error('Error calculating upcoming assignments:', error);
      return [];
    }
  }, [allAssignments]);

  const pendingSubmissions = React.useMemo(() => {
    try {
      return Array.isArray(recentSubmissions) 
        ? recentSubmissions.filter(sub => sub.status === 'submitted').length 
        : 0;
    } catch (error) {
      console.error('Error calculating pending submissions:', error);
      return 0;
    }
  }, [recentSubmissions]);

  const totalStudents = React.useMemo(() => {
    try {
      if (!Array.isArray(courses)) return 0;
      
      const allStudents = courses.flatMap(course => 
        Array.isArray(course.students) ? course.students : []
      );
      return new Set(allStudents).size;
    } catch (error) {
      console.error('Error calculating total students:', error);
      return 0;
    }
  }, [courses]);

  // ... rest of your component remains the same ...

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading dashboard</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Retry
          </Button>
        </Alert>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses, assignments, and student submissions
          </p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Courses
              </CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-rubrix-orange" />
                </div>
                <div className="text-2xl font-bold">{totalStudents}</div>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Due Dates
              </CardTitle>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Submissions
              </CardTitle>
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
              <CourseCard 
                key={course.id} 
                course={course} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg mb-2">No courses yet</CardTitle>
              <CardDescription className="mb-4 max-w-md">
                You haven't created any courses. Get started by creating your first course to manage lectures, assignments, and student submissions.
              </CardDescription>
              <Link to="/lecturer/courses/new">
                <Button className="gap-2 bg-rubrix-blue hover:bg-rubrix-blue/90">
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Course
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
                          Course: {course?.courseName} | Status: {submission.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleDateString()} at {' '}
                          {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  const dueDate = new Date(assignment.dueDate);
                  const daysLeft = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  
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
                          Course: {course?.courseName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due on {dueDate.toLocaleDateString()} at {' '}
                          {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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