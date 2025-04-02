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