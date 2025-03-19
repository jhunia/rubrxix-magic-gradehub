
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
import LecturerDashboard from "./pages/lecturer/Dashboard";
import CreateAssignment from "./pages/lecturer/CreateAssignment";
import StudentDashboard from "./pages/student/Dashboard";
import StudentAssignment from "./pages/student/Assignment";
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
            
            {/* Lecturer Routes */}
            <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
            <Route path="/lecturer/assignments/new" element={<CreateAssignment />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/assignments/:id" element={<StudentAssignment />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
