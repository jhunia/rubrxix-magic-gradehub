
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-rubrxix-blue" />
              <span className="text-xl font-bold">rubrxix</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A modern platform for AI-assisted grading and academic management.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-rubrxix-blue transition-colors"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-rubrxix-blue transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-rubrxix-blue transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/documentation" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-rubrxix-blue transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} rubrxix. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
