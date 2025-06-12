
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Crown, User, Calendar, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { usePremium } from '@/hooks/usePremium';

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
  const [user, setUser] = useState<any>(null);
  const [premiumExpiry, setPremiumExpiry] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user from auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email) {
        setProfile(prev => ({ ...prev, email: user.email }));
      }
    };
    fetchUser();
  }, []);

  const { isPremium, isLoading } = usePremium(user?.id);

  // Fetch premium expiry date
  useEffect(() => {
    if (!user?.id || !isPremium) return;

    const fetchPremiumExpiry = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('expires_at')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .gte('expires_at', new Date().toISOString())
          .order('expires_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data?.expires_at) {
          setPremiumExpiry(data.expires_at);
        }
      } catch (error) {
        console.error('Error fetching premium expiry:', error);
      }
    };

    fetchPremiumExpiry();
  }, [user?.id, isPremium]);

  const handleSaveProfile = () => {
    onProfileUpdate(profile);
  };

  const handlePremiumClick = () => {
    navigate('/premium');
  };

  const getRemainingDays = () => {
    if (!premiumExpiry) return 0;
    const expiryDate = new Date(premiumExpiry);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
                  value={user?.email || ''}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                  placeholder="No email available"
                />
                <p className="text-xs text-muted-foreground">
                  Email is managed through your account settings
                </p>
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
                <p className="text-sm text-muted-foreground">
                  {isPremium ? 'You have premium access!' : 'Unlock unlimited possibilities'}
                </p>
              </div>
            </div>

            {isPremium ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">Premium Active</span>
                  </div>
                  {premiumExpiry && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {getRemainingDays() > 0 
                          ? `${getRemainingDays()} days remaining` 
                          : 'Expires today'
                        }
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>✅ Unlimited messages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>✅ Multiple tones</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>✅ Priority support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>✅ Advanced AI features</span>
                  </div>
                </div>

                <Button 
                  onClick={handlePremiumClick}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Extend Premium
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
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
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
