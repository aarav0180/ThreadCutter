
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Heart, Star, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const [showThanks, setShowThanks] = useState(false);
  const navigate = useNavigate();

  const handleCoffeeClick = () => {
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/80 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-pink-500/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Support ThreadCutter
          </h1>
        </div>

        {/* Thank You Message */}
        {showThanks && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-2 text-green-400">
              <Heart className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Thank you for your support! 💚</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Main Support Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-pink-500/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Thank You for Supporting ThreadCutter! 💜
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Your support means the world to me! ✨ Every coffee helps me keep ThreadCutter 
                running and build amazing new features for the community.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Free updates</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Community driven</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                  <Coffee className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Passion project</p>
                </div>
              </div>

              <Button
                onClick={handleCoffeeClick}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Coffee className="w-5 h-5 mr-2" />
                Buy Me a Coffee ☕
              </Button>

              <p className="text-xs text-muted-foreground">
                Click to show your support! (Payment integration coming soon)
              </p>
            </CardContent>
          </Card>

          {/* Premium Suggestion */}
          <Card className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Want to Support Even More?
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Getting ThreadCutter Premium is the most effective way to support the project 
                while unlocking amazing features for yourself!
              </p>
              <Button
                onClick={() => navigate('/premium')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Explore Premium
              </Button>
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card className="bg-card/30 backdrop-blur-sm border-border/30">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <h3 className="text-lg font-semibold mb-2">Built with ❤️ by Aarav</h3>
              <p className="text-sm text-muted-foreground">
                Passionate about creating tools that help creators share their stories 
                and ideas with the world. Thank you for being part of this journey! 🚀
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
