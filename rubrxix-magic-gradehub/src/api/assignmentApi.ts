// src/api/assignmentApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/assignments';

export const fetchAssignments = async (studentId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

export const fetchAssignmentById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    throw error;
  }
};

export const submitAssignment = async (
  assignmentId: string,
  studentId: string,
  files: File[],
  text: string
) => {
  try {
    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('text', text);
    files.forEach(file => formData.append('files', file));

    const response = await axios.post(
      `${API_BASE_URL}/${assignmentId}/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};