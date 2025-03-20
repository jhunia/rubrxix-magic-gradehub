
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon,
  Users, 
  FileText,
  Edit,
  Trash,
  ArrowLeft,
  Check,
  AlertTriangle,
  PenLine
} from 'lucide-react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { mockUsers, mockCourses, getCoursesByLecturerId } from '@/utils/mockData';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Assignment, Submission, RubricItem } from '@/types';

const AssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the lecturer from mock data (in a real app, this would come from auth)
  const lecturer = mockUsers.find(user => user.role === 'lecturer');
  const lecturerCourses = lecturer ? getCoursesByLecturerId(lecturer.id) : [];
  
  // Find the assignment across all courses
  const assignmentWithCourse = lecturerCourses.reduce<{assignment?: Assignment, course?: any}>((result, course) => {
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
  }, {});
  
  const { assignment, course } = assignmentWithCourse;
  
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

  // Look for submissions with potential issues for demo purposes
  const submissionsWithIssues = assignment.submissions?.filter(s => (s.plagiarismScore || 0) > 70);
  const hasPlagiarism = submissionsWithIssues && submissionsWithIssues.length > 0;
  const totalSubmissions = assignment.submissions?.length || 0;
  const gradedSubmissions = assignment.submissions?.filter(s => s.status === 'graded').length || 0;
  
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
};

export default AssignmentPage;
