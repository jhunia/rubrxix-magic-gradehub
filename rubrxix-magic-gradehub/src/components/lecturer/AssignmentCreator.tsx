import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, Save, Calendar, Upload, Download, Eye, Edit, BookOpen, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchInstructorCourses } from '@/api/courseApi';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Course } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Enhanced schema with questions and file upload
const assignmentSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  courseId: z.string({ required_error: 'Please select a course' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  dueDate: z.date({ required_error: 'Please select a due date' }),
  totalPoints: z.coerce.number().positive({ message: 'Points must be positive' }),
  enableAiGrading: z.boolean().default(true),
  enablePlagiarismCheck: z.boolean().default(true),
  published: z.boolean().default(false),
  submissionType: z.enum(['text', 'file', 'both']).default('file'),
  questions: z.array(z.object({
    question: z.string().min(2, 'Question must be at least 2 characters'),
    points: z.coerce.number().positive('Points must be positive'),
    modelAnswer: z.string().optional(),
  })).optional(),
  rubric: z.array(z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
    description: z.string(),
    points: z.coerce.number().positive({ message: 'Points must be positive' }),
    criteria: z.array(z.object({
      description: z.string().min(2, { message: 'Description must be at least 2 characters' }),
      points: z.coerce.number().positive({ message: 'Points must be positive' }),
    })),
  })).min(1, { message: 'At least one rubric item is required' }),
  attachments: z.any().optional(), // For file uploads
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface AssignmentCreatorProps {
  courses: Course[];
}

const AssignmentCreator: React.FC<AssignmentCreatorProps> = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState(false);
  const [rubricImportDialog, setRubricImportDialog] = useState(false);
  const [rubricJson, setRubricJson] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      totalPoints: 100,
      enableAiGrading: true,
      enablePlagiarismCheck: true,
      published: false,
      submissionType: 'file',
      questions: [],
      rubric: [
        {
          title: 'Content',
          description: 'Quality of the submitted content',
          points: 50,
          criteria: [
            {
              description: 'Clear and well-organized',
              points: 25,
            },
          ],
        },
      ],
    },
  });

  // Add a new question
  const addQuestion = () => {
    const currentQuestions = form.getValues('questions') || [];
    form.setValue('questions', [
      ...currentQuestions,
      { question: '', points: 10, modelAnswer: '' }
    ]);
  };

  useEffect(() => {
      const fetchCourses = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const user = localStorage.getItem('user');
          const parsedUser = JSON.parse(user); // Parse the string into an object
          const userId = parsedUser.userId;
          if (!userId) {
            navigate('/sign-in');
            return;
          }
          
          const response = await fetchInstructorCourses(userId);
          console.log('Fetched courses:', response);
          // Ensure the response is an array
          if (!Array.isArray(response)) {
            throw new Error('Invalid courses data format received from server');
          }
          
          setCourses(response);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load courses');
        } finally {
          setLoading(false);
        }
      };
  
      fetchCourses();
    }, [navigate]);

  // Remove a question
  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues('questions') || [];
    form.setValue('questions', currentQuestions.filter((_, i) => i !== index));
  };

  // Rubric management functions
  const addRubricItem = () => {
    const currentRubric = form.getValues('rubric');
    form.setValue('rubric', [
      ...currentRubric,
      {
        title: '',
        description: '',
        points: 0,
        criteria: [{ description: '', points: 0 }],
      },
    ]);
  };

  const removeRubricItem = (index: number) => {
    const currentRubric = form.getValues('rubric');
    form.setValue('rubric', currentRubric.filter((_, i) => i !== index));
  };

  const addCriteria = (rubricIndex: number) => {
    const currentRubric = form.getValues('rubric');
    const updatedRubric = [...currentRubric];
    updatedRubric[rubricIndex].criteria.push({
      description: '',
      points: 0,
    });
    form.setValue('rubric', updatedRubric);
  };

  const removeCriteria = (rubricIndex: number, criteriaIndex: number) => {
    const currentRubric = form.getValues('rubric');
    const updatedRubric = [...currentRubric];
    updatedRubric[rubricIndex].criteria = updatedRubric[rubricIndex].criteria.filter(
      (_, i) => i !== criteriaIndex
    );
    form.setValue('rubric', updatedRubric);
  };

  // Handle rubric import
  const handleRubricImport = () => {
    try {
      const parsedRubric = JSON.parse(rubricJson);
      if (Array.isArray(parsedRubric)) {
        form.setValue('rubric', parsedRubric);
        setRubricImportDialog(false);
        toast({
          title: "Rubric imported",
          description: "Your rubric has been imported successfully!",
        });
      } else {
        throw new Error("Invalid rubric format");
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Export current rubric
  const exportRubric = () => {
    const rubric = form.getValues('rubric');
    const rubricJson = JSON.stringify(rubric, null, 2);
    const blob = new Blob([rubricJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rubric-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onSubmit = async (data: AssignmentFormValues) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const instructorId = user.userId; // Get from local storage
      
    if (!instructorId) {
      throw new Error('User not authenticated');
    }

      const formData = new FormData();
      
      // Append all fields except files
      formData.append('title', data.title);
      formData.append('courseId', data.courseId);
      formData.append('description', data.description);
      formData.append('dueDate', data.dueDate.toISOString());
      formData.append('totalPoints', data.totalPoints.toString());
      formData.append('enableAiGrading', data.enableAiGrading.toString());
      formData.append('enablePlagiarismCheck', data.enablePlagiarismCheck.toString());
      formData.append('published', data.published.toString());
      formData.append('submissionType', data.submissionType);
      formData.append('questions', JSON.stringify(data.questions || []));
      formData.append('rubric', JSON.stringify(data.rubric));
      formData.append('instructorId', instructorId); 
  
      // Append files if they exist
      if (data.attachments) {
        Array.from(data.attachments).forEach((file) => {
          formData.append('attachments', file);
        });
      }
  
      const response = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to create assignment');
      }
  
      toast({
        title: "Assignment created",
        description: "Your assignment has been created successfully!",
      });
      navigate('/lecturer/assignments');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create assignment",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 px-10"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Create New Assignment</h1>
          <p className="text-muted-foreground">Define your assignment details, questions, and grading rubric</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setPreviewMode(!previewMode)}
          className="gap-2"
        >
          {previewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="rubric">Rubric</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignment Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter assignment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.courseName} ({course.courseNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter assignment description" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Points</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="submissionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submission Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text Only</SelectItem>
                          <SelectItem value="file">File Upload</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        multiple
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload any supporting files for this assignment
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="enableAiGrading"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable AI Grading</FormLabel>
                        <FormDescription>
                          Let AI assist with initial grading of submissions
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enablePlagiarismCheck"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Plagiarism Check</FormLabel>
                        <FormDescription>
                          Check submissions for potential plagiarism
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Assignment</FormLabel>
                        <FormDescription>
                          Make this assignment visible to students
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Questions</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addQuestion}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {form.watch('questions')?.map((question, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.question`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Question {index + 1}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter question text" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.points`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`questions.${index}.modelAnswer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model Answer (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter model answer" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              {(!form.watch('questions') || form.watch('questions')?.length === 0) && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No questions added yet</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-4 gap-2"
                      onClick={addQuestion}
                    >
                      <Plus className="h-4 w-4" />
                      Add First Question
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-4 gap-2"
                      onClick={addQuestion}
                    >
                      <UploadCloud className="h-4 w-4" />
                      Upload Question
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rubric" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Grading Rubric</h3>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={exportRubric}
                    className="gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setRubricImportDialog(true)}
                    className="gap-1"
                  >
                    <Upload className="h-4 w-4" />
                    Import
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addRubricItem}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {form.watch('rubric').map((rubricItem, rubricIndex) => (
                  <div key={rubricIndex} className="space-y-4 rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <FormField
                          control={form.control}
                          name={`rubric.${rubricIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter section title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {rubricIndex > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRubricItem(rubricIndex)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`rubric.${rubricIndex}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`rubric.${rubricIndex}.points`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Points</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Update total points when rubric points change
                                  const rubric = form.getValues('rubric');
                                  const total = rubric.reduce((sum, item) => sum + item.points, 0);
                                  form.setValue('totalPoints', total);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Criteria</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => addCriteria(rubricIndex)}
                          className="h-7 gap-1 text-xs"
                        >
                          <Plus className="h-3 w-3" />
                          Add Criteria
                        </Button>
                      </div>
                      
                      {rubricItem.criteria.map((_, criteriaIndex) => (
                        <div key={criteriaIndex} className="grid grid-cols-3 gap-3 items-end">
                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name={`rubric.${rubricIndex}.criteria.${criteriaIndex}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Description</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter criteria" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <FormField
                              control={form.control}
                              name={`rubric.${rubricIndex}.criteria.${criteriaIndex}.points`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="text-xs">Points</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="1" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            {rubricItem.criteria.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCriteria(rubricIndex, criteriaIndex)}
                                className="h-10 w-10 text-destructive"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/lecturer/assignments')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-2 bg-rubrix-blue hover:bg-rubrix-blue/90"
            >
              <Save className="h-4 w-4" />
              Create Assignment
            </Button>
          </div>
        </form>
      </Form>

      {/* Rubric Import Dialog */}
      <Dialog open={rubricImportDialog} onOpenChange={setRubricImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Rubric</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your rubric JSON here"
              value={rubricJson}
              onChange={(e) => setRubricJson(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setRubricImportDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleRubricImport}>
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AssignmentCreator;