import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { createCourse } from '@/api/api';
import { CourseFormData, Term, ApiCourseData } from '@/types/index'; // Import your API service
import axios from 'axios';
// import { ApiCourseData } from '@/types/index'; // Import your API data types

export default function NewCourse() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const getUserData = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) throw new Error('No user data found');
      
      const userData = JSON.parse(userString);
      
      // Check common ID field names
      const instructorId = 
        userData.userId || // Some APIs use this
        userData._id; // JWT standard
      
      if (!instructorId) {
        console.error('User data structure:', userData);
        throw new Error('User ID not found in stored data');
      }
      
      return instructorId;
    } catch (error) {
      console.error('Error parsing user data:', error);
      throw new Error('Please log in again - session data invalid');
    }
  };
  const instructorId = getUserData();
  console.log('Instructor ID:', instructorId); // Check the instructor ID
  console.log(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    courseNumber: '',
    courseName: '',
    description: '',
    term: 'Spring' as Term, // Explicitly type the default value
    year: new Date().getFullYear().toString(),
    department: '',
    entryCodeEnabled: false,
    entryCode: '',
    instructor: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    "Computer Science",
    "Mathematics",
    "Economics",
    "Engineering",
    "Physics",
    "Chemistry"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleEntryCode = () => {
    setFormData(prev => ({
      ...prev,
      entryCodeEnabled: !prev.entryCodeEnabled,
      entryCode: !prev.entryCodeEnabled ? generateEntryCode() : ''
    }));
  };

  const generateEntryCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: CourseFormData) => {
      const apiData: ApiCourseData = {
        ...courseData,
        school: {
          name: "Kwame Nkrumah University of Science and Technology (KNUST)",
          code: "KNUST"
        }
      };
      
      const token = localStorage.getItem('token');
      console.log('Token:', localStorage.getItem('token')); // Should show a valid token
      const response = await axios.post('http://localhost:5000/api/courses', apiData) 
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     //   'Authorization': `Bearer ${token}`
    //     },
    //     body: JSON.stringify(apiData)
    //   });
      
    //   if (!response.ok) throw new Error('Failed to create course');
    //   return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Course created successfully",
      });
      navigate('/lecturer/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const courseData: CourseFormData = {
        courseNumber: formData.courseNumber,
        courseName: formData.courseName,
        description: formData.description,
        term: formData.term, // Now properly typed as Term
        year: parseInt(formData.year),
        department: formData.department,
        entryCode: formData.entryCodeEnabled ? formData.entryCode : undefined,
        credits: 3,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
        instructor: instructorId,
      };

      await createCourseMutation.mutateAsync(courseData);
    } finally {
      setIsSubmitting(false);
    }
  };


  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-sm shadow-xl my-5">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create your Course</h1>
        <p className="text-gray-600">Enter your course details below.</p>
        <p className="text-sm text-gray-500 mt-1">* Required field</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="courseNumber">
            Course Number *
          </label>
          <Input
            id="courseNumber"
            name="courseNumber"
            placeholder="e.g., Econ 101"
            value={formData.courseNumber}
            onChange={handleChange}
            className='rounded-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent'
            required
          />
        </div>

        {/* Course Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="courseName">
            Course Name *
          </label>
          <Input
            id="courseName"
            name="courseName"
            placeholder="e.g., Introduction to Macroeconomics"
            value={formData.courseName}
            onChange={handleChange}
            className='rounded-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent'
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="description">
            Course Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your course..."
            className='rounded-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent'
          />
        </div>

        {/* Term and Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Term *</label>
            <Select 
              value={formData.term} 
              onValueChange={(value) => handleSelectChange('term', value)}
            >
              <SelectTrigger className='rounded-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent'>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spring">Spring</SelectItem>
                <SelectItem value="Summer">Summer</SelectItem>
                <SelectItem value="Fall">Fall</SelectItem>
                <SelectItem value="Winter">Winter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="year">
              Year *
            </label>
            <Input
              id="year"
              name="year"
              type="number"
              min="2000"
              max="2100"
              value={formData.year}
              onChange={handleChange}
              className='rounded-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent'
              required
            />
          </div>
        </div>

        {/* School (Fixed) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">School</label>
          <div className="p-3 border rounded-md bg-gray-50">
            <p>Kwame Nkrumah University of Science and Technology (KNUST)</p>
            <p className="text-xs text-gray-500 mt-1">
              If you would like to add this course to a different school, contact us at help@gradescope.com.
            </p>
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Department *</label>
          <Select 
            value={formData.department} 
            onValueChange={(value) => handleSelectChange('department', value)}
            required
          >
            <SelectTrigger className='rounded-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent'>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entry Code */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Student Enrollment</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="entryCodeEnabled"
              checked={formData.entryCodeEnabled}
              onChange={handleToggleEntryCode}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="entryCodeEnabled" className="text-sm">
              Allow students to enroll via course entry code
            </label>
          </div>
          
          {formData.entryCodeEnabled && (
            <div className="mt-2">
              <Input
                id="entryCode"
                name="entryCode"
                value={formData.entryCode}
                onChange={handleChange}
                placeholder="Entry code will be generated"
                className='rounded-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none outline-none focus-visible:ring-transparent focus-visible:ring-offset-transparent'
                readOnly
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/lecturer/dashboard')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
}