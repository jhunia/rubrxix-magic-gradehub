
import axios from 'axios';

const API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Creating a secure axios instance with the API key
const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    message: ChatMessage;
    finish_reason: string;
    index: number;
  }[];
}

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await openaiClient.post<ChatCompletionResponse>(
      '/chat/completions',
      {
        model: 'gpt-4o', // Using GPT-4o as it's one of the latest models
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response. Please try again.');
  }
};

export const getAssignmentFeedback = async (assignmentText: string): Promise<string> => {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are an educational AI assistant that provides helpful feedback on assignments.'
    },
    {
      role: 'user',
      content: `Please provide constructive feedback on this assignment: ${assignmentText}`
    }
  ];

  return generateAIResponse(messages);
};

export const getStudyRecommendations = async (topic: string): Promise<string> => {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are an educational AI assistant that provides study recommendations.'
    },
    {
      role: 'user',
      content: `Please recommend study resources and strategies for the topic: ${topic}`
    }
  ];

  return generateAIResponse(messages);
};

export const answerEducationalQuestion = async (question: string): Promise<string> => {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful educational AI assistant. Provide clear, concise, and accurate answers to educational questions.'
    },
    {
      role: 'user',
      content: question
    }
  ];

  return generateAIResponse(messages);
};
