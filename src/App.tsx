
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";

// Pages
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import LecturerDashboard from "./pages/lecturer/Dashboard";
import Courses from "./pages/lecturer/Courses";
import Assignments from "./pages/lecturer/Assignments";
import CreateAssignment from "./pages/lecturer/CreateAssignment";
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourses from "./pages/student/Courses";
import StudentCourse from "./pages/student/Course";
import StudentAssignment from "./pages/student/Assignment";
import AIAssistantPage from "./pages/shared/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            
            {/* Lecturer Routes */}
            <Route path="/lecturer">
              <Route index element={<Navigate to="/lecturer/dashboard" replace />} />
              <Route path="dashboard" element={<LecturerDashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:courseId/assignments" element={<Assignments />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="assignments/:id" element={<Assignments />} />
              <Route path="assignments/new" element={<CreateAssignment />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Student Routes */}
            <Route path="/student">
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<StudentCourses />} />
              <Route path="courses/:id" element={<StudentCourse />} />
              <Route path="assignments/:id" element={<StudentAssignment />} />
              <Route path="profile" element={<Profile />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Shared Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            
            {/* Redirect legacy paths to new structure */}
            <Route path="/lecturer-dashboard" element={<Navigate to="/lecturer/dashboard" replace />} />
            <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
