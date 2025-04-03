
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, BookOpen, FileText, Loader2 } from 'lucide-react';
import { useAIAssistant } from '@/context/AIAssistantContext';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [quickAction, setQuickAction] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    getAssignmentFeedback, 
    getStudyRecommendations 
  } = useAIAssistant();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  };

  const handleQuickAction = async (action: string) => {
    setQuickAction(action);
    if (action === 'feedback') {
      const sampleAssignment = "This is a sample assignment submission. Please provide feedback on structure, content, and areas for improvement.";
      await getAssignmentFeedback(sampleAssignment);
    } else if (action === 'study') {
      const topic = input.trim() || "effective study strategies";
      await getStudyRecommendations(topic);
      setInput('');
    }
    setQuickAction(null);
  };

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opening the assistant
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* AI Assistant Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-rubrix-blue shadow-lg hover:bg-rubrix-blue/90 transition-all"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* AI Assistant Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-6 md:p-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-full max-w-md mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="shadow-xl border-2 border-rubrix-blue/20">
                <CardHeader className="bg-gradient-to-r from-rubrix-blue to-rubrix-orange/60 text-white rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      AI Study Assistant
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <ScrollArea className="h-80 p-4" ref={scrollAreaRef}>
                    {messages.filter(msg => msg.role !== 'system').map((message, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${
                          message.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-rubrix-blue text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <ReactMarkdown className="prose prose-sm">
                              {message.content}
                            </ReactMarkdown>
                          ) : (
                            message.content
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center justify-start mb-4">
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 flex items-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Thinking...
                        </div>
                      </div>
                    )}
                  </ScrollArea>

                  <div className="px-4 py-2 border-t">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Button
                        variant="outline" 
                        size="sm" 
                        className="text-xs flex items-center gap-1"
                        onClick={() => handleQuickAction('feedback')}
                        disabled={isLoading || quickAction !== null}
                      >
                        <FileText className="h-3 w-3" />
                        {quickAction === 'feedback' && isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Assignment Feedback'
                        )}
                      </Button>
                      <Button
                        variant="outline" 
                        size="sm" 
                        className="text-xs flex items-center gap-1"
                        onClick={() => handleQuickAction('study')}
                        disabled={isLoading || quickAction !== null}
                      >
                        <BookOpen className="h-3 w-3" />
                        {quickAction === 'study' && isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          'Study Resources'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                      placeholder="Ask me anything about your studies..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      ref={inputRef}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
