
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  PlusCircle, 
  Filter, 
  Search, 
  FileText, 
  Clock, 
  MoreHorizontal,
  Calendar as CalendarIcon,
  CheckCircle,
  Users,
  BookOpen,
  AlertTriangle,
  AlertCircle,
  Edit,
  Trash,
  ArrowLeft,
  Check,
  PenLine
} from 'lucide-react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { motion } from 'framer-motion';
import { mockUsers, mockCourses, getCoursesByLecturerId } from '@/utils/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Assignment, Submission, RubricItem } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';

const Assignments = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [dayAssignments, setDayAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the lecturer from mock data (in a real app, this would come from auth)
  const lecturer = mockUsers.find(user => user.role === 'lecturer');
  const lecturerCourses = lecturer ? getCoursesByLecturerId(lecturer.id) : [];
  
  const allAssignments = lecturerCourses.flatMap(course => 
    course.assignments.map(assignment => ({
      ...assignment,
      courseTitle: course.title,
      courseCode: course.code,
    }))
  );

  const enhancedAssignments = allAssignments.map((assignment, index) => {
    if (index === 0 && assignment.submissions && assignment.submissions.length > 0) {
      return {
        ...assignment,
        submissions: assignment.submissions.map((submission, sIndex) => 
          sIndex === 0 ? {...submission, plagiarismScore: 85} : submission
        )
      };
    }
    else if (index === 1 && assignment.submissions && assignment.submissions.length > 0) {
      return {
        ...assignment,
        submissions: assignment.submissions.map((submission, sIndex) => 
          sIndex === 0 ? {...submission, grade: assignment.totalPoints, plagiarismScore: 0} : submission
        )
      };
    }
    return assignment;
  });

  // Find the specific assignment when in detail view
  const assignmentWithCourse = id ? lecturerCourses.reduce<{assignment?: Assignment, course?: any}>((result, course) => {
    if (result.assignment) return result;
    
    const foundAssignment = course.assignments.find((a: Assignment) => a.id === id);
    if (foundAssignment) {
      return { 
        assignment: {
          ...foundAssignment,
          courseCode: course.code,
          courseTitle: course.title
        }, 
        course 
      };
    }
    return result;
  }, {}) : { assignment: undefined, course: undefined };
  
  const { assignment, course } = assignmentWithCourse;

  const filteredAssignments = enhancedAssignments.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || assignment.courseId === courseFilter;
    
    return matchesSearch && matchesCourse;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => 
    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  );

  const dueCount = allAssignments.filter(a => new Date(a.dueDate) > new Date()).length;
  const pastDueCount = allAssignments.filter(a => new Date(a.dueDate) <= new Date()).length;
  const publishedCount = allAssignments.filter(a => a.published).length;
  const draftCount = allAssignments.filter(a => !a.published).length;

  useEffect(() => {
    if (selectedDay) {
      const assignmentsOnDay = enhancedAssignments.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return (
          dueDate.getDate() === selectedDay.getDate() &&
          dueDate.getMonth() === selectedDay.getMonth() &&
          dueDate.getFullYear() === selectedDay.getFullYear()
        );
      });
      setDayAssignments(assignmentsOnDay);
    } else {
      setDayAssignments([]);
    }
  }, [selectedDay, enhancedAssignments]);

  const handleDaySelect = (day: Date | undefined) => {
    setSelectedDay(day);
    if (day) {
      const assignmentsOnDay = enhancedAssignments.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        return (
          dueDate.getDate() === day.getDate() &&
          dueDate.getMonth() === day.getMonth() &&
          dueDate.getFullYear() === day.getFullYear()
        );
      });
      
      if (assignmentsOnDay.length > 0) {
        toast({
          title: `${assignmentsOnDay.length} assignment(s) due on ${format(day, 'PPP')}`,
          description: assignmentsOnDay.map(a => a.title).join(', '),
        });
      } else {
        toast({
          title: `No assignments due on ${format(day, 'PPP')}`,
        });
      }
    }
  };

  const assignmentDates = enhancedAssignments.map(a => new Date(a.dueDate));

  const isDayWithAssignment = (day: Date) => {
    return assignmentDates.some(date => 
      date.getDate() === day.getDate() &&
      date.getMonth() === day.getMonth() &&
      date.getFullYear() === day.getFullYear()
    );
  };

  const handleViewAssignment = (assignmentId: string) => {
    navigate(`/lecturer/assignments/${assignmentId}`);
  };

  const handleViewPlagiarism = (assignmentId: string) => {
    const assignment = enhancedAssignments.find(a => a.id === assignmentId);
    if (assignment && assignment.submissions) {
      const highPlagiarismSubmissions = assignment.submissions.filter(s => (s.plagiarismScore || 0) > 70);
      
      if (highPlagiarismSubmissions.length > 0) {
        toast({
          title: "Plagiarism Alert",
          description: `${highPlagiarismSubmissions.length} submission(s) have high plagiarism scores.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "No Plagiarism Detected",
          description: "All submissions for this assignment passed plagiarism checks.",
        });
      }
    }
  };

  const handleDelete = () => {
    toast({
      title: "Assignment Deletion",
      description: "This feature is not yet implemented.",
      variant: "destructive",
    });
  };
  
  const handleGrade = (submissionId: string) => {
    toast({
      title: "Grade Submission",
      description: "This feature will be implemented soon.",
    });
  };
  
  const handleReviewPlagiarism = (submissionId: string) => {
    toast({
      description: "Opening plagiarism review interface...",
      variant: "destructive",
    });
  };

  // For assignment detail view
  if (id) {
    // Look for submissions with potential issues for demo purposes
    const submissionsWithIssues = assignment?.submissions?.filter(s => (s.plagiarismScore || 0) > 70);
    const hasPlagiarism = submissionsWithIssues && submissionsWithIssues.length > 0;
    const totalSubmissions = assignment?.submissions?.length || 0;
    const gradedSubmissions = assignment?.submissions?.filter(s => s.status === 'graded').length || 0;
    
    if (!assignment) {
      return (
        <div className="min-h-screen flex flex-col">
          <Header 
            isAuthenticated={true} 
            userRole="lecturer" 
            userName={lecturer?.name}
            userAvatar={lecturer?.profileImage}
          />
          <main className="flex-1 py-24 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-2xl font-bold mb-4">Assignment Not Found</h1>
              <p className="mb-6">The assignment you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/lecturer/assignments')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assignments
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      );
    }

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
            <div className="mb-8">
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={() => navigate('/lecturer/assignments')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assignments
              </Button>
              
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{assignment.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-blue-200">
                      {assignment.courseCode}
                    </Badge>
                    <span>{assignment.courseTitle}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="destructive" className="gap-2" onClick={handleDelete}>
                    <Trash className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Due Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="font-medium">{format(new Date(assignment.dueDate), 'PP')}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="font-medium">{assignment.totalPoints} points</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="font-medium">
                      {totalSubmissions}/{course?.enrolledStudents.length || 0} students
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Graded</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                      <PenLine className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="font-medium">
                      {gradedSubmissions}/{totalSubmissions} submissions
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Tabs 
                defaultValue="overview" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b">
                  <TabsList className="bg-transparent border-b-0 ml-4 mt-4">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="submissions" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                      Submissions ({totalSubmissions})
                    </TabsTrigger>
                    <TabsTrigger value="rubric" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                      Rubric
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Assignment Description</h2>
                  <div className="prose max-w-none mb-8">
                    <p>{assignment.description}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-md p-4 border border-blue-200 mb-8">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Assignment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Course</p>
                        <p className="text-blue-900">{assignment.courseTitle} ({assignment.courseCode})</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Due Date</p>
                        <p className="text-blue-900">{format(new Date(assignment.dueDate), 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Total Points</p>
                        <p className="text-blue-900">{assignment.totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Status</p>
                        <p className="text-blue-900">{assignment.published ? 'Published' : 'Draft'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {hasPlagiarism && (
                    <div className="bg-red-50 rounded-md p-4 border border-red-200 mb-8">
                      <div className="flex items-center gap-2 text-red-800 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Plagiarism Detected</h3>
                      </div>
                      <p className="text-red-700 mb-4">
                        Our system has detected potential plagiarism in {submissionsWithIssues?.length} submission(s).
                        Please review these submissions carefully.
                      </p>
                      <Button variant="destructive" onClick={() => setActiveTab('submissions')}>
                        Review Submissions
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="submissions" className="p-0">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold mb-2">Student Submissions</h2>
                    <p className="text-muted-foreground">
                      {totalSubmissions} out of {course?.enrolledStudents.length || 0} students have submitted
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Files</TableHead>
                          <TableHead>Plagiarism</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignment.submissions && assignment.submissions.length > 0 ? (
                          assignment.submissions.map((submission, index) => {
                            const student = mockUsers.find(u => u.id === submission.studentId);
                            const plagiarismScore = submission.plagiarismScore || 0;
                            const isPlagiarismDetected = plagiarismScore > 70;
                            
                            return (
                              <TableRow key={submission.id}>
                                <TableCell>
                                  <div className="font-medium">{student?.name || 'Unknown Student'}</div>
                                  <div className="text-sm text-muted-foreground">{student?.email}</div>
                                </TableCell>
                                <TableCell>
                                  {format(new Date(submission.submittedAt), 'PP')}
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      submission.status === 'graded' 
                                        ? 'bg-green-50 hover:bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-blue-50 hover:bg-blue-50 text-blue-700 border-blue-200'
                                    }
                                  >
                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{submission.files.length} file(s)</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {isPlagiarismDetected ? (
                                    <Badge variant="destructive" className="flex items-center gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      High ({plagiarismScore}%)
                                    </Badge>
                                  ) : (
                                    <span className="text-green-600">Low ({plagiarismScore}%)</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {submission.grade !== undefined ? (
                                    <div className="font-medium">
                                      {submission.grade}/{assignment.totalPoints}
                                      {submission.grade === assignment.totalPoints && (
                                        <Badge variant="outline" className="bg-green-50 hover:bg-green-50 text-green-700 border-green-200 ml-2">
                                          Perfect
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">Not graded</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    {isPlagiarismDetected && (
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleReviewPlagiarism(submission.id)}
                                      >
                                        Review Plagiarism
                                      </Button>
                                    )}
                                    <Button 
                                      variant={submission.status === 'graded' ? 'outline' : 'default'} 
                                      size="sm"
                                      onClick={() => handleGrade(submission.id)}
                                    >
                                      {submission.status === 'graded' ? 'Edit Grade' : 'Grade'}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <FileText className="h-10 w-10 mb-2 text-muted-foreground/60" />
                                <p>No submissions yet</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="rubric" className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Grading Rubric</h2>
                  
                  {assignment.rubric && assignment.rubric.length > 0 ? (
                    <div className="space-y-6">
                      {assignment.rubric.map((item: RubricItem) => (
                        <Card key={item.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle>{item.title}</CardTitle>
                              <Badge variant="outline" className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-blue-200">
                                {item.points} points
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{item.description}</p>
                            
                            {item.criteria && item.criteria.length > 0 && (
                              <div className="space-y-2 mt-4">
                                <h4 className="font-medium">Criteria:</h4>
                                <ul className="space-y-2">
                                  {item.criteria.map(criterion => (
                                    <li key={criterion.id} className="flex justify-between gap-4 p-2 border-b">
                                      <span>{criterion.description}</span>
                                      <span className="font-medium">{criterion.points} points</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      <p>No rubric has been defined for this assignment.</p>
                      <Button className="mt-4">Create Rubric</Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
        <AIAssistant />
      </div>
    );
  }

  // Assignment list view (when no ID is provided)
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
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Assignments</h1>
              <p className="text-muted-foreground">Manage all your course assignments</p>
            </div>
            <div className="flex gap-4">
              <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as 'list' | 'calendar')} className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                </TabsList>
              </Tabs>
              <Link to="/lecturer/assignments/new">
                <Button className="gap-2 bg-rubrxix-blue hover:bg-rubrxix-blue/90">
                  <PlusCircle className="h-4 w-4" />
                  Create Assignment
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-rubrxix-blue" />
                    </div>
                    <div className="text-2xl font-bold">{allAssignments.length}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">{publishedCount}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold">{dueCount}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Past Due</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold">{pastDueCount}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search assignments..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select 
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {lecturerCourses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code}: {course.title}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Wrap these TabsContent components within a Tabs component */}
            <Tabs value={selectedView}>
              <TabsContent value="calendar" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="col-span-1 md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg">Assignment Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleDaySelect}
                        className="p-3 pointer-events-auto"
                        modifiers={{
                          withAssignments: assignmentDates
                        }}
                        modifiersStyles={{
                          withAssignments: {
                            backgroundColor: '#f0f9ff',
                            borderRadius: '0',
                            color: '#0369a1',
                            fontWeight: 'bold'
                          }
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {selectedDay 
                          ? `Assignments Due on ${format(selectedDay, 'PPP')}` 
                          : 'Select a Date to View Assignments'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dayAssignments.length > 0 ? (
                        <div className="space-y-4">
                          {dayAssignments.map(assignment => {
                            const hasPlagiarism = assignment.submissions?.some(s => (s.plagiarismScore || 0) > 70);
                            const hasPerfectScore = assignment.submissions?.some(s => s.grade === assignment.totalPoints);
                            
                            return (
                              <div 
                                key={assignment.id} 
                                className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium text-lg mb-1">{assignment.title}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant="outline" className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-blue-200">
                                        {assignment.courseCode}
                                      </Badge>
                                      <span className="text-sm">{assignment.courseTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{assignment.submissions?.length || 0} submissions</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>{assignment.totalPoints} points</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    {hasPlagiarism && (
                                      <Badge variant="destructive" className="flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Plagiarism Detected
                                      </Badge>
                                    )}
                                    {hasPerfectScore && (
                                      <Badge variant="outline" className="bg-green-50 hover:bg-green-50 text-green-700 border-green-200">
                                        Perfect Score
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-end mt-4 gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => navigate(`/lecturer/assignments/${assignment.id}`)}
                                  >
                                    View Details
                                  </Button>
                                  {hasPlagiarism && (
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleViewPlagiarism(assignment.id)}
                                    >
                                      Review Plagiarism
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : selectedDay ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground/60 mb-4" />
                          <h3 className="text-lg font-medium mb-1">No Assignments Due</h3>
                          <p className="text-muted-foreground">
                            There are no assignments due on {format(selectedDay, 'PPP')}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CalendarIcon className="h-12 w-12 text-muted-foreground/60 mb-4" />
                          <h3 className="text-lg font-medium mb-1">Select a Date</h3>
                          <p className="text-muted-foreground">
                            Click on a date in the calendar to view assignments due on that day
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="pt-2">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAssignments.length > 0 ? (
                        sortedAssignments.map((assignment) => {
                          const course = lecturerCourses.find(c => c.id === assignment.courseId);
                          const isDue = new Date(assignment.dueDate) <= new Date();
                          const submissionCount = assignment.submissions?.length || 0;
                          const totalStudents = course?.enrolledStudents.length || 0;
                          const hasPlagiarism = assignment.submissions?.some(s => (s.plagiarismScore || 0) > 70);
                          const hasPerfectScore = assignment.submissions?.some(s => s.grade === assignment.totalPoints);
                          
                          return (
                            <TableRow key={assignment.id}>
                              <TableCell>
                                <div className="font-medium">{assignment.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {assignment.published ? 'Published' : 'Draft'}
                                </div>
                                {hasPlagiarism && (
                                  <Badge variant="destructive" className="mt-1">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Plagiarism
                                  </Badge>
                                )}
                                {hasPerfectScore && (
                                  <Badge variant="outline" className="bg-green-50 hover:bg-green-50 text-green-700 border-green-200 mt-1 ml-1">
                                    Perfect Score
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-blue-50 hover:bg-blue-50 text-blue-700 border-blue-200">
                                    {assignment.courseCode}
                                  </Badge>
                                  <span className="text-sm">{assignment.courseTitle}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${isDue ? 'bg-red-500' : 'bg-green-500'}`} />
                                  <span>
                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {isDue ? (
                                  <Badge variant="outline" className="bg-red-50 hover:bg-red-50 text-red-700 border-red-200">Past Due</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-50 hover:bg-green-50 text-green-700 border-green-200">Open</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{submissionCount}/{totalStudents}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[160px]">
                                    <DropdownMenuItem onClick={() => navigate(`/lecturer/assignments/${assignment.id}`)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                                    <DropdownMenuItem>View Submissions</DropdownMenuItem>
                                    {hasPlagiarism && (
                                      <DropdownMenuItem 
                                        className="text-red-600"
                                        onClick={() => handleViewPlagiarism(assignment.id)}
                                      >
                                        Review Plagiarism
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="h-10 w-10 mb-2 text-muted-foreground/60" />
                              <p>No assignments found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Assignments;
