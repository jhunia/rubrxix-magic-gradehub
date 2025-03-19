import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { mockUsers, mockAssignments, mockSubmissions, getCourseById } from '@/utils/mockData';
import { Assignment, Submission, RubricItem } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  Download,
  BookOpen,
  MessageSquare,
  Brain,
  X
} from 'lucide-react';

const StudentAssignment = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('instructions');
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const student = mockUsers.find(user => user.role === 'student');
  const assignment = mockAssignments.find(a => a.id === id);
  const studentSubmission = student && assignment 
    ? mockSubmissions.find(s => s.assignmentId === assignment.id && s.studentId === student.id)
    : undefined;
  
  if (!assignment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          isAuthenticated={true} 
          userRole="student" 
          userName={student?.name}
          userAvatar={student?.profileImage}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Assignment not found</h1>
            <p className="text-muted-foreground mb-4">The assignment you're looking for doesn't exist or you don't have access to it.</p>
            <Link to="/student/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const course = getCourseById(assignment.courseId);
  
  const today = new Date();
  const dueDate = new Date(assignment.dueDate);
  const isPastDue = dueDate < today;
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const isSubmitted = !!studentSubmission;
  const isGraded = studentSubmission?.status === 'graded';
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Assignment submitted successfully!');
      setSelectedFiles([]);
      setSubmissionText('');
      setFileInputKey(Date.now());
    }, 1500);
  };
  
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
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {course && (
                    <>
                      <Link to="/student/courses" className="text-sm text-rubrxix-blue hover:underline">
                        Courses
                      </Link>
                      <span className="text-sm text-muted-foreground">/</span>
                      <Link to={`/student/courses/${course.id}`} className="text-sm text-rubrxix-blue hover:underline">
                        {course.title}
                      </Link>
                      <span className="text-sm text-muted-foreground">/</span>
                    </>
                  )}
                  <span className="text-sm font-medium truncate">{assignment.title}</span>
                </div>
                <h1 className="text-3xl font-bold">{assignment.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-100 border-0 text-blue-700">
                    {course?.code || 'Course'}
                  </Badge>
                  
                  {!isSubmitted && !isPastDue && (
                    <Badge className="bg-orange-100 text-orange-700 border-0">
                      {daysUntilDue === 0 
                        ? 'Due today' 
                        : `Due in ${daysUntilDue} ${daysUntilDue === 1 ? 'day' : 'days'}`}
                    </Badge>
                  )}
                  
                  {!isSubmitted && isPastDue && (
                    <Badge variant="destructive">
                      Overdue
                    </Badge>
                  )}
                  
                  {isSubmitted && !isGraded && (
                    <Badge variant="secondary" className="bg-blue-100 text-rubrxix-blue border-0">
                      Submitted
                    </Badge>
                  )}
                  
                  {isGraded && (
                    <Badge variant="secondary" className="bg-green-100 text-green-500 border-0">
                      Graded
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                {isGraded && studentSubmission?.grade !== undefined && (
                  <div className="bg-white rounded-md border p-3 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Your Grade</p>
                    <div className="text-2xl font-bold">
                      {studentSubmission.grade} / {assignment.totalPoints}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xs uppercase text-muted-foreground font-medium mb-1">Due Date</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                            <Calendar className="h-3 w-3 text-orange-600" />
                          </div>
                          <span className="text-sm">{dueDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xs uppercase text-muted-foreground font-medium mb-1">Points</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm">{assignment.totalPoints}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xs uppercase text-muted-foreground font-medium mb-1">Status</h3>
                        <div className="flex items-center gap-2">
                          {isGraded ? (
                            <>
                              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              </div>
                              <span className="text-sm">Graded</span>
                            </>
                          ) : isSubmitted ? (
                            <>
                              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-blue-600" />
                              </div>
                              <span className="text-sm">Submitted</span>
                            </>
                          ) : isPastDue ? (
                            <>
                              <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                              </div>
                              <span className="text-sm">Overdue</span>
                            </>
                          ) : (
                            <>
                              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-orange-600" />
                              </div>
                              <span className="text-sm">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="instructions" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="rubric">Rubric</TabsTrigger>
                  <TabsTrigger value="submission">Submission</TabsTrigger>
                  <TabsTrigger value="feedback" disabled={!isGraded}>Feedback</TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assignment Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose max-w-none">
                        <p>{assignment.description}</p>
                        
                        <h3 className="text-lg font-medium mt-6 mb-2">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Complete all sections of the assignment</li>
                          <li>Follow the formatting guidelines</li>
                          <li>Submit your work before the deadline</li>
                          <li>Properly cite all sources used</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mt-6 mb-2">Submission Guidelines</h3>
                        <p>Please submit your work in one of the following formats:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>PDF document (.pdf)</li>
                          <li>Word document (.docx)</li>
                          <li>Text file (.txt)</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="mr-2 h-4 w-4" />
                          Download Assignment Template
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Reference Materials
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="rubric" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Grading Rubric</CardTitle>
                      <CardDescription>This is how your assignment will be evaluated</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {assignment.rubric.map((rubricItem: RubricItem) => (
                          <div key={rubricItem.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{rubricItem.title}</h3>
                              <Badge variant="outline">{rubricItem.points} pts</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{rubricItem.description}</p>
                            
                            <div className="space-y-3">
                              {rubricItem.criteria.map((criteria) => (
                                <div key={criteria.id} className="flex justify-between text-sm">
                                  <span>{criteria.description}</span>
                                  <span className="font-medium">{criteria.points} pts</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="submission" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Your Work</CardTitle>
                      <CardDescription>
                        {isSubmitted 
                          ? "You have already submitted this assignment. You can view your submission below."
                          : "Upload your files and add any comments for your submission."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isSubmitted ? (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Submitted Files</h3>
                            <div className="space-y-2">
                              {studentSubmission?.files.map((file) => (
                                <div key={file.id} className="flex items-center justify-between border rounded-md p-3">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">{file.name}</span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-2">Submission Date</h3>
                            <p className="text-sm text-muted-foreground">
                              {studentSubmission?.submittedAt.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div>
                            <Label htmlFor="files">Upload Files</Label>
                            <div className="mt-2 border-2 border-dashed rounded-md p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Drag and drop your files here, or click to browse
                              </p>
                              <input
                                id="files"
                                type="file"
                                key={fileInputKey}
                                className="hidden"
                                onChange={handleFileChange}
                                multiple
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('files')?.click()}
                                className="mt-2"
                              >
                                Browse Files
                              </Button>
                            </div>
                            
                            {selectedFiles.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h3 className="text-sm font-medium">Selected Files</h3>
                                {selectedFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between border rounded-md p-3">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                      <span className="text-sm">{file.name}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removeFile(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="comments">Comments (Optional)</Label>
                            <Textarea
                              id="comments"
                              placeholder="Add any comments or notes for your instructor..."
                              className="mt-2"
                              value={submissionText}
                              onChange={(e) => setSubmissionText(e.target.value)}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            disabled={selectedFiles.length === 0 || isSubmitting}
                            className="w-full bg-rubrxix-blue hover:bg-rubrxix-blue/90"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Assignment"}
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="feedback" className="space-y-6">
                  {isGraded ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Instructor Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-sm font-medium mb-2">Grade</h3>
                            <div className="flex items-center gap-2">
                              <div className="text-xl font-bold">
                                {studentSubmission?.grade} / {assignment.totalPoints}
                              </div>
                              <Progress 
                                value={(studentSubmission?.grade || 0) / assignment.totalPoints * 100} 
                                className="h-2 w-32" 
                              />
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-2">Comments</h3>
                            <div className="border rounded-md p-4 bg-muted/30">
                              <p className="text-sm whitespace-pre-line">
                                {studentSubmission?.feedback || "No feedback provided."}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-sm font-medium mb-2">Rubric Evaluation</h3>
                            <div className="space-y-3">
                              {assignment.rubric.map((rubricItem) => (
                                <div key={rubricItem.id} className="border rounded-md p-3">
                                  <div className="flex justify-between">
                                    <h4 className="text-sm font-medium">{rubricItem.title}</h4>
                                    <span className="text-sm">
                                      {Math.floor(Math.random() * (rubricItem.points + 1))} / {rubricItem.points}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <MessageSquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg mb-2">No Feedback Yet</CardTitle>
                        <CardDescription>
                          Your instructor hasn't provided feedback on this assignment yet.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI assistant can help you understand the assignment requirements and guide you through the process.
                  </p>
                  
                  <Button className="w-full gap-2 bg-rubrxix-blue hover:bg-rubrxix-blue/90">
                    <Brain className="h-4 w-4" />
                    Ask AI Assistant
                  </Button>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Other Resources</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact Instructor
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Course Materials
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default StudentAssignment;
