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
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Social Media Manager",
      content:
        "ThreadCutter has revolutionized how I create content. The AI suggestions are spot-on!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Content Creator",
      content:
        "The multi-platform optimization saves me hours every week. Absolutely game-changing.",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Marketing Director",
      content:
        "Professional, intuitive, and incredibly powerful. My team loves using ThreadCutter.",
      rating: 5,
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
      price: "$6",
      originalPrice: "$12",
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
      earlyBird: true,
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
    <div className="dark min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-white overflow-hidden">
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
              className="text-gray-300 hover:text-pink-300 transition-colors duration-300"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-300 hover:text-pink-300 transition-colors duration-300"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-300 hover:text-pink-300 transition-colors duration-300"
            >
              Pricing
            </button>
            <Link
              to="/support"
              className="text-gray-300 hover:text-pink-300 transition-colors duration-300"
            >
              Support
            </Link>
          </div>

          <div className="flex items-center space-x-4 animate-slide-in-left delay-300">
            {!isGuest ? (
              <>
                <Link to="/app">
                  <Button className="bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 transition-all duration-300 hover:scale-105">
                    Go to App
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300"
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
                    className="text-white hover:bg-pink-500/10 hover:text-pink-300 transition-all duration-300"
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
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
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
                    className="border-pink-400/30 hover:bg-pink-500/10 text-gray-300 hover:text-white hover:border-pink-400/50 px-8 py-6 text-lg"
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
                      className="border-pink-400/30 hover:bg-pink-500/10 text-gray-300 hover:text-white hover:border-pink-400/50 px-8 py-6 text-lg"
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
                    <span className="text-sm text-gray-400 animate-fade-in">
                      AI Assistant
                    </span>
                  </div>
                  <div className="text-left text-gray-300 animate-text-reveal delay-1000">
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
            <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
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
                    className="text-lg font-semibold mb-2 text-white group-hover:text-pink-300 transition-colors duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300 animate-fade-in-up"
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent animate-text-flow">
              Loved by Creators
            </h2>
            <p className="text-xl text-gray-300 animate-fade-in-up delay-200">
              Join thousands of creators who trust ThreadCutter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="neumorphic border-pink-500/20 hover:border-pink-400/40 transition-all duration-500 bg-card/10 backdrop-blur-sm hover:shadow-xl hover:shadow-pink-500/10 animate-testimonial-float hover:scale-105"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-star-twinkle"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-gray-300 mb-4 italic animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    "{testimonial.content}"
                  </p>
                  <div
                    className="animate-slide-in-left"
                    style={{ animationDelay: `${index * 250}ms` }}
                  >
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            <p className="text-xl text-gray-300 animate-fade-in-up delay-200">
              Special pricing for our first 100 users - prices will increase by
              $6 after
            </p>
            <Badge className="mt-4 bg-gradient-to-r from-green-400/20 to-blue-400/20 text-green-300 border-green-400/30 animate-pulse">
              Limited Time: First 100 Users Only
            </Badge>
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
                      50% Off
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-white animate-fade-in-up">
                      {plan.name}
                    </h3>
                    <div className="mb-4 animate-slide-in-up delay-200">
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through mr-2">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    {plan.earlyBird && (
                      <p className="text-sm text-green-300 animate-fade-in">
                        Price increases to {plan.originalPrice} after first 100
                        users
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
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.name === "Free" ? "/app" : "/premium"}>
                    <Button
                      className={`w-full transition-all duration-300 hover:scale-105 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:from-blue-300 hover:to-purple-400"
                          : "border-pink-400/30 hover:bg-pink-500/10 text-gray-300 hover:text-white hover:border-pink-400/50"
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
            <p className="text-xl text-gray-300 mb-8 animate-fade-in-up delay-300">
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
                  className="px-8 py-6 text-lg border-pink-400/30 hover:bg-pink-500/10 text-gray-300 hover:text-white transition-all duration-300 hover:border-pink-400/50"
                >
                  <Crown className="mr-2 h-5 w-5 animate-crown-glow" />
                  View Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="py-20 px-4 bg-muted/5 relative">
        <div className="container mx-auto max-w-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              We Value Your Feedback
            </h2>
            <p className="text-gray-300">
              Let us know how we can improve ThreadCutter!
            </p>
          </div>
          <form
            onSubmit={handleFeedbackSubmit}
            className="bg-card/10 p-8 rounded-2xl border border-pink-500/20 shadow-lg space-y-6"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-gray-300">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={feedback.name}
                onChange={handleFeedbackChange}
                className="rounded-md px-3 py-2 bg-background/80 border border-border/30 text-white focus:border-pink-400 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={feedback.email}
                onChange={handleFeedbackChange}
                className="rounded-md px-3 py-2 bg-background/80 border border-border/30 text-white focus:border-pink-400 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm text-gray-300">
                Feedback
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={feedback.message}
                onChange={handleFeedbackChange}
                className="rounded-md px-3 py-2 bg-background/80 border border-border/30 text-white focus:border-pink-400 outline-none resize-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white hover:from-pink-300 hover:to-purple-400 transition-all duration-300"
              disabled={feedbackStatus === "sending"}
            >
              {feedbackStatus === "sending" ? "Sending..." : "Send Feedback"}
            </Button>
            {feedbackStatus === "sent" && (
              <div className="text-green-400 text-center">
                Thank you for your feedback!
              </div>
            )}
            {feedbackStatus === "error" && (
              <div className="text-red-400 text-center">
                Something went wrong. Please try again.
              </div>
            )}
          </form>
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
            <div className="flex items-center space-x-6 text-sm text-gray-400 animate-slide-in-left delay-300">
              <Link
                to="/support"
                className="hover:text-white transition-colors duration-300 hover:scale-105"
              >
                Support
              </Link>
              <Link
                to="/premium"
                className="hover:text-white transition-colors duration-300 hover:scale-105"
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
