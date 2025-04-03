
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAIAssistant } from '@/context/AIAssistantContext';
import { Bot, BookOpen, FileText, Loader2 } from 'lucide-react';

const AIStudyTools: React.FC = () => {
  const [assignmentText, setAssignmentText] = useState('');
  const [studyTopic, setStudyTopic] = useState('');
  const { getAssignmentFeedback, getStudyRecommendations, isLoading } = useAIAssistant();

  const handleAssignmentFeedback = async () => {
    if (!assignmentText.trim()) return;
    await getAssignmentFeedback(assignmentText);
  };

  const handleStudyRecommendations = async () => {
    if (!studyTopic.trim()) return;
    await getStudyRecommendations(studyTopic);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Bot className="h-6 w-6 text-rubrix-blue" />
        AI Study Tools
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-rubrix-blue" />
              Assignment Feedback
            </CardTitle>
            <CardDescription>
              Get AI-powered feedback on your assignment drafts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your assignment draft here for feedback..."
              value={assignmentText}
              onChange={(e) => setAssignmentText(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <Button 
              onClick={handleAssignmentFeedback} 
              disabled={isLoading || !assignmentText.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Feedback...
                </>
              ) : (
                'Get Feedback'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rubrix-orange" />
              Study Resources
            </CardTitle>
            <CardDescription>
              Discover tailored study materials and learning strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter a topic (e.g., Linear Algebra, Renaissance Art)"
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleStudyRecommendations} 
              disabled={isLoading || !studyTopic.trim()}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Resources...
                </>
              ) : (
                'Get Study Recommendations'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-medium">Tip:</span> You can also access the AI assistant anytime by clicking the blue bot icon in the bottom right corner of your screen.
        </p>
      </div>
    </div>
  );
};

export default AIStudyTools;
