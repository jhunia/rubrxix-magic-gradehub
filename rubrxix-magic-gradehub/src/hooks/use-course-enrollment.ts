// src/hooks/use-course-enrollment.ts
import { useState, useEffect } from 'react';
import { 
  fetchStudentCourses, 
  fetchAvailableCourses, 
  enrollInCourse as apiEnrollInCourse 
} from '@/api/courseApi';
import { Course } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface UseCourseEnrollmentProps {
  studentId: string;
}

export const useCourseEnrollment = ({ studentId }: UseCourseEnrollmentProps) => {
  const [studentCourses, setStudentCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const [enrolled, available] = await Promise.all([
        fetchStudentCourses(studentId),
        fetchAvailableCourses()
      ]);
      setStudentCourses(enrolled);
      setAvailableCourses(available);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
      toast({
        title: "Error loading courses",
        description: "Failed to fetch course data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enroll = async (courseId: string, entryCode?: string) => {
    setIsLoading(true);
    try {
      await apiEnrollInCourse(courseId, studentId, entryCode);
      await loadCourses(); // Refresh the course lists
      toast({
        title: "Enrollment Successful",
        description: "You have been enrolled in the course",
        variant: "default",
      });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Enrollment failed';
      setError(message);
      toast({
        title: "Enrollment Failed",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadCourses();
    }
  }, [studentId]);

  return {
    studentCourses,
    availableCourses,
    isLoading,
    error,
    enrollInCourse: enroll,
    refreshCourses: loadCourses
  };
};