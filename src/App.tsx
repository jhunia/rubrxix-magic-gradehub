
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AIAssistantProvider } from '@/context/AIAssistantContext';

// Import pages
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/student/Dashboard';
import Courses from '@/pages/student/Courses';
import Assignments from '@/pages/student/Assignments';
import Gradebook from '@/pages/student/Gradebook';
import Profile from '@/pages/student/Profile';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import NotFound from '@/pages/NotFound';

// Import lecturer pages
import LecturerDashboard from '@/pages/lecturer/Dashboard';
import LecturerCourses from '@/pages/lecturer/Courses';
import LecturerAssignments from '@/pages/lecturer/Assignments';
import LecturerGrading from '@/pages/lecturer/Grading';

const App = () => {
  return (
    <AIAssistantProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/student/courses" element={<Courses />} />
          <Route path="/student/assignments" element={<Assignments />} />
          <Route path="/student/gradebook" element={<Gradebook />} />
          <Route path="/student/profile" element={<Profile />} />
          
          {/* Lecturer Routes */}
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
          <Route path="/lecturer/courses" element={<LecturerCourses />} />
          <Route path="/lecturer/assignments" element={<LecturerAssignments />} />
          <Route path="/lecturer/grading" element={<LecturerGrading />} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AIAssistantProvider>
  );
};

export default App;
