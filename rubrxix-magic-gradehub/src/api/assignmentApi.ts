// api/assignmentApi.ts
import { Assignment } from '@/types';

export const fetchAssignments = async (lecturerId: string): Promise<Assignment[]> => {
  const response = await fetch(`/api/assignments?lecturerId=${lecturerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }
  return response.json();
};

export const fetchAssignmentById = async (id: string): Promise<Assignment> => {
  const response = await fetch(`/api/assignments/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch assignment ${id}`);
  }
  return response.json();
};