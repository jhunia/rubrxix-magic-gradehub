
import React from 'react';
import { Link } from 'react-router-dom';
import { Assignment, Course, Submission } from '@/types';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AssignmentCardProps {
  assignment: Assignment;
  course?: Course;
  studentSubmission?: Submission;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({ 
  assignment, 
  course, 
  studentSubmission 
}) => {
  const { id, title, dueDate, totalPoints } = assignment;
  
  const today = new Date();
  const due = new Date(dueDate);
  const isPastDue = due < today;
  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const isSubmitted = !!studentSubmission;
  const isGraded = studentSubmission?.status === 'graded';
  const submissionGrade = studentSubmission?.grade;
  
  let statusIcon;
  let statusColor;
  
  if (isGraded) {
    statusIcon = <CheckCircle className="h-5 w-5" />;
    statusColor = "bg-green-100 text-green-500";
  } else if (isSubmitted) {
    statusIcon = <CheckCircle className="h-5 w-5" />;
    statusColor = "bg-blue-100 text-rubrxix-blue";
  } else if (isPastDue) {
    statusIcon = <AlertTriangle className="h-5 w-5" />;
    statusColor = "bg-red-100 text-red-500";
  } else {
    statusIcon = <Clock className="h-5 w-5" />;
    statusColor = "bg-orange-100 text-rubrxix-orange";
  }
  
  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-soft transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-full ${statusColor} flex items-center justify-center shrink-0`}>
          {statusIcon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
            <h3 className="font-medium line-clamp-1">{title}</h3>
            
            {course && (
              <Badge variant="outline" className="whitespace-nowrap text-xs font-normal bg-secondary/50">
                {course.code}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
            <span>Points: {totalPoints}</span>
            <span>Due: {due.toLocaleDateString()}</span>
            
            {isGraded && submissionGrade !== undefined && (
              <span className="font-medium text-green-600">
                Grade: {submissionGrade}/{totalPoints}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {!isSubmitted && !isPastDue && (
              <Badge className={`${statusColor} border-0`}>
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
            
            <div className="ml-auto">
              <Link to={`/student/assignments/${id}`}>
                <Button 
                  size="sm" 
                  variant={isSubmitted ? 'outline' : 'default'}
                  className={!isSubmitted ? 'bg-rubrxix-blue hover:bg-rubrxix-blue/90' : ''}
                >
                  {isGraded 
                    ? 'View Feedback' 
                    : isSubmitted 
                      ? 'View Submission' 
                      : 'Submit Assignment'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
