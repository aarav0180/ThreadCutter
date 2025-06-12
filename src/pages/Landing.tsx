import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Sparkles,
  MessageSquare,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Star,
  Check,
  Rocket,
  Moon,
  Sun,
  Send,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePremium } from "@/hooks/usePremium";

const Landing = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { userCount, dynamicPricing } = usePremium(null);

  // Apply theme on mount and when changed
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Conversations",
      description:
        "Transform your ideas into engaging social media content with advanced AI technology",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      icon: Zap,
      title: "Multi-Platform Support",
      description:
        "Create content optimized for Twitter, LinkedIn, Instagram, and Threads all in one place",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      icon: Users,
      title: "Tone Customization",
      description:
        "Choose from multiple tones to match your brand voice and audience preferences",
      gradient: "from-pink-400 to-red-500",
    },
    {
      icon: Shield,
      title: "Premium Features",
      description:
        "Unlock unlimited conversations, advanced AI rewrites, and priority support",
      gradient: "from-green-400 to-blue-500",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "5 messages per day",
        "Basic AI conversations",
        "Single platform optimization",
        "Community support",
      ],
      buttonText: "Get Started Free",
      popular: false,
    },
    {
      name: "Premium",
      price: `$${dynamicPricing.month.toFixed(2)}`,
      originalPrice: userCount >= 400 ? `$${(dynamicPricing.month / 2).toFixed(2)}` : `$${(dynamicPricing.month * 2).toFixed(2)}`,
      period: "month",
      features: [
        "Unlimited messages",
        "Advanced AI features",
        "Multi-platform support",
        "Priority support",
        "Custom tones",
      ],
      buttonText: "Upgrade to Premium",
      popular: true,
      earlyBird: userCount < 400,
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [feedbackStatus, setFeedbackStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const [user, setUser] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(true);

  // Auth logic copied from ThreadCutter for consistency
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsGuest(false);
      } else {
        setUser(null);
        setIsGuest(true);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setIsGuest(false);
      } else {
        setUser(null);
        setIsGuest(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Feedback form handler
  const handleFeedbackChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus("sending");
    try {
      // You should implement a backend API route to send email securely.
      // This is a placeholder fetch to /api/feedback (you must implement this endpoint)
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });
      if (res.ok) {
        setFeedbackStatus("sent");
        setFeedback({ name: "", email: "", message: "" });
      } else {
        setFeedbackStatus("error");
      }
    } catch {
      setFeedbackStatus("error");
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground overflow-hidden`}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/60 rounded-full animate-float delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/5 w-3 h-3 bg-blue-400/40 rounded-full animate-float delay-3000"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400/50 rounded-full animate-float delay-4000"></div>
      </div>

      {/* Flowing Light Rays */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 w-1 h-96 bg-gradient-to-b from-transparent via-pink-400/30 to-transparent rotate-12 animate-light-ray"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-80 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent rotate-45 animate-light-ray delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-72 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent -rotate-12 animate-light-ray delay-2000"></div>
        <div className="absolute top-1/6 left-1/2 w-0.5 h-64 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent rotate-75 animate-light-ray delay-3000"></div>
        <div className="absolute bottom-1/6 right-1/6 w-0.5 h-48 bg-gradient-to-b from-transparent via-pink-400/25 to-transparent -rotate-30 animate-light-ray delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/20 backdrop-blur-xl border-b border-border/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 animate-slide-in-left">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center animate-pulse">
              <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
              ThreadCutter
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 animate-slide-in-left delay-200">
            <button
              onClick={() => scrollToSection("features")}
              className="text-muted-foreground hover:text-pink-300 transition-colors duration-300"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="text-muted-foreground hover:text-pink-300 transition-colors duration-300"
            >
              Demo
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-pink-300 transition-colors duration-300"
            >
              Pricing
            </button>
            <Link
              to="/support"
              className="text-muted-foreground hover:text-pink-300 transition-colors duration-300"
            >
              Support
            </Link>
          </div>

          <div className="flex items-center space-x-4 animate-slide-in-left delay-300">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="border border-pink-500/20 neumorphic"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {!isGuest ? (
              <>
                <Link to="/app">
                  <Button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 transition-all duration-300 hover:scale-105">
                    Go to App
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-foreground hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                    setIsGuest(true);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    className="text-foreground hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/app">
                  <Button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 transition-all duration-300 hover:scale-105">
                    Try Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in-down">
            <Badge className="mb-6 bg-gradient-to-r from-pink-400/20 to-purple-400/20 text-pink-300 border-pink-400/30 animate-bounce-x">
              <Sparkles className="w-3 h-3 mr-1 animate-spin-slow" />
              AI-Powered Content Creation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-text-reveal">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-flow">
                Transform Ideas Into
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-flow-reverse">
                Viral Content
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Create engaging social media content with AI-powered
              conversations. Optimize for multiple platforms, customize your
              tone, and watch your engagement soar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-in-up">
              {!isGuest ? (
                <>
                  <Link to="/app">
                    <Button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
                      Go to App
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-pink-400/30 hover:bg-pink-500/10 text-muted-foreground hover:text-foreground hover:border-pink-400/50 px-8 py-6 text-lg"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                    >
                      Sign Up Free
                      <ArrowRight className="ml-2 h-5 w-5 animate-bounce-x" />
                    </Button>
                  </Link>
                  <Link to="/app">
                    <Button
                      variant="outline"
                      className="border-pink-400/30 hover:bg-pink-500/10 text-muted-foreground hover:text-foreground hover:border-pink-400/50 px-8 py-6 text-lg"
                    >
                      Try Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="animate-slide-in-up delay-300">
            <div className="relative max-w-4xl mx-auto">
              <div className="neumorphic rounded-2xl p-8 bg-card/10 backdrop-blur-sm border border-pink-500/20 hover:border-pink-400/40 transition-all duration-500 animate-float">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-pink-400/40 to-purple-400/40 rounded animate-shimmer-wave"></div>
                    <div className="h-3 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded w-3/4 animate-shimmer-wave delay-200"></div>
                    <div className="h-3 bg-gradient-to-r from-blue-400/30 to-pink-400/30 rounded w-1/2 animate-shimmer-wave delay-400"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-gradient-to-r from-green-400/40 to-blue-400/40 rounded-lg animate-shimmer-wave delay-600"></div>
                    <div className="h-6 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded w-2/3 animate-shimmer-wave delay-800"></div>
                  </div>
                </div>

                {/* Animated typing effect */}
                <div className="mt-6 p-4 bg-muted/10 rounded-lg border border-purple-400/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground animate-fade-in">
                      AI Assistant
                    </span>
                  </div>
                  <div className="text-left text-muted-foreground animate-text-reveal delay-1000">
                    "Here's your optimized Twitter thread about AI trends..."
                  </div>
                  <div className="mt-2 flex space-x-1">
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1200"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/5 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
              Everything you need to create, optimize, and share amazing content
              across all platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 border-pink-500/20 hover:border-pink-400/40 neumorphic bg-card/10 backdrop-blur-sm animate-card-rise hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 animate-icon-glow`}
                  >
                    <feature.icon className="h-6 w-6 text-white animate-bounce-x delay-1000" />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2 text-foreground group-hover:text-pink-300 transition-colors duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-muted-foreground text-sm group-hover:text-muted-foreground transition-colors duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
              See ThreadCutter in Action
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up delay-200">
              Watch how ThreadCutter transforms your ideas into viral content
            </p>
          </div>

          <div className="max-w-5xl mx-auto animate-slide-in-up">
            {/* MacBook Mockup */}
            <div className="relative">
              {/* MacBook Shell */}
              <div className="bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-t-3xl p-6 shadow-2xl">
                {/* Screen Bezel */}
                <div className="bg-black rounded-t-2xl p-4 relative overflow-hidden">
                  {/* Camera Notch */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-900 rounded-full"></div>
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                  
                  {/* Video Container */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg overflow-hidden">
                    {/* Placeholder for video - in a real implementation, you'd embed your actual demo video */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm hover:bg-white/30 transition-all duration-300 cursor-pointer animate-pulse">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                        <p className="text-white/80 text-lg font-medium">
                          Demo Video Coming Soon
                        </p>
                        <p className="text-white/60 text-sm max-w-md mx-auto">
                          Experience how ThreadCutter creates engaging content with AI-powered conversations
                        </p>
                      </div>
                    </div>
                    
                    {/* Animated UI Elements Overlay */}
                    <div className="absolute top-4 left-4 right-4">
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 mb-3 animate-fade-in">
                        <div className="h-2 bg-gradient-to-r from-pink-400/60 to-purple-400/60 rounded animate-shimmer-wave"></div>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 ml-8 animate-fade-in delay-500">
                        <div className="h-2 bg-gradient-to-r from-blue-400/60 to-green-400/60 rounded w-3/4 animate-shimmer-wave delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* MacBook Base */}
              <div className="h-8 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-b-3xl shadow-lg relative">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent"></div>
              </div>
              
              {/* Reflection */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-3xl pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/5 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
              Early Bird Pricing
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up delay-200">
              Special pricing for our first 400 users - prices will double after
            </p>
            <div className="mt-4 space-y-2">
              <Badge className="bg-gradient-to-r from-green-400/20 to-blue-400/20 text-green-300 border-green-400/30 animate-pulse">
                {userCount < 400 
                  ? `Limited Time: ${userCount}/400 Early Bird Users`
                  : 'Early Bird Pricing Has Ended'
                }
              </Badge>
              {userCount < 400 && (
                <p className="text-sm text-muted-foreground">
                  Prices will double after we reach 400 users
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative neumorphic transition-all duration-500 bg-card/10 backdrop-blur-sm animate-pricing-slide hover:scale-105 ${
                  plan.popular
                    ? "border-blue-400/50 shadow-xl shadow-blue-500/20 scale-105"
                    : "border-pink-500/20 hover:border-pink-400/40"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white animate-bounce-x">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.earlyBird && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white animate-pulse">
                      Early Bird
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-foreground animate-fade-in-up">
                      {plan.name}
                    </h3>
                    <div className="mb-4 animate-slide-in-up delay-200">
                      {plan.originalPrice && plan.earlyBird && (
                        <span className="text-lg text-muted-foreground line-through mr-2">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    {plan.earlyBird && (
                      <p className="text-sm text-green-300 animate-fade-in">
                        {userCount < 400 
                          ? `Price increases to ${plan.originalPrice} after first 400 users`
                          : `Price has increased from ${(dynamicPricing.month / 2).toFixed(2)}`
                        }
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3 animate-feature-appear hover:text-pink-200 transition-colors duration-300"
                        style={{ animationDelay: `${featureIndex * 100}ms` }}
                      >
                        <Check className="h-4 w-4 text-green-400 animate-check-mark" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.name === "Free" ? "/app" : "/premium"}>
                    <Button
                      className={`w-full transition-all duration-300 hover:scale-105 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-300 hover:to-purple-400"
                          : "border-pink-400/30 hover:bg-pink-500/10 text-muted-foreground hover:text-foreground hover:border-pink-400/50"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto neumorphic rounded-2xl p-12 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 backdrop-blur-sm animate-cta-glow">
            <Crown className="h-16 w-16 mx-auto mb-6 text-yellow-400 animate-crown-bounce" />
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up delay-300">
              Join thousands of creators who are already using ThreadCutter to
              grow their audience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                >
                  Start Free Today
                  <Sparkles className="ml-2 h-5 w-5 animate-sparkle" />
                </Button>
              </Link>
              <Link to="/premium">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg border-pink-400/30 hover:bg-pink-500/10 text-muted-foreground hover:text-foreground transition-all duration-300 hover:border-pink-400/50"
                >
                  <Crown className="mr-2 h-5 w-5 animate-crown-glow" />
                  View Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Feedback Section */}
      <section id="feedback" className="py-20 px-4 bg-muted/5 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto max-w-2xl relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-6 animate-bounce-x">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
              We Value Your Feedback
            </h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up delay-200">
              Help us make ThreadCutter even better for creators like you
            </p>
          </div>

          <Card className="neumorphic border-pink-500/20 hover:border-pink-400/40 transition-all duration-500 bg-card/10 backdrop-blur-sm shadow-2xl shadow-pink-500/5 animate-card-rise">
            <CardContent className="p-8">
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 animate-slide-in-left">
                    <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                      Your Name
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={feedback.name}
                        onChange={handleFeedbackChange}
                        className="w-full rounded-xl px-4 py-3 bg-background/80 border border-border/30 text-foreground focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 outline-none transition-all duration-300 hover:border-border/50"
                        placeholder="Enter your name"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/5 to-purple-400/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <div className="space-y-2 animate-slide-in-right">
                    <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={feedback.email}
                        onChange={handleFeedbackChange}
                        className="w-full rounded-xl px-4 py-3 bg-background/80 border border-border/30 text-foreground focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300 hover:border-border/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 animate-fade-in-up delay-300">
                  <label htmlFor="message" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-400"></div>
                    Your Feedback
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={feedback.message}
                      onChange={handleFeedbackChange}
                      className="w-full rounded-xl px-4 py-3 bg-background/80 border border-border/30 text-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none resize-none transition-all duration-300 hover:border-border/50"
                      placeholder="Tell us what you think, what features you'd like to see, or any issues you've encountered..."
                    />
                  </div>
                </div>

                <div className="pt-4 animate-slide-in-up delay-500">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 transition-all duration-300 py-3 rounded-xl font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] group"
                    disabled={feedbackStatus === "sending"}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {feedbackStatus === "sending" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          Send Feedback
                        </>
                      )}
                    </div>
                  </Button>
                </div>

                {/* Status Messages */}
                {feedbackStatus === "sent" && (
                  <div className="text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-xl border border-green-400/20">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Thank you for your feedback! We'll be in touch soon.</span>
                    </div>
                  </div>
                )}

                {feedbackStatus === "error" && (
                  <div className="text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20">
                      <span className="font-medium">Something went wrong. Please try again or contact us directly.</span>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Additional Contact Info */}
          <div className="text-center mt-8 animate-fade-in delay-700">
            <p className="text-sm text-muted-foreground">
              You can also reach us at{" "}
              <a href="mailto:support@threadcutter.com" className="text-pink-400 hover:text-pink-300 transition-colors duration-300 underline">
                support@threadcutter.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/20 bg-muted/5 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0 animate-slide-in-left">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center animate-pulse">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
                ThreadCutter
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground animate-slide-in-left delay-300">
              <Link
                to="/support"
                className="hover:text-foreground transition-colors duration-300 hover:scale-105"
              >
                Support
              </Link>
              <Link
                to="/premium"
                className="hover:text-foreground transition-colors duration-300 hover:scale-105"
              >
                Premium
              </Link>
              <span className="animate-fade-in delay-500">
                © 2024 ThreadCutter. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
