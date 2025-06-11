import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Crown, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsDialogProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  defaultTone: string;
  onDefaultToneChange: (tone: string) => void;
  userProfile: { name: string; email: string };
  onProfileUpdate: (profile: { name: string; email: string }) => void;
}

const SettingsDialog = ({ 
  isDarkMode, 
  onThemeToggle, 
  defaultTone, 
  onDefaultToneChange,
  userProfile,
  onProfileUpdate
}: SettingsDialogProps) => {
  const [profile, setProfile] = useState(userProfile);
  const navigate = useNavigate();

  const handleSaveProfile = () => {
    onProfileUpdate(profile);
  };

  const handlePremiumClick = () => {
    navigate('/premium');
  };

  const tones = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'funny', label: 'Funny' },
    { value: 'creative', label: 'Creative' },
    { value: 'direct', label: 'Direct' },
    { value: 'formal', label: 'Formal' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="border border-pink-500/20 neumorphic">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={onThemeToggle} />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Default Tone</Label>
              <Select value={defaultTone} onValueChange={onDefaultToneChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Sets the default tone for new messages
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Profile Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your account information</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              
              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="premium" className="space-y-6 py-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-medium">Premium Features</h3>
                <p className="text-sm text-muted-foreground">Unlock unlimited possibilities</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Unlimited messages</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Combine multiple tones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span>Advanced AI features</span>
              </div>
            </div>
            
            <Button 
              onClick={handlePremiumClick}
              className="w-full gradient-primary hover:opacity-90"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;