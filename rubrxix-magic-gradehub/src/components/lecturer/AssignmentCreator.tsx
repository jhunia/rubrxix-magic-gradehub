
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, Save, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const assignmentSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  courseId: z.string({ required_error: 'Please select a course' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  dueDate: z.date({ required_error: 'Please select a due date' }),
  totalPoints: z.coerce.number().positive({ message: 'Points must be positive' }),
  enableAiGrading: z.boolean().default(true),
  enablePlagiarismCheck: z.boolean().default(true),
  published: z.boolean().default(false),
  attachments: z.array(z.instanceof(File)).optional(),
  rubric: z.array(z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
    description: z.string(),
    points: z.coerce.number().positive({ message: 'Points must be positive' }),
    criteria: z.array(z.object({
      description: z.string().min(2, { message: 'Description must be at least 2 characters' }),
      points: z.coerce.number().positive({ message: 'Points must be positive' }),
    })),
  })).min(1, { message: 'At least one rubric item is required' }),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

interface AssignmentCreatorProps {
  courses: Course[];
}

const AssignmentCreator: React.FC<AssignmentCreatorProps> = ({ courses }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      totalPoints: 100,
      enableAiGrading: true,
      enablePlagiarismCheck: true,
      published: false,
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
            {
              description: 'Demonstrates understanding of concepts',
              points: 25,
            },
          ],
        },
      ],
    },
  });
  
  // Add a new rubric item
  const addRubricItem = () => {
    const currentRubric = form.getValues('rubric');
    form.setValue('rubric', [
      ...currentRubric,
      {
        title: '',
        description: '',
        points: 0,
        criteria: [
          {
            description: '',
            points: 0,
          },
        ],
      },
    ]);
  };
  
  // Remove a rubric item
  const removeRubricItem = (index: number) => {
    const currentRubric = form.getValues('rubric');
    form.setValue('rubric', currentRubric.filter((_, i) => i !== index));
  };
  
  // Add a new criteria to a rubric item
  const addCriteria = (rubricIndex: number) => {
    const currentRubric = form.getValues('rubric');
    const updatedRubric = [...currentRubric];
    updatedRubric[rubricIndex].criteria.push({
      description: '',
      points: 0,
    });
    form.setValue('rubric', updatedRubric);
  };
  
  // Remove a criteria from a rubric item
  const removeCriteria = (rubricIndex: number, criteriaIndex: number) => {
    const currentRubric = form.getValues('rubric');
    const updatedRubric = [...currentRubric];
    updatedRubric[rubricIndex].criteria = updatedRubric[rubricIndex].criteria.filter(
      (_, i) => i !== criteriaIndex
    );
    form.setValue('rubric', updatedRubric);
  };
  
  const onSubmit = (data: AssignmentFormValues) => {
    console.log('Assignment data:', data);
    
    toast({
      title: "Assignment created",
      description: "Your assignment has been created successfully!",
    });
    
    // Redirect back to courses page or assignments list
    navigate('/lecturer/assignments');
  };
  
  const updateTotalPoints = () => {
    const rubric = form.getValues('rubric');
    const calculatedTotal = rubric.reduce((sum, item) => sum + item.points, 0);
    form.setValue('totalPoints', calculatedTotal);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Create New Assignment</h1>
        <p className="text-muted-foreground">Define your assignment details, rubric, and grading criteria</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
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
                            {course.title} ({course.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
              
              <div className="grid grid-cols-2 gap-4">
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
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                              }
                            }}
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
              </div>
              
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
          onChange={(e) => field.onChange(Array.from(e.target.files || []))}
        />
      </FormControl>
    </FormItem>
  )}
/>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Rubric</h3>
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
              
              <div className="space-y-6">
                {form.watch('rubric').map((rubricItem, rubricIndex) => (
                  <div 
                    key={rubricIndex} 
                    className="space-y-4 rounded-lg border p-4"
                  >
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
                                  setTimeout(updateTotalPoints, 100);
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
                        <div 
                          key={criteriaIndex} 
                          className="grid grid-cols-3 gap-3 items-end"
                        >
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
            </div>
          </div>
          
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
    </motion.div>
  );
};

export default AssignmentCreator;
