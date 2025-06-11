
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/80">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-lg text-white">TC</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            ThreadCutter
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" className="text-foreground hover:bg-accent">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Transform Long Threads
              <br />
              Into Perfect Posts
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              AI-powered thread cutter that transforms lengthy conversations into engaging, 
              platform-optimized content for Twitter, LinkedIn, and more.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-6">
              <Link to="/auth" className="flex items-center space-x-2">
                <span>Start Cutting Threads</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-primary/20 hover:border-primary/40">
              <Link to="/premium">View Premium Plans</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Process long threads in seconds with our advanced AI technology
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Smart Optimization</h3>
            <p className="text-muted-foreground">
              Automatically optimizes content for different social media platforms
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center space-y-4 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Privacy First</h3>
            <p className="text-muted-foreground">
              Your content is processed securely and never stored permanently
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 space-y-6">
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Join thousands of content creators who trust ThreadCutter for their social media needs
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-6">
              <Link to="/auth" className="flex items-center space-x-2">
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link to="/support">Support</Link>
            </Button>
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link to="/premium">Premium</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ThreadCutter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
