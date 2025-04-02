
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GraduationCap, Mail, Lock, User } from 'lucide-react';
import { mockUsers } from '@/utils/mockData';
import { firebaseAuth } from '@/lib/firebase/auth';
import { FirebaseError } from 'firebase/app';
import axios from 'axios';
const signUpSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  role: z.enum(['lecturer', 'student'], { 
    required_error: 'Please select a role' 
  }),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignInFormValues = z.infer<typeof signInSchema>;

interface AuthFormProps {
  type: 'sign-in' | 'sign-up';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const schema = type === 'sign-up' ? signUpSchema : signInSchema;
  const form = useForm<SignUpFormValues | SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: type === 'sign-up' 
      ? { name: '', email: '', password: '', role: 'student' as const }
      : { email: '', password: '' },
  });

  const [loading, setLoading] = useState(false)
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const onSubmit = async (values: SignUpFormValues | SignInFormValues) => {
    try {
      setLoading(true)
      if (type === 'sign-in') {
        const { email, password } = values as SignInFormValues;
        const user = await firebaseAuth.signIn(email, password);
        
        toast({
          title: "Login successful",
          description: `Welcome back!`,
        });

        const response = await axios.get(`http://localhost:5000/api/${user.uid}`);
        const userData = response.data;
  
        if (!userData || !userData.role) {
          throw new Error("User's data or role not found");
        }
        console.log(userData)


        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("test", "hello")
        console.log("userData: " + localStorage.getItem("user"));

  
        // Navigate based on role
        navigate(`/${userData.role}/dashboard`);
        ;
        
      } else {
        setLoading(true)
        const { email, password, name, role } = values as SignUpFormValues;
        const user = await firebaseAuth.signUp(email, password, name);
        
        // Store additional user data in Firestore
        // await addUserToFirestore(user.uid, { name, email, role });

        const userData = {
          userId: user.uid,
          name: name || "GitHub User",
          email: user.email,
          role: role || "", 
        };

        await axios.post("http://localhost:5000/api/users", userData);
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });

        localStorage.setItem("user", JSON.stringify(userData));
        navigate(`/${role}/dashboard`);
      }
    } catch (error) {
      setLoading(false)
      let errorMessage = "An error occurred";
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Email already in use";
            break;
          case 'auth/invalid-email':
            errorMessage = "Invalid email address";
            break;
          case 'auth/weak-password':
            errorMessage = "Password should be at least 6 characters";
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = "Invalid email or password";
            break;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    finally{
      setLoading(false)
    }
  };;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white rounded-xl shadow-soft p-8 border border-gray-200"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto w-12 h-12 flex items-center justify-center bg-rubrix-blue/10 rounded-full mb-4">
          <GraduationCap className="h-6 w-6 text-rubrix-blue" />
        </div>
        <h2 className="text-2xl font-bold">
          {type === 'sign-in' ? 'Sign in to rubrix' : 'Create your account'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {type === 'sign-in' 
            ? 'Enter your credentials to access your account' 
            : 'Join rubrix to streamline your grading experience'}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="Enter your full name" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Enter your email" 
                      type="email" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder={type === 'sign-up' ? 'Create a password' : 'Enter your password'} 
                      type={showPassword ? 'text' : 'password'} 
                      className="pl-10" 
                      {...field} 
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>I am a</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <FormLabel htmlFor="student" className="font-normal cursor-pointer">Student</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lecturer" id="lecturer" />
                        <FormLabel htmlFor="lecturer" className="font-normal cursor-pointer">Lecturer</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {type === 'sign-in' && (
            <div className="flex justify-end">
              <a 
                href="#" 
                className="text-sm text-rubrix-blue hover:underline"
              >
                Forgot password?
              </a>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-rubrix-blue hover:bg-rubrix-blue/90 text-white transition-all duration-300"
          >
            {loading ? 'loading...' : type === 'sign-in' ? 'Sign In' : 'Create Account'}
            
          </Button>
        </form>
      </Form>
      
      <div className="mt-8 text-center text-sm">
        {type === 'sign-in' ? (
          <p>
            Don't have an account?{' '}
            <a href="/sign-up" className="text-rubrix-blue hover:underline font-medium">
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a href="/sign-in" className="text-rubrix-blue hover:underline font-medium">
              Sign in
            </a>
          </p>
        )}
      </div>
      
      {/* For demo purposes - quick login */}
      {type === 'sign-in' && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-muted-foreground mb-3">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                form.setValue('email', 'jane.smith@university.edu');
                form.setValue('password', 'password123');
              }}
              className="text-xs h-9"
            >
              Lecturer Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                form.setValue('email', 'alex.thompson@university.edu');
                form.setValue('password', 'password123');
              }}
              className="text-xs h-9"
            >
              Student Demo
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AuthForm;
