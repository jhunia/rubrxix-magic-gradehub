// api/assignmentApi.ts
import { Assignment } from '@/types/index';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/assignments';

/**
 * Fetch all assignments for a lecturer
 */
export const fetchAssignments = async (lecturerId: string): Promise<Assignment[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${lecturerId}`);
    
    if (!response) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.data;
    console.log('API response:', response.data);
    // eslint-disable-next-line
    return data.map((assignment: any) => ({
      ...assignment,
      dueDate: new Date(assignment.dueDate),
      publishDate: assignment.publishDate ? new Date(assignment.publishDate) : null
    }));
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw new Error('Failed to fetch assignments. Please try again later.');
  }
};

/**
 * Fetch a single assignment by ID
 */
export const fetchAssignmentById = async (id: string): Promise<Assignment> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Assignment not found (ID: ${id})`);
    }

    const data = await response.json();
    return {
      ...data,
      dueDate: new Date(data.dueDate),
      publishDate: data.publishDate ? new Date(data.publishDate) : null
    };
  } catch (error) {
    console.error(`Error fetching assignment ${id}:`, error);
    throw new Error(`Failed to load assignment. ${error instanceof Error ? error.message : ''}`);
  }
};