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
  
  // Add the new course to the list of courses
  const additionalCourse: Course = {
    id: 'course-4',
    title: 'Introduction to Artificial Intelligence',
    code: 'AI101',
    description: 'Learn the basics of Artificial Intelligence, including machine learning, neural networks, and more.',
    semester: 'Fall',
    year: 2023,
    enrolledStudents: ['student-1', 'student-2'],
    assignments: [],
  };

  // Combine the new course with the existing courses
  const allCourses = [...studentCourses, additionalCourse];

  // Course enrollment hook
  const { availableCourses, enrollInCourse, isLoading } = useCourseEnrollment({ 
    studentId 
  });
  
  // Apply filters for my courses
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || course.semester === semesterFilter;
    const matchesYear = yearFilter === 'all' || course.year.toString() === yearFilter;
    
    return matchesSearch && matchesSemester && matchesYear;
  });
  
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
          </div>
          
          <Tabs defaultValue="grid" className="mb-8">
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

export default StudentCourses;
