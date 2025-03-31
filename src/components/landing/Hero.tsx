
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, CheckCircle, GraduationCap, BarChart, Eye, Brain } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white pointer-events-none" />
      
      {/* Animated Circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-rubrix-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rubrix-orange/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 pt-36 pb-24 relative z-10">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50 mb-6"
          >
            <span className="bg-rubrix-blue/10 text-rubrix-blue text-xs font-medium px-3 py-1 rounded-full">New</span>
            <span className="text-sm">Introducing AI-powered automatic grading</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6 max-w-4xl"
          >
            Reimagine grading with <span className="text-rubrix-blue">rubrix</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-muted-foreground max-w-2xl mb-8 md:mb-12"
          >
            A modern platform that leverages AI to streamline assignment creation, submission management, and grading for educational institutions.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/sign-up">
              <Button size="lg" className="rounded-full px-8 text-base font-medium bg-rubrix-blue hover:bg-rubrix-blue/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base font-medium border-gray-300 hover:bg-gray-100 transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-medium border border-gray-200/50"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10"></div>
          
          {/* This would be replaced with a real app screenshot */}
          <div className="aspect-[16/9] bg-gradient-to-br from-white to-gray-50 p-6 relative">
            <div className="h-full flex flex-col border rounded-xl overflow-hidden">
              <div className="h-14 bg-white border-b flex items-center px-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto bg-gray-100 h-6 w-1/3 rounded-full"></div>
              </div>
              
              <div className="flex-1 flex">
                <div className="w-64 bg-gray-50 border-r p-4">
                  <div className="h-8 w-32 bg-rubrix-blue/10 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                    <div className="h-6 w-full bg-gray-200 rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                
                <div className="flex-1 p-4">
                  <div className="h-10 w-48 bg-rubrix-blue rounded-lg mb-6"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-white rounded-lg border p-3">
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-5/6 bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-32 bg-white rounded-lg border p-3">
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-5/6 bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-32 bg-white rounded-lg border p-3">
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-5/6 bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-32 bg-white rounded-lg border p-3">
                      <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-full bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-5/6 bg-gray-100 rounded mb-1"></div>
                      <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200/50">
            <CheckCircle className="w-4 h-4 text-rubrix-blue" />
            <span className="text-sm font-medium">AI-Assisted Grading</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200/50">
            <CheckCircle className="w-4 h-4 text-rubrix-blue" />
            <span className="text-sm font-medium">Plagiarism Detection</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200/50">
            <CheckCircle className="w-4 h-4 text-rubrix-blue" />
            <span className="text-sm font-medium">Interactive Rubrics</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200/50">
            <CheckCircle className="w-4 h-4 text-rubrix-blue" />
            <span className="text-sm font-medium">Automated Feedback</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
