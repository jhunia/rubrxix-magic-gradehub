import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, X, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '@/api/aiApi';
import { toast } from '@/components/ui/use-toast';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
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
    
    try {
      const aiResponse = await getAIResponse([
        ...messages.map(msg => ({
          role: msg.sender,
          content: msg.content
        })),
        { role: 'user', content: inputValue }
      ]);
  
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-5 w-full sm:w-96 z-50"
          >
            <Card className="shadow-medium border border-gray-200 max-h-[500px] flex flex-col">
              <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-rubrix-blue/10 flex items-center justify-center mr-2">
                    <Brain className="h-4 w-4 text-rubrix-blue" />
                  </div>
                  <CardTitle className="text-base">AI Assistant</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                  {messages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Ask me anything about your courses, assignments, or programming concepts.
                    </div>
                  )}
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-rubrix-blue text-white rounded-tr-none' 
                            : 'bg-gray-100 rounded-tl-none'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-line">
                          {formatMessageContent(message.content)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] px-4 py-2 rounded-lg bg-gray-100 rounded-tl-none">
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
              <div className="p-3 border-t">
                <div className="flex">
                  <Textarea
                    placeholder="Type your question..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    className="min-h-10 resize-none"
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={isLoading}
                    className="ml-2 h-10 w-10 p-0 bg-rubrix-blue hover:bg-rubrix-blue/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-5 right-5 h-12 w-12 rounded-full ${
          isOpen ? 'bg-gray-200 text-gray-700' : 'bg-rubrix-blue text-white'
        } flex items-center justify-center shadow-md hover:shadow-lg transition-all z-50`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <ChevronDown className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </>
  );
};

export default AIAssistant;