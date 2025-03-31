
import React, { useState } from 'react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { mockUsers, getCoursesByStudentId } from '@/utils/mockData';
import { Course } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useCourseEnrollment } from '@/hooks/use-course-enrollment';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, GraduationCap, Search, UserPlus, Users, Plus, ArrowRight, Check } from 'lucide-react';

const StudentCourses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [enrollSearchQuery, setEnrollSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('my-courses');
  
  // Using mock data - in a real app, this would come from authentication and API
  const student = mockUsers.find(user => user.role === 'student');
  const studentId = student?.id || 'student-1';
  const studentCourses = student ? getCoursesByStudentId(student.id) : [];
  
  // Course enrollment hook
  const { availableCourses, enrollInCourse, isLoading } = useCourseEnrollment({ 
    studentId 
  });
  
  // Apply filters for my courses
  const filteredCourses = studentCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || course.semester === semesterFilter;
    const matchesYear = yearFilter === 'all' || course.year.toString() === yearFilter;
    
    return matchesSearch && matchesSemester && matchesYear;
  });
  
  // Filter available courses for enrollment
  const filteredAvailableCourses = availableCourses.filter(course => 
    course.title.toLowerCase().includes(enrollSearchQuery.toLowerCase()) || 
    course.code.toLowerCase().includes(enrollSearchQuery.toLowerCase())
  );
  
  // Get unique semesters and years for filters
  const semesters = Array.from(new Set(studentCourses.map(course => course.semester)));
  const years = Array.from(new Set(studentCourses.map(course => course.year)));
  
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
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Courses</h1>
              <p className="text-muted-foreground">Manage your courses and enroll in new ones</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Enroll in Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Enroll in a Course</DialogTitle>
                    <DialogDescription>
                      Browse and enroll in available courses below.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="my-4">
                    <div className="relative w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search available courses..."
                        className="pl-8"
                        value={enrollSearchQuery}
                        onChange={(e) => setEnrollSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="h-[400px] overflow-y-auto pr-1">
                    {filteredAvailableCourses.length > 0 ? (
                      <div className="space-y-4">
                        {filteredAvailableCourses.map((course) => (
                          <Card key={course.id} className="hover:shadow-sm transition-shadow">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle>{course.title}</CardTitle>
                                  <CardDescription className="mt-1">{course.code}</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{course.semester} {course.year}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>{course.enrolledStudents.length} Students</span>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button 
                                onClick={() => enrollInCourse(course.id)} 
                                disabled={isLoading}
                                className="w-full"
                              >
                                {isLoading ? 'Enrolling...' : 'Enroll'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No courses found</h3>
                        <p className="text-muted-foreground">
                          {enrollSearchQuery ? "Try adjusting your search criteria" : "No available courses to enroll in."}
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label htmlFor="semester-filter" className="text-sm font-medium mr-2">Semester:</label>
              <select
                id="semester-filter"
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
              >
                <option value="all">All Semesters</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year-filter" className="text-sm font-medium mr-2">Year:</label>
              <select
                id="year-filter"
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="mb-8">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
                
                {filteredCourses.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No courses found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search criteria" : "You haven't enrolled in any courses yet."}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Enroll in Course"]')?.click()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Enroll in a Course
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <CourseListItem key={course.id} course={course} />
                ))}
                
                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No courses found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search criteria" : "You haven't enrolled in any courses yet."}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Enroll in Course"]')?.click()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Enroll in a Course
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription className="mt-1">{course.code}</CardDescription>
          </div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-rubrix-blue/10 text-rubrix-blue">
            <BookOpen className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{course.semester} {course.year}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{course.enrolledStudents.length} Students</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>{course.assignments.length} Assignments</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate(`/student/courses/${course.id}`)}
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
};

const CourseListItem = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium">{course.title}</h3>
          <p className="text-sm text-muted-foreground">{course.code}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{course.semester} {course.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{course.enrolledStudents.length} Students</span>
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>{course.assignments.length} Assignments</span>
          </div>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/student/courses/${course.id}`)}
        >
          View Course
        </Button>
      </div>
    </div>
  );
};

export default StudentCourses;
