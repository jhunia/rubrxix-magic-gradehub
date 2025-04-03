// src/api/courseApi.ts
import axios from 'axios';

// In your fetchInstructorCourses function
export const fetchInstructorCourses = async (instructorId: string) => {
    console.log(`Fetching courses from: /api/courses/instructor/${instructorId}`);
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/instructor/${instructorId}`);
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };


  // src/api/courseApi.ts

import { Course } from '@/types';
const API_BASE_URL = 'http://localhost:5000/api/courses';

// Fetch courses with entry codes (for enrollment)
export const fetchCoursesWithEntryCodes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/with-entry-codes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses with entry codes:', error);
    throw error;
  }
};

// Enroll with entry code
export const enrollWithEntryCode = async (courseNumber: string, studentId: string, entryCode: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${courseNumber}/enroll`, {
      studentId,
      entryCode
    });
    return response.data;
  } catch (error) {
    console.error('Error enrolling with entry code:', error);
    throw error;
  }
};

// Fetch student's enrolled courses
export const fetchStudentCourses = async (studentId: string): Promise<Course[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student courses:', error);
    throw error;
  }
};

// Fetch available courses for enrollment
export const fetchAvailableCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/with-entry-codes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching available courses:', error);
    throw error;
  }
};

// Enroll in a course
export const enrollInCourse = async (
  courseId: string,
  studentId: string,
  entryCode?: string
): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${courseId}/enroll`, {
      studentId,
      entryCode
    });
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};