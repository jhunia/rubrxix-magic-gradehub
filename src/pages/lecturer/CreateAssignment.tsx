
import React from 'react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AssignmentCreator from '@/components/lecturer/AssignmentCreator';
import AIAssistant from '@/components/shared/AIAssistant';
import { mockUsers, getCoursesByLecturerId } from '@/utils/mockData';

const CreateAssignment = () => {
  // Using mock data - in a real app, this would come from authentication and API
  const lecturer = mockUsers.find(user => user.role === 'lecturer');
  const lecturerCourses = lecturer ? getCoursesByLecturerId(lecturer.id) : [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={true} 
        userRole="lecturer" 
        userName={lecturer?.name}
        userAvatar={lecturer?.profileImage}
      />
      
      <main className="flex-1 py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <AssignmentCreator courses={lecturerCourses} />
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default CreateAssignment;
