
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Filter, 
  Search, 
  FileText, 
  Clock, 
  MoreHorizontal,
  Calendar,
  CheckCircle,
  Users,
  BookOpen
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { mockUsers, mockCourses, getCoursesByLecturerId } from '@/utils/mockData';

const Assignments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  
  // Using mock data - in a real app, this would come from authentication and API
  const lecturer = mockUsers.find(user => user.role === 'lecturer');
  const lecturerCourses = lecturer ? getCoursesByLecturerId(lecturer.id) : [];
  
  // Get all assignments from all courses
  const allAssignments = lecturerCourses.flatMap(course => 
    course.assignments.map(assignment => ({
      ...assignment,
      courseTitle: course.title,
      courseCode: course.code,
    }))
  );
  
  // Filter assignments based on search query and course filter
  const filteredAssignments = allAssignments.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || assignment.courseId === courseFilter;
    
    return matchesSearch && matchesCourse;
  });
  
  // Sort assignments by due date (most recent first)
  const sortedAssignments = [...filteredAssignments].sort((a, b) => 
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  );

  // Count assignments by status
  const dueCount = allAssignments.filter(a => new Date(a.dueDate) > new Date()).length;
  const pastDueCount = allAssignments.filter(a => new Date(a.dueDate) <= new Date()).length;
  const publishedCount = allAssignments.filter(a => a.published).length;
  const draftCount = allAssignments.filter(a => !a.published).length;

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
              <h1 className="text-3xl font-bold">Assignments</h1>
              <p className="text-muted-foreground">Manage all your course assignments</p>
            </div>
            <Link to="/lecturer/assignments/new">
              <Button className="gap-2 bg-rubrxix-blue hover:bg-rubrxix-blue/90">
                <PlusCircle className="h-4 w-4" />
                Create Assignment
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-rubrxix-blue" />
                    </div>
                    <div className="text-2xl font-bold">{allAssignments.length}</div>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{publishedCount}</div>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold">{dueCount}</div>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Past Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold">{pastDueCount}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search assignments..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {lecturerCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code}: {course.title}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAssignments.length > 0 ? (
                    sortedAssignments.map((assignment) => {
                      const course = lecturerCourses.find(c => c.id === assignment.courseId);
                      const isDue = new Date(assignment.dueDate) <= new Date();
                      const submissionCount = assignment.submissions?.length || 0;
                      const totalStudents = course?.enrolledStudents.length || 0;
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div className="font-medium">{assignment.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {assignment.published ? 'Published' : 'Draft'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-blue-200">
                                {assignment.courseCode}
                              </Badge>
                              <span className="text-sm">{assignment.courseTitle}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${isDue ? 'bg-red-500' : 'bg-green-500'}`} />
                              <span>
                                {new Date(assignment.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {isDue ? (
                              <Badge variant="outline" className="bg-red-50 hover:bg-red-50 text-red-700 border-red-200">Past Due</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 hover:bg-green-50 text-green-700 border-green-200">Open</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{submissionCount}/{totalStudents}</span>
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                                <DropdownMenuItem>View Submissions</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <FileText className="h-10 w-10 mb-2 text-muted-foreground/60" />
                          <p>No assignments found</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Assignments;
