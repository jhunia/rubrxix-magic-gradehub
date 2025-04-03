
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Filter, 
  Search, 
  BookOpen, 
  Users, 
  FileText,
  MoreHorizontal,
  GraduationCap,
  Calendar,
  Settings
} from 'lucide-react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import CourseCard from '@/components/lecturer/CourseCard';
import { mockUsers, getCoursesByLecturerId } from '@/utils/mockData';
import { fetchInstructorCourses } from '@/api/courseApi';
import { Course } from '@/types';
// import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Using mock data - in a real app, this would come from authentication and API
  const lecturer = mockUsers.find(user => user.role === 'lecturer');
  const lecturerCourses = lecturer ? getCoursesByLecturerId(lecturer.id) : [];
  const navigate = useNavigate();


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

  
  // Calculate statistics
  const totalStudents = new Set(courses.flatMap(course => course.students)).size;
  const totalAssignments = courses.reduce((acc, course) => acc + course.assignments.length, 0);
  const currentSemester = "Fall 2023"; // In a real app, this would be dynamic
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={true} 
        userRole="lecturer" 
        userName={lecturer?.name}
        userAvatar={lecturer?.profileImage}
      />
      
      <main className="flex-1 py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Courses</h1>
              <p className="text-muted-foreground">Manage your courses and assignments</p>
            </div>
            <Link to="/lecturer/courses/new">
              <Button className="gap-2 bg--blue hover:bg-rubrix-blue/90">
                <PlusCircle className="h-4 w-4" />
                Create Course
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                    <div className="text-2xl font-bold">{lecturerCourses.length}</div>
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
                      <Users className="h-5 w-5 text-orange-500" />
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold">{totalAssignments}</div>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Semester</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-base font-medium">{currentSemester}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          

          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-auto sm:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search courses..." 
                  className="pl-10 w-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-rubrix-blue hover:bg-rubrix-blue/90' : ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-rubrix-blue hover:bg-rubrix-blue/90' : ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {viewMode === 'grid' ? (
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
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Assignments</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div className="font-medium">{course.courseName}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {course.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-blue-200">
                              {course.courseNumber}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {course.semester} {course.year}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{course.students.length}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{course.assignments.length}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-[160px]">
                                <DropdownMenuItem>
                                  <Link to={`/lecturer/courses/${course.id}`} className="flex w-full">
                                    View Course
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link to={`/lecturer/courses/${course.id}/edit`} className="flex w-full">
                                    Edit Course
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link to={`/lecturer/courses/${course.id}/students`} className="flex w-full">
                                    Manage Students
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link to={`/lecturer/courses/${course.id}/assignments/new`} className="flex w-full">
                                    Add Assignment
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete Course
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <BookOpen className="h-10 w-10 mb-2 text-muted-foreground/60" />
                            <p>No courses found</p>
                            <p className="text-sm">Try adjusting your search or create a new course</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Courses;
