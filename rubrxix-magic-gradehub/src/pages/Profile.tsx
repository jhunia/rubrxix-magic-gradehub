
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/ui/layout/Header';
import Footer from '@/components/ui/layout/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import { mockUsers } from '@/utils/mockData';
import { User } from '@/types';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Briefcase, GraduationCap, Mail, MapPin, Phone, User as UserIcon } from 'lucide-react';

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLecturer = location.pathname.includes('lecturer');
  
  // In a real app, you would fetch this data from an API
  // For now, let's mock the current user based on the route
  const currentUser = mockUsers.find(user => 
    user.role === (isLecturer ? 'lecturer' : 'student')
  ) as User;
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '123-456-7890',
    location: 'San Francisco, CA',
    bio: isLecturer 
      ? 'Professor of Computer Science with 10+ years of teaching experience.' 
      : 'Computer Science student passionate about AI and software development.',
    education: isLecturer 
      ? 'Ph.D. in Computer Science, Stanford University' 
      : 'B.S. Computer Science (In Progress)',
    expertise: isLecturer ? 'Artificial Intelligence, Machine Learning, Data Structures' : 'Programming, Web Development',
    profileImage: currentUser?.profileImage,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, you would save this data to an API
    toast({
      title: "Profile updated successfully",
      description: "Your changes have been saved",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={true} 
        userRole={isLecturer ? 'lecturer' : 'student'} 
        userName={currentUser?.name}
        userAvatar={currentUser?.profileImage}
      />
      
      <main className="flex-1 py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Profile Sidebar */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="mb-6 w-full text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white shadow-md">
                    <AvatarImage src={profileData.profileImage} />
                    <AvatarFallback className="bg-rubrix-blue text-white text-xl">
                      {profileData.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{profileData.name}</h2>
                  <p className="text-sm text-muted-foreground capitalize">{currentUser?.role}</p>
                </div>
                
                <div className="w-full space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.location}</span>
                  </div>
                  {isLecturer ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>Professor</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>Student</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 w-full">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(isLecturer ? '/lecturer/dashboard' : '/student/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Profile Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information and how others see you on the platform.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={profileData.name} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={profileData.email} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={profileData.phone} 
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            value={profileData.location} 
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          rows={4} 
                          value={profileData.bio} 
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="education">Education</Label>
                        <Input 
                          id="education" 
                          name="education" 
                          value={profileData.education} 
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expertise">Areas of Expertise</Label>
                        <Input 
                          id="expertise" 
                          name="expertise" 
                          value={profileData.expertise} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Preferences</CardTitle>
                      <CardDescription>
                        Manage your account settings and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select 
                          id="language" 
                          className="w-full p-2 border rounded-md"
                          defaultValue="english"
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select 
                          id="timezone" 
                          className="w-full p-2 border rounded-md"
                          defaultValue="pst"
                        >
                          <option value="pst">Pacific Time (PST)</option>
                          <option value="est">Eastern Time (EST)</option>
                          <option value="gmt">Greenwich Mean Time (GMT)</option>
                          <option value="cet">Central European Time (CET)</option>
                        </select>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={() => toast({
                        title: "Account preferences updated",
                        description: "Your preferences have been saved",
                      })}>Save Preferences</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Update your password and security preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button onClick={() => toast({
                        title: "Password updated",
                        description: "Your password has been changed successfully",
                      })}>Update Password</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
};

export default Profile;
