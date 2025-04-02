
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Course } from '@/types';
import { BookOpen, Users, FileText, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
  index: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index }) => {
  const { id, courseName, courseNumber, description, students, assignments } = course;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden hover:shadow-medium transition-all duration-300"
    >
      <div className="h-3 bg-gradient-to-r from-rubrix-blue to-rubrix-blue/70"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className="mb-2 bg-rubrix-blue/5 text-rubrix-blue border-rubrix-blue/20">
              {courseNumber}
            </Badge>
            <h3 className="text-xl font-semibold mb-2 line-clamp-1">{courseName}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to={`/lecturer/courses/${id}`} className="flex w-full">
                  View Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/lecturer/courses/${id}/edit`} className="flex w-full">
                  Edit Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to={`/lecturer/courses/${id}/assignments/new`} className="flex w-full">
                  Add Assignment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{students?.length} students</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-1" />
              <span>{assignments?.length} assignments</span>
            </div>
          </div>
          
          <Link to={`/lecturer/courses/${id}`}>
            <Button variant="ghost" size="sm" className="text-rubrix-blue hover:text-rubrix-blue/90 hover:bg-rubrix-blue/10">
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
