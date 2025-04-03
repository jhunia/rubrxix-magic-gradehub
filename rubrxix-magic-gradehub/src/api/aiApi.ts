// src/api/aiApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/ai';

export const getAIResponse = async (messages: { role: string; content: string }[]) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { messages });
      
      if (!response.data?.response) {
        throw new Error("Invalid response format from server");
      }
      
      return response.data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Return a friendly fallback message
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  };