
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Upload, 
  Check, 
  AlertTriangle,
  Search,
  Info
} from 'lucide-react';
import { 
  mockUsers, 
  getAssignmentById, 
  getCourseById, 
  getSubmissionById
} from '@/utils/mockData';

const Assignment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Using mock data - in a real app, this would come from authentication and API
  const student = mockUsers.find(user => user.role === 'student');
  const assignment = id ? getAssignmentById(id) : undefined;
  const course = assignment ? getCourseById(assignment.courseId) : undefined;
  const submission = id && student 
    ? assignment?.submissions.find(s => s.studentId === student.id)
    : undefined;
  
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [plagiarismChecking, setPlagiarismChecking] = useState(false);
  
  if (!assignment || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          isAuthenticated={true} 
          userRole="student" 
          userName={student?.name}
          userAvatar={student?.profileImage}
        />
        
        <main className="flex-1 py-24 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Assignment not found</h1>
            <Button 
              onClick={() => navigate('/student/dashboard')}
              className="gap-2 bg-rubrxix-blue hover:bg-rubrxix-blue/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  
  const checkPlagiarism = () => {
    if (files.length === 0) {
      toast({
        title: "No files to check",
        description: "Please upload at least one file to check for plagiarism",
        variant: "destructive",
      });
      return;
    }
    
    setPlagiarismChecking(true);
    
    // Simulate plagiarism check
    setTimeout(() => {
      setPlagiarismChecking(false);
      
      toast({
        title: "Plagiarism Check Complete",
        description: "Your submission has been checked and appears to be original.",
      });
    }, 2000);
  };
  
  const handleSubmit = () => {
    if (files.length === 0) {
      toast({
        title: "Missing files",
        description: "Please upload at least one file for your submission",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Submission successful",
        description: "Your assignment has been submitted successfully",
      });
      
      navigate('/student/dashboard');
    }, 1500);
  };
  
  // Check if assignment is past due
  const today = new Date();
  const dueDate = new Date(assignment.dueDate);
  const isPastDue = dueDate < today;
  
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/student/dashboard')}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-rubrxix-blue/10 text-rubrxix-blue border-rubrxix-blue/20">
                    {course.code}
                  </Badge>
                  {isPastDue && !submission && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </Badge>
                  )}
                  {submission && (
                    <Badge variant="outline" className={`flex items-center gap-1 ${
                      submission.status === 'graded' 
                        ? 'bg-green-100 text-green-500 border-green-200' 
                        : 'bg-blue-100 text-rubrxix-blue border-blue-200'
                    }`}>
                      <Check className="h-3 w-3" />
                      {submission.status === 'graded' ? 'Graded' : 'Submitted'}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{assignment.title}</h1>
                <p className="text-muted-foreground">{course.title}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Due: {dueDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Points: {assignment.totalPoints}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{assignment.description}</p>
                </CardContent>
              </Card>
              
              {!submission ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Work</CardTitle>
                    <CardDescription>
                      Upload your files and submit your assignment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium mb-1">Upload Files</p>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to select files
                        </p>
                      </label>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Uploaded Files</h3>
                        <ul className="border rounded-lg divide-y">
                          {files.map((file, index) => (
                            <li key={index} className="p-3 flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                                className="h-8 w-8 text-destructive"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 6L6 18"></path>
                                  <path d="M6 6l12 12"></path>
                                </svg>
                              </Button>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={checkPlagiarism}
                            disabled={plagiarismChecking}
                            className="gap-2"
                          >
                            {plagiarismChecking ? (
                              <>
                                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                Checking...
                              </>
                            ) : (
                              <>
                                <Search className="h-4 w-4" />
                                Check Plagiarism
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Additional Comments</h3>
                      <Textarea
                        placeholder="Add any comments about your submission (optional)"
                        value={comment}
                        onChange={handleCommentChange}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || files.length === 0}
                        className="gap-2 bg-rubrxix-blue hover:bg-rubrxix-blue/90"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            Submit Assignment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Submission</CardTitle>
                    <CardDescription>
                      Submitted on {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Submitted Files</h3>
                      <ul className="border rounded-lg divide-y">
                        {submission.files.map((file) => (
                          <li key={file.id} className="p-3 flex items-center">
                            <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                            <span className="text-sm">{file.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {submission.status === 'graded' && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Feedback</h3>
                        <div className="border rounded-lg p-4 bg-muted/30">
                          <p className="whitespace-pre-line">{submission.feedback}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Your Grade</p>
                              <p className="text-xs text-muted-foreground">Final score</p>
                            </div>
                          </div>
                          <div className="text-2xl font-bold">
                            {submission.grade} / {assignment.totalPoints}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Rubric</CardTitle>
                  <CardDescription>
                    Grading criteria for this assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignment.rubric.map((rubricItem) => (
                    <div key={rubricItem.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{rubricItem.title}</h3>
                        <span className="text-sm">{rubricItem.points} pts</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rubricItem.description}</p>
                      
                      <div className="ml-4 space-y-1">
                        {rubricItem.criteria.map((criteria) => (
                          <div key={criteria.id} className="flex justify-between text-sm">
                            <span>• {criteria.description}</span>
                            <span>{criteria.points} pts</span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator className="my-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">Need Help?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have questions about this assignment, you can use our AI Assistant for guidance.
                  </p>
                  <Button 
                    className="w-full gap-2 bg-rubrxix-blue hover:bg-rubrxix-blue/90"
                    onClick={() => {
                      // This would normally trigger the AI Assistant with context
                      // For now, we'll just simulate it
                      const aiAssistantElement = document.querySelector('[aria-label="AI Assistant"]');
                      if (aiAssistantElement) {
                        (aiAssistantElement as HTMLElement).click();
                      }
                    }}
                  >
                    <Brain className="h-4 w-4" />
                    Ask AI Assistant
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Assignment;
