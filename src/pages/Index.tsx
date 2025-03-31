
import React from 'react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        <Features />
        
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for educators and students</h2>
              <p className="text-xl text-muted-foreground">
                rubrix provides powerful tools for both sides of the educational experience.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-8 shadow-soft border border-gray-200"
              >
                <div className="h-12 w-12 bg-rubrix-blue/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rubrix-blue">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">For Lecturers</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                    <span>Streamline course management and assignment creation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                    <span>AI-assisted grading saves time and ensures consistency</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                    <span>Comprehensive analytics on student performance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-blue mr-2 mt-0.5" />
                    <span>Interactive rubrics for transparent assessment</span>
                  </li>
                </ul>
                <Button className="w-full gap-2 bg-rubrix-blue hover:bg-rubrix-blue/90">
                  Get Started as Lecturer <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-8 shadow-soft border border-gray-200"
              >
                <div className="h-12 w-12 bg-rubrix-orange/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rubrix-orange">
                    <path d="M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"></path>
                    <path d="M6 6h1v1H6z"></path>
                    <path d="M17 6h1v1h-1z"></path>
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <path d="M14 2v3"></path>
                    <path d="M10 2v3"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">For Students</h3>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-orange mr-2 mt-0.5" />
                    <span>Easy assignment submission and tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-orange mr-2 mt-0.5" />
                    <span>Real-time progress monitoring across courses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-orange mr-2 mt-0.5" />
                    <span>Detailed feedback to improve understanding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-rubrix-orange mr-2 mt-0.5" />
                    <span>24/7 AI assistant for academic support</span>
                  </li>
                </ul>
                <Button className="w-full gap-2 bg-rubrix-orange hover:bg-rubrix-orange/90 text-white">
                  Get Started as Student <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your grading experience?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of educators and students who are using rubrix to streamline their academic workflow.
              </p>
              <Button size="lg" className="rounded-full px-8 py-6 text-lg font-medium bg-rubrix-blue hover:bg-rubrix-blue/90 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                Get Started for Free
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
