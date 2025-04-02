
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { mockUsers, getCourseById } from '@/utils/mockData';
import { Assignment } from '@/types';
import AssignmentCard from '@/components/student/AssignmentCard';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Search,
  User,
  Users,
  BookText,
  FileText,
} from 'lucide-react';

const StudentCourse = () => {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Using mock data - in a real app, this would come from API
  const student = mockUsers.find(user => user.role === 'student');
  const course = getCourseById(id || '');
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          isAuthenticated={true} 
          userRole="student" 
          userName={student?.name}
          userAvatar={student?.profileImage}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Course not found</h1>
            <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist or you don't have access to it.</p>
            <Link to="/student/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Filter assignments based on search
  const filteredAssignments = course.assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate course progress
  const completedAssignments = 0; // In a real app, would be based on submissions
  const courseProgress = course.assignments.length > 0 
    ? Math.round((completedAssignments / course.assignments.length) * 100)
    : 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={true} 
        userRole="student" 
        userName={student?.name}
        userAvatar={student?.profileImage}
      />
      
      <main className="flex-1 py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Course Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link to="/student/courses" className="text-sm text-rubrix-blue hover:underline">
                    Courses
                  </Link>
                  <span className="text-sm text-muted-foreground">/</span>
                  <span className="text-sm font-medium truncate">{course.title}</span>
                </div>
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 border-0 text-blue-700">
                    {course.code}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 border-0 text-purple-700">
                    {course.semester} {course.year}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link to={`/student/courses/${course.id}/discussions`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Users className="mr-2 h-4 w-4" />
                    Discussions
                  </Button>
                </Link>
                <Link to={`/student/courses/${course.id}/materials`}>
                  <Button className="w-full sm:w-auto bg-rubrix-blue hover:bg-rubrix-blue/90">
                    <BookText className="mr-2 h-4 w-4" />
                    Materials
                  </Button>
                </Link>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h2 className="font-medium mb-2">Description</h2>
                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                    
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <h3 className="text-xs uppercase text-muted-foreground font-medium mb-1">Instructor</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-3 w-3" />
                          </div>
                          <span className="text-sm">Dr. Professor</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xs uppercase text-muted-foreground font-medium mb-1">Students</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-3 w-3" />
                          </div>
                          <span className="text-sm">{course.enrolledStudents.length}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xs uppercase text-muted-foreground font-medium mb-1">Assignments</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <FileText className="h-3 w-3" />
                          </div>
                          <span className="text-sm">{course.assignments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-64 shrink-0">
                    <h2 className="font-medium mb-2">Your Progress</h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Completed</span>
                        <span className="font-medium">{completedAssignments} / {course.assignments.length}</span>
                      </div>
                      <Progress value={courseProgress} className="h-2" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Complete all assignments to progress through the course.
                    </p>
                    <Link to="#assignments">
                      <Button variant="outline" size="sm" className="w-full">
                        View Assignments
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Course Content */}
          <Tabs defaultValue="overview" className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-lg">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Summary</CardTitle>
                  <CardDescription>Key information about this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Upcoming Deadlines</h3>
                      {course.assignments.length > 0 ? (
                        <div className="space-y-3">
                          {course.assignments.slice(0, 3).map((assignment) => (
                            <Link 
                              key={assignment.id} 
                              to={`/student/assignments/${assignment.id}`}
                              className="block p-3 border rounded-md hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                                  <Calendar className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{assignment.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Course Objectives</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Understand the fundamentals of the subject</li>
                        <li>Apply concepts to real-world scenarios</li>
                        <li>Develop critical thinking skills</li>
                        <li>Master the essential techniques</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-b pb-4">
                        <h3 className="font-medium mb-1">Welcome to the Course</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Welcome to the course! Please review the syllabus and course materials.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Study Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Textbook References
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Additional Resources
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="assignments" id="assignments" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Assignments</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search assignments..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {filteredAssignments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <AssignmentCard 
                      key={assignment.id} 
                      assignment={assignment} 
                      course={course}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg mb-2">No assignments found</CardTitle>
                    <CardDescription>
                      {searchQuery ? "Try adjusting your search criteria" : "No assignments are available for this course yet."}
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="materials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Materials</CardTitle>
                  <CardDescription>Access lecture slides, readings, and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Materials for this course will appear here once they are published by the instructor.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="grades" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Summary</CardTitle>
                  <CardDescription>Your performance in this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Your grades will appear here once assignments have been graded.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default StudentCourse;
