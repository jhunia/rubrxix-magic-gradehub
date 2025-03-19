
import React from 'react';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AuthForm from '@/components/auth/AuthForm';

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="w-full max-w-md px-4">
          <AuthForm type="sign-in" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignIn;
