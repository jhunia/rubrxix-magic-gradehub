
import React from 'react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import StudentDashboard from '@/components/student/StudentDashboard';
import AIAssistant from '@/components/shared/AIAssistant';
import { 
  mockUsers, 
  mockSubmissions, 
  getCoursesByStudentId 
} from '@/utils/mockData';

const Dashboard = () => {
  // Using mock data - in a real app, this would come from authentication and API
  const student = mockUsers.find(user => user.role === 'student');
  const studentCourses = student ? getCoursesByStudentId(student.id) : [];
  const studentSubmissions = student 
    ? mockSubmissions.filter(submission => submission.studentId === student.id)
    : [];
  
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
          <StudentDashboard 
            courses={studentCourses} 
            submissions={studentSubmissions}
          />
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Dashboard;
