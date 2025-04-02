
export type UserRole = 'lecturer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Course {
  id: string;
  courseName: string;
  courseNumber: string;
  description: string;
  lecturerId: string;
  semester: string;
  year: number;
  students: string[]; // Array of student IDs
  assignments: Assignment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  rubric: RubricItem[];
  submissions: Submission[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  // Add the following properties to solve the type errors
  courseCode?: string; // Optional because it might be derived from the course
  courseTitle?: string; // Optional because it might be derived from the course
}

export interface RubricItem {
  id: string;
  title: string;
  description: string;
  points: number;
  criteria: RubricCriteria[];
}

export interface RubricCriteria {
  id: string;
  description: string;
  points: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: Date;
  files: SubmissionFile[];
  status: 'submitted' | 'graded' | 'returned';
  feedback?: string;
  grade?: number;
  plagiarismScore?: number; // 0-100, higher means more likely plagiarized
}

export interface SubmissionFile {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface AIFeedback {
  id: string;
  submissionId: string;
  feedback: string;
  suggestedGrade: number;
  confidence: number; // 0-1
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type Term = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export interface CourseFormData {
  courseNumber: string;
  courseName: string;
  description: string;
  term: Term;
  year: number;
  department: string;
  entryCode?: string;
  credits: number;
  startDate: Date;
  endDate: Date;
  instructor: string;
}

export interface ApiCourseData extends CourseFormData {
  school: {
    name: string;
    code: string;
  };
}