
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Lecturer Routes */}
            <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
            <Route path="/lecturer/courses" element={<Courses />} />
            <Route path="/lecturer/assignments" element={<Assignments />} />
            <Route path="/lecturer/assignments/new" element={<CreateAssignment />} />
            <Route path="/lecturer/profile" element={<Profile />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/courses/:id" element={<StudentCourse />} />
            <Route path="/student/assignments/:id" element={<StudentAssignment />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/ai-assistant" element={<AIAssistantPage />} />
            
            {/* Shared Routes */}
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
