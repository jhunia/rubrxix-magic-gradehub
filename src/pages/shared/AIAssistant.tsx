
import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, X, ChevronDown, ChevronUp, MessageSquare, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types';
import { mockChatMessages } from '@/utils/mockData';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const sendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };
  
  // Simple mock AI responses based on keywords
  const getAIResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('assignment') && lowercaseInput.includes('due')) {
      return "To check when your assignments are due, go to your dashboard or the assignments page. You'll see a list of all upcoming deadlines sorted by date.";
    }
    
    if (lowercaseInput.includes('plagiarism')) {
      return "Our system uses AI to detect potential plagiarism by comparing your work with a database of academic sources and other student submissions. To avoid plagiarism, always cite your sources properly and ensure your work is original.";
    }
    
    if (lowercaseInput.includes('linked list')) {
      return "A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. Unlike arrays, linked lists don't require contiguous memory allocation.\n\nHere's a simple implementation in Java:\n\n```java\nclass Node {\n    int data;\n    Node next;\n    \n    public Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\nclass LinkedList {\n    Node head;\n    \n    public void add(int data) {\n        Node newNode = new Node(data);\n        \n        if (head == null) {\n            head = newNode;\n            return;\n        }\n        \n        Node current = head;\n        while (current.next != null) {\n            current = current.next;\n        }\n        \n        current.next = newNode;\n    }\n}\n```";
    }
    
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
      return "Hello! I'm your AI assistant for rubrxix. How can I help you with your courses, assignments, or any academic questions?";
    }
    
    // Default response
    return "I'm here to help with your academic questions. You can ask me about assignments, course materials, programming concepts, or study strategies.";
  };
  
  // Format message content with code blocks
  const formatMessageContent = (content: string) => {
    if (!content.includes('```')) return content;
    
    const parts = content.split(/(```[a-z]*\n[\s\S]*?```)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const codeContent = part.slice(part.indexOf('\n') + 1, part.lastIndexOf('```'));
            const language = part.slice(3, part.indexOf('\n')).trim();
            
            return (
              <div key={index} className="bg-gray-800 text-gray-200 p-3 rounded my-2 text-sm overflow-x-auto">
                <pre>{codeContent}</pre>
              </div>
            );
          }
          
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };
  
  // Quick topic suggestions
  const quickTopics = [
    "How to write an essay?",
    "What's a binary search?",
    "Help with calculus",
    "Citation formats",
    "Research methods",
    "Study techniques"
  ];
  
  const sendQuickTopic = (topic: string) => {
    setInputValue(topic);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={true} 
        userRole="student" 
      />
      
      <main className="flex-1 py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <div className="h-16 w-16 rounded-full bg-rubrxix-blue/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-rubrxix-blue" />
            </div>
            <h1 className="text-3xl font-bold mb-2">AI Academic Assistant</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Get instant help with your assignments, research, and study materials. Ask any academic question.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="mb-4">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <Input
                      type="text"
                      placeholder="Search previous conversations..."
                      className="mr-2"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                    <Button variant="outline">Search</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground mr-2 mt-1">Popular topics:</span>
                    {quickTopics.map((topic, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => sendQuickTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mb-4">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-lg">Conversation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] px-4 py-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-rubrxix-blue text-white rounded-tr-none' 
                              : 'bg-gray-100 rounded-tl-none'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-line">
                            {formatMessageContent(message.content)}
                          </div>
                          <div className="mt-1 text-xs text-opacity-70 text-right">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] px-4 py-3 rounded-lg bg-gray-100 rounded-tl-none">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                <div className="p-4 border-t">
                  <div className="flex">
                    <Textarea
                      placeholder="Type your question here..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      className="min-h-10 resize-none"
                    />
                    <Button 
                      onClick={sendMessage}
                      className="ml-2 h-10 w-10 p-0 bg-rubrxix-blue hover:bg-rubrxix-blue/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send your message
                  </p>
                </div>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>AI Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-rubrxix-blue/10 flex items-center justify-center mt-0.5">
                        <Bot className="h-3 w-3 text-rubrxix-blue" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Academic Support</h3>
                        <p className="text-xs text-muted-foreground">Get help with assignments and research</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-rubrxix-blue/10 flex items-center justify-center mt-0.5">
                        <Bot className="h-3 w-3 text-rubrxix-blue" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Coding Assistance</h3>
                        <p className="text-xs text-muted-foreground">Help with programming problems</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-rubrxix-blue/10 flex items-center justify-center mt-0.5">
                        <Bot className="h-3 w-3 text-rubrxix-blue" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Study Resources</h3>
                        <p className="text-xs text-muted-foreground">Find study materials and techniques</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-rubrxix-blue/10 flex items-center justify-center mt-0.5">
                        <Bot className="h-3 w-3 text-rubrxix-blue" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Writing Feedback</h3>
                        <p className="text-xs text-muted-foreground">Get feedback on essays and papers</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      This AI assistant is designed to help with academic questions. For administrative support, please contact your instructor or school administration.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIAssistantPage;
