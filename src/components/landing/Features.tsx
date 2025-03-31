
import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Brain, 
  Search, 
  BarChart, 
  Clock, 
  FileText, 
  CheckCircle, 
  UserCheck
} from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-300 hover:border-blue-100"
    >
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-rubrix-blue/10 text-rubrix-blue mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-medium text-rubrix-blue bg-rubrix-blue/10 py-1 px-3 rounded-full mb-3"
          >
            Features
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Everything you need to streamline grading
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Our platform combines AI technology with intuitive interfaces to make the grading process more efficient and effective.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="AI-Assisted Grading"
            description="Leverage AI to automatically evaluate assignments based on customizable rubrics, saving time while maintaining grading quality."
            delay={0.2}
          />
          <FeatureCard
            icon={<Search className="h-6 w-6" />}
            title="Plagiarism Detection"
            description="Advanced AI algorithms identify potential plagiarism across submitted assignments and external sources."
            delay={0.3}
          />
          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Interactive Rubrics"
            description="Create detailed rubrics with flexible scoring options that make grading consistent and transparent."
            delay={0.4}
          />
          <FeatureCard
            icon={<BarChart className="h-6 w-6" />}
            title="Analytics Dashboard"
            description="Gain insights into student performance trends and grading patterns with comprehensive visualizations."
            delay={0.5}
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6" />}
            title="Automated Workflows"
            description="Streamline the entire assignment cycle from creation to grading with customizable automation."
            delay={0.6}
          />
          <FeatureCard
            icon={<UserCheck className="h-6 w-6" />}
            title="Student Feedback"
            description="Provide detailed, personalized feedback to students with AI-suggested comments and annotations."
            delay={0.7}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-white rounded-2xl p-8 md:p-12 shadow-medium border border-gray-200/50 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rubrix-blue to-rubrix-orange"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">AI Assistant for Students and Lecturers</h3>
              <p className="text-muted-foreground mb-6">
                Our intelligent AI assistant provides real-time support for both students and lecturers, answering questions about assignments, suggesting improvements, and helping with complex topics.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                  <span>24/7 personalized academic support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                  <span>Assignment clarification and guidance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                  <span>Conceptual explanations and examples</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                  <span>Grading assistance for lecturers</span>
                </li>
              </ul>
            </div>
            <div className="relative bg-gray-100 rounded-xl p-4 h-[300px] md:h-[400px] overflow-hidden">
              {/* Chat interface mockup */}
              <div className="absolute inset-0 flex flex-col">
                <div className="bg-white h-12 border-b flex items-center px-4">
                  <div className="h-8 w-8 rounded-full bg-rubrix-blue/20 flex items-center justify-center text-rubrix-blue">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">AI Assistant</div>
                    <div className="text-xs text-green-500">Online</div>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-rubrix-blue text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                      How do I implement a linked list in Java?
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-gray-200 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                      A linked list in Java can be implemented by creating a Node class and a LinkedList class. The Node class should contain data and a reference to the next node. Would you like me to provide a code example?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-rubrix-blue text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                      Yes, please show me a simple example.
                    </div>
                  </div>
                  <div className="flex">
                    <div className="bg-gray-200 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                      <p className="mb-2">Here's a simple implementation of a singly linked list in Java:</p>
                      <div className="bg-gray-800 text-gray-200 p-3 rounded text-xs overflow-x-auto">
                        <pre>{`class Node {
    int data;
    Node next;
    
    public Node(int data) {
        this.data = data;
        this.next = null;
    }
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white h-14 border-t p-2 flex items-center">
                  <input 
                    type="text" 
                    placeholder="Type your question..." 
                    className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rubrix-blue focus:border-transparent"
                  />
                  <button className="ml-2 h-8 w-8 rounded-full bg-rubrix-blue text-white flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
