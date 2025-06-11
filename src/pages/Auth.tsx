
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  type Errors = {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  
  const [errors, setErrors] = useState<Errors>({});

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  // Clear form when switching between login/signup
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowEmailConfirmation(false);
  }, [isLogin]);

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form.",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: "Invalid email or password. Please check your credentials and try again.",
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              variant: "destructive",
              title: "Email Not Confirmed",
              description: "Please check your email and click the confirmation link before signing in.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Login Error",
              description: error.message,
            });
          }
          return;
        }

        if (data.user) {
          toast({
            title: "Login Successful!",
            description: "Welcome back to ThreadCutter.",
          });
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              variant: "destructive",
              title: "Account Already Exists",
              description: "An account with this email already exists. Please sign in instead.",
            });
            setIsLogin(true);
          } else if (error.message.includes('Password should be at least')) {
            toast({
              variant: "destructive",
              title: "Weak Password",
              description: "Password should be at least 6 characters long and contain a mix of characters.",
            });
          } else if (error.message.includes('Invalid email')) {
            toast({
              variant: "destructive",
              title: "Invalid Email",
              description: "Please enter a valid email address.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Sign Up Error",
              description: error.message,
            });
          }
          return;
        }

        if (data.user) {
          setSignupEmail(email);
          setShowEmailConfirmation(true);
          toast({
            title: "Account Created!",
            description: "Please check your email to confirm your account.",
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
      });
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signupEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Resend Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Email Sent!",
          description: "Confirmation email has been resent. Please check your inbox.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend confirmation email.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const skipEmailVerification = () => {
    toast({
      title: "Demo Mode",
      description: "You're now in demo mode. Some features may be limited.",
    });
    setShowEmailConfirmation(false);
    navigate('/');
  };

  // Show email confirmation screen
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/80 p-6 sm:p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-200/50 transform transition-all duration-700 animate-in slide-in-from-bottom-5">
            <div className="text-center space-y-8">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105">
                  <Mail className="w-10 h-10 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-900">Check your email</h1>
                <p className="text-gray-600 text-lg">
                  We've sent a confirmation link to:
                </p>
                <p className="font-semibold text-pink-600 text-lg break-all">{signupEmail}</p>
              </div>

              {/* Instructions and Actions */}
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Important:</p>
                      <p>Click the link in the email to activate your account. The link expires in 24 hours.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={resendConfirmation}
                    disabled={loading}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Resend confirmation email"
                    )}
                  </Button>
                  
                  <Button
                    onClick={skipEmailVerification}
                    variant="ghost"
                    className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
                  >
                    Skip for now (Demo mode)
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setShowEmailConfirmation(false);
                      setIsLogin(true);
                    }}
                    variant="ghost"
                    className="w-full h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300"
                  >
                    Back to sign in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/80 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with ThreadCutter branding */}
        <div className="text-center mb-10 transform transition-all duration-700 animate-in slide-in-from-top-5">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <span className="font-bold text-xl text-white">TC</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              ThreadCutter
            </h1>
          </div>
          <p className="text-muted-foreground text-lg transition-all duration-300">
            {isLogin ? 'Welcome back to your workspace' : 'Join our creative community'}
          </p>
        </div>

        {/* Form Container */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20 p-6 animate-slideInUp">
          {/* Toggle Buttons */}
          <div className="flex bg-muted/50 rounded-2xl p-1.5 mb-8 relative overflow-hidden">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-1/2 bg-background rounded-xl shadow-md transition-all duration-300 ease-out ${
                isLogin ? 'left-1.5' : 'left-1/2 translate-x-[-6px]'
              }`}
            />
            <button
              type="button"
              onClick={() => !isLogin && toggleMode()}
              className={`flex-1 py-3.5 text-center relative z-10 transition-all duration-200 rounded-xl font-semibold ${
                isLogin 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => isLogin && toggleMode()}
              className={`flex-1 py-3.5 text-center relative z-10 transition-all duration-200 rounded-xl font-semibold ${
                !isLogin 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Field */}
            <div className="space-y-3 transform transition-all duration-300">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-pink-400 transition-colors duration-200" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-12 h-14 bg-background/50 border-2 border-border rounded-xl focus:border-pink-400 focus:bg-background transition-all duration-200 focus:shadow-lg text-base ${
                    errors.email ? 'border-destructive focus:border-destructive' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm animate-in slide-in-from-top-1 duration-200 ml-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3 transform transition-all duration-300">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-pink-400 transition-colors duration-200" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-12 pr-12 h-14 bg-background/50 border-2 border-border rounded-xl focus:border-pink-400 focus:bg-background transition-all duration-200 focus:shadow-lg text-base ${
                    errors.password ? 'border-destructive focus:border-destructive' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm animate-in slide-in-from-top-1 duration-200 ml-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field - Only for Sign Up */}
            <div className={`transition-all duration-500 overflow-hidden ${
              !isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {!isLogin && (
                <div className="space-y-3">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-pink-400 transition-colors duration-200" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pl-12 pr-12 h-14 bg-background/50 border-2 border-border rounded-xl focus:border-pink-400 focus:bg-background transition-all duration-200 focus:shadow-lg text-base ${
                        errors.confirmPassword ? 'border-destructive focus:border-destructive' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm animate-in slide-in-from-top-1 duration-200 ml-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:transform-none disabled:opacity-70"
            >
              <div className="flex items-center justify-center space-x-3">
                {loading && (
                  <Loader2 className="w-6 h-6 animate-spin" />
                )}
                <span>
                  {loading 
                    ? 'Please wait...' 
                    : isLogin 
                      ? 'Sign In' 
                      : 'Create Account'
                  }
                </span>
              </div>
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 pt-8 border-t border-border/60">
            <p className="text-muted-foreground mb-4 text-base">
              {isLogin ? "New to ThreadCutter?" : "Already have an account?"}
            </p>
            <button
              onClick={toggleMode}
              disabled={loading}
              className="text-pink-400 hover:text-pink-300 font-semibold text-base transition-all duration-200 hover:underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogin ? "Create a new account" : "Sign in instead"}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-center text-sm text-muted-foreground opacity-80 leading-relaxed max-w-sm mx-auto">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
          
          {/* Supabase Configuration Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium">For email confirmation to work:</p>
                <p>Configure Site URL and Redirect URLs in Supabase Dashboard → Authentication → URL Configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
