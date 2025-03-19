
import { User, Course, Assignment, Submission, ChatMessage } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'lecturer-1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@university.edu',
    role: 'lecturer',
    profileImage: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'lecturer-2',
    name: 'Prof. David Johnson',
    email: 'david.johnson@university.edu',
    role: 'lecturer',
    profileImage: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'student-1',
    name: 'Alex Thompson',
    email: 'alex.thompson@university.edu',
    role: 'student',
    profileImage: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: 'student-2',
    name: 'Maya Rodriguez',
    email: 'maya.rodriguez@university.edu',
    role: 'student',
    profileImage: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 'student-3',
    name: 'James Wilson',
    email: 'james.wilson@university.edu',
    role: 'student',
    profileImage: 'https://i.pravatar.cc/150?img=5',
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'A foundational course covering basic programming concepts and computational thinking.',
    lecturerId: 'lecturer-1',
    semester: 'Fall',
    year: 2023,
    enrolledStudents: ['student-1', 'student-2', 'student-3'],
    assignments: [],
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2023-08-15'),
  },
  {
    id: 'course-2',
    title: 'Data Structures and Algorithms',
    code: 'CS201',
    description: 'An intermediate course exploring fundamental data structures and algorithm design principles.',
    lecturerId: 'lecturer-1',
    semester: 'Fall',
    year: 2023,
    enrolledStudents: ['student-1', 'student-3'],
    assignments: [],
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2023-08-20'),
  },
  {
    id: 'course-3',
    title: 'Machine Learning Fundamentals',
    code: 'CS330',
    description: 'Introduction to machine learning concepts, algorithms, and applications.',
    lecturerId: 'lecturer-2',
    semester: 'Fall',
    year: 2023,
    enrolledStudents: ['student-2'],
    assignments: [],
    createdAt: new Date('2023-08-25'),
    updatedAt: new Date('2023-08-25'),
  },
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    courseId: 'course-1',
    title: 'Programming Basics in Python',
    description: 'Write simple Python programs to demonstrate understanding of variables, control structures, and functions.',
    dueDate: new Date('2023-09-30'),
    totalPoints: 100,
    rubric: [
      {
        id: 'rubric-1',
        title: 'Code Implementation',
        description: 'Correctness of code implementation',
        points: 60,
        criteria: [
          { id: 'criteria-1', description: 'All code runs without errors', points: 20 },
          { id: 'criteria-2', description: 'Implements all required functions', points: 20 },
          { id: 'criteria-3', description: 'Follows good programming practices', points: 20 },
        ],
      },
      {
        id: 'rubric-2',
        title: 'Documentation',
        description: 'Quality of code documentation',
        points: 40,
        criteria: [
          { id: 'criteria-4', description: 'Code is commented appropriately', points: 20 },
          { id: 'criteria-5', description: 'README file is complete', points: 20 },
        ],
      },
    ],
    submissions: [],
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2023-09-01'),
    published: true,
  },
  {
    id: 'assignment-2',
    courseId: 'course-2',
    title: 'Implementing Linked Lists',
    description: 'Implement a doubly linked list in Java with various operations and demonstrate its use.',
    dueDate: new Date('2023-10-15'),
    totalPoints: 100,
    rubric: [
      {
        id: 'rubric-3',
        title: 'Implementation',
        description: 'Correctness and efficiency of implementation',
        points: 70,
        criteria: [
          { id: 'criteria-6', description: 'Linked list implementation is correct', points: 40 },
          { id: 'criteria-7', description: 'All required operations are implemented', points: 30 },
        ],
      },
      {
        id: 'rubric-4',
        title: 'Testing',
        description: 'Quality of test cases',
        points: 30,
        criteria: [
          { id: 'criteria-8', description: 'Comprehensive test cases are provided', points: 30 },
        ],
      },
    ],
    submissions: [],
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15'),
    published: true,
  },
];

// Mock Submissions
export const mockSubmissions: Submission[] = [
  {
    id: 'submission-1',
    assignmentId: 'assignment-1',
    studentId: 'student-1',
    submittedAt: new Date('2023-09-28'),
    files: [
      {
        id: 'file-1',
        name: 'assignment1.py',
        url: '/mock-files/assignment1.py',
        type: 'text/x-python',
      },
      {
        id: 'file-2',
        name: 'README.md',
        url: '/mock-files/readme.md',
        type: 'text/markdown',
      },
    ],
    status: 'graded',
    feedback: 'Good work! Your solution is efficient and well-documented.',
    grade: 92,
    plagiarismScore: 5,
  },
  {
    id: 'submission-2',
    assignmentId: 'assignment-1',
    studentId: 'student-2',
    submittedAt: new Date('2023-09-29'),
    files: [
      {
        id: 'file-3',
        name: 'solution.py',
        url: '/mock-files/solution.py',
        type: 'text/x-python',
      },
    ],
    status: 'graded',
    feedback: 'Your code works correctly but could use more comments.',
    grade: 85,
    plagiarismScore: 8,
  },
  {
    id: 'submission-3',
    assignmentId: 'assignment-2',
    studentId: 'student-1',
    submittedAt: new Date('2023-10-14'),
    files: [
      {
        id: 'file-4',
        name: 'LinkedList.java',
        url: '/mock-files/LinkedList.java',
        type: 'text/x-java',
      },
      {
        id: 'file-5',
        name: 'LinkedListTest.java',
        url: '/mock-files/LinkedListTest.java',
        type: 'text/x-java',
      },
    ],
    status: 'submitted',
  },
];

// Update mock courses with assignments
mockCourses.forEach(course => {
  course.assignments = mockAssignments.filter(assignment => assignment.courseId === course.id);
});

// Update mock assignments with submissions
mockAssignments.forEach(assignment => {
  assignment.submissions = mockSubmissions.filter(submission => submission.assignmentId === assignment.id);
});

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    content: 'How do I implement a linked list in Java?',
    timestamp: new Date('2023-10-10T14:30:00'),
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    content: 'A linked list in Java can be implemented by creating a Node class and a LinkedList class. The Node class should contain data and a reference to the next node. Would you like me to provide a code example?',
    timestamp: new Date('2023-10-10T14:30:10'),
  },
  {
    id: 'msg-3',
    sender: 'user',
    content: 'Yes, please show me a simple example.',
    timestamp: new Date('2023-10-10T14:31:00'),
  },
  {
    id: 'msg-4',
    sender: 'assistant',
    content: 'Here\'s a simple implementation of a singly linked list in Java:\n\n```java\nclass Node {\n    int data;\n    Node next;\n    \n    public Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\nclass LinkedList {\n    Node head;\n    \n    public void insert(int data) {\n        Node newNode = new Node(data);\n        \n        if (head == null) {\n            head = newNode;\n            return;\n        }\n        \n        Node last = head;\n        while (last.next != null) {\n            last = last.next;\n        }\n        \n        last.next = newNode;\n    }\n    \n    public void display() {\n        Node current = head;\n        while (current != null) {\n            System.out.print(current.data + " ");\n            current = current.next;\n        }\n        System.out.println();\n    }\n}\n```\n\nTo use this linked list, you can create an instance of LinkedList and call its methods:\n\n```java\nLinkedList list = new LinkedList();\nlist.insert(1);\nlist.insert(2);\nlist.insert(3);\nlist.display(); // Outputs: 1 2 3\n```',
    timestamp: new Date('2023-10-10T14:31:30'),
  },
];

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get course by ID
export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

// Helper function to get assignment by ID
export const getAssignmentById = (id: string): Assignment | undefined => {
  return mockAssignments.find(assignment => assignment.id === id);
};

// Helper function to get submission by ID
export const getSubmissionById = (id: string): Submission | undefined => {
  return mockSubmissions.find(submission => submission.id === id);
};

// Helper function to get courses by lecturer ID
export const getCoursesByLecturerId = (lecturerId: string): Course[] => {
  return mockCourses.filter(course => course.lecturerId === lecturerId);
};

// Helper function to get courses by student ID
export const getCoursesByStudentId = (studentId: string): Course[] => {
  return mockCourses.filter(course => course.enrolledStudents.includes(studentId));
};

// Helper function to get assignments by course ID
export const getAssignmentsByCourseId = (courseId: string): Assignment[] => {
  return mockAssignments.filter(assignment => assignment.courseId === courseId);
};

// Helper function to get submissions by student ID
export const getSubmissionsByStudentId = (studentId: string): Submission[] => {
  return mockSubmissions.filter(submission => submission.studentId === studentId);
};

// Helper function to get submissions by assignment ID
export const getSubmissionsByAssignmentId = (assignmentId: string): Submission[] => {
  return mockSubmissions.filter(submission => submission.assignmentId === assignmentId);
};
