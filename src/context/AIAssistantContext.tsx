
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ChatMessage, answerEducationalQuestion, getAssignmentFeedback, getStudyRecommendations } from '@/api/openaiApi';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantContextProps {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  getAssignmentFeedback: (assignmentText: string) => Promise<void>;
  getStudyRecommendations: (topic: string) => Promise<void>;
  clearMessages: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextProps | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: 'I am an AI educational assistant. How can I help you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: ChatMessage = { role: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);
      
      // Get AI response
      const response = await answerEducationalQuestion(message);
      
      // Add AI response
      const aiMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestAssignmentFeedback = async (assignmentText: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: ChatMessage = { 
        role: 'user', 
        content: `Can you provide feedback on my assignment? Here it is: ${assignmentText}` 
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Get AI response
      const response = await getAssignmentFeedback(assignmentText);
      
      // Add AI response
      const aiMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting assignment feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to get assignment feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestStudyRecommendations = async (topic: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: ChatMessage = { 
        role: 'user', 
        content: `Can you recommend study resources and strategies for ${topic}?` 
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Get AI response
      const response = await getStudyRecommendations(topic);
      
      // Add AI response
      const aiMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting study recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to get study recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        role: 'system',
        content: 'I am an AI educational assistant. How can I help you today?'
      }
    ]);
  };

  return (
    <AIAssistantContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        getAssignmentFeedback: requestAssignmentFeedback,
        getStudyRecommendations: requestStudyRecommendations,
        clearMessages,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
