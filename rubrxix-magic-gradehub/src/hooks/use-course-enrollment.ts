
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { mockCourses } from '@/utils/mockData';
import { Course } from '@/types';

interface UseCourseEnrollmentProps {
  studentId: string;
}

export function useCourseEnrollment({ studentId }: UseCourseEnrollmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [allCourses, setAllCourses] = useState<Course[]>(mockCourses);
  
  // Get all available courses (not enrolled)
  const availableCourses = allCourses.filter(
    course => !course.enrolledStudents.includes(studentId)
  );

  const enrollInCourse = async (courseId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the local state
      setAllCourses(prevCourses => 
        prevCourses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              enrolledStudents: [...course.enrolledStudents, studentId]
            };
          }
          return course;
        })
      );
      
      toast({
        title: "Successfully enrolled",
        description: "You've been enrolled in the course",
      });
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast({
        title: "Enrollment failed",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    availableCourses,
    enrollInCourse,
    isLoading
  };
}
