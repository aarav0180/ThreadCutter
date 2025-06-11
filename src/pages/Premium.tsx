
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Check, Sparkles, ArrowLeft, Heart, Zap, CreditCard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/hooks/usePremium';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PaymentConfirmation from '@/components/PaymentConfirmation';

const Premium = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState<any>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const { createSubscription } = usePremium(user?.id);

  const plans = [
    { 
      name: '1 Day', 
      price: '$0.50', 
      period: 'day', 
      amount: 0.50,
      description: 'Perfect for trying out premium features',
      badge: 'Trial',
      features: ['Unlimited messages', 'Multiple tones', 'Priority support']
    },
    { 
      name: '1 Week', 
      price: '$2.00', 
      period: 'week', 
      amount: 2.00,
      description: 'Great for short-term projects',
      badge: 'Popular',
      features: ['Everything in Trial', 'Advanced customization', 'Export options']
    },
    { 
      name: '1 Month', 
      price: '$6.00', 
      period: 'month', 
      amount: 6.00,
      description: 'Best value for regular users',
      badge: 'Recommended',
      popular: true,
      features: ['Everything in Weekly', 'Custom presets', 'Early access features']
    },
    { 
      name: '1 Year', 
      price: '$30.00', 
      period: 'year', 
      amount: 30.00,
      description: 'Maximum savings for power users',
      badge: 'Best Deal',
      savings: 'Save 58%',
      features: ['Everything included', 'Priority processing', 'Dedicated support']
    },
  ];

  const features = [
    'Unlimited messages per day',
    'Combine multiple tones for unique outputs',
    'Priority AI processing',
    'Advanced thread customization',
    'Export threads to multiple formats',
    'Premium support',
    'Early access to new features',
    'Custom tone presets'
  ];

  // Mock payment processing function
  const mockPaymentProcess = async (plan: any): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // Simulate payment scenarios (90% success rate for demo)
    const scenarios = [
      { success: true, weight: 90 },
      { success: false, error: 'Payment declined by bank', weight: 5 },
      { success: false, error: 'Insufficient funds', weight: 3 },
      { success: false, error: 'Card expired', weight: 2 }
    ];
    
    const random = Math.random() * 100;
    let currentWeight = 0;
    
    for (const scenario of scenarios) {
      currentWeight += scenario.weight;
      if (random <= currentWeight) {
        if (scenario.success) {
          return {
            success: true,
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
        } else {
          return {
            success: false,
            error: scenario.error
          };
        }
      }
    }
    
    return { success: true, transactionId: `txn_${Date.now()}` };
  };

  const handlePurchase = async (plan: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upgrade to premium.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan.period);

    try {
      toast({
        title: "Processing Payment",
        description: "Please wait while we process your payment securely...",
      });

      // Mock payment processing
      const paymentResult = await mockPaymentProcess(plan);
      
      if (!paymentResult.success) {
        toast({
          title: "Payment Failed",
          description: paymentResult.error || "Your payment could not be processed. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Payment Successful!",
        description: "Your payment has been processed successfully.",
      });

      // Create subscription in database
      const success = await createSubscription(plan.period, plan.amount);
      
      if (success) {
        setPurchasedPlan(plan);
        setShowPaymentConfirmation(true);
        
        toast({
          title: "Welcome to Premium!",
          description: `You now have access to all premium features for ${plan.period}.`,
        });
      } else {
        toast({
          title: "Subscription Error",
          description: "Payment was successful but there was an issue activating your subscription. Please contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan('');
    }
  };

  const handlePaymentConfirmationContinue = () => {
    setShowPaymentConfirmation(false);
    setPurchaseSuccess(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  // Show payment confirmation screen
  if (showPaymentConfirmation && purchasedPlan) {
    return (
      <PaymentConfirmation
        planName={purchasedPlan.name}
        amount={purchasedPlan.price}
        onContinue={handlePaymentConfirmationContinue}
      />
    );
  }

  if (purchaseSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/80 p-4">
        <div className="text-center space-y-6 animate-in zoom-in-50 duration-500">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center animate-bounce">
            <Check className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              🎉 Redirecting to Dashboard...
            </h1>
            <p className="text-muted-foreground text-lg">
              Get ready to explore your new premium features!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/80 p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-yellow-500/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ThreadCutter Premium
            </h1>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
            Unlock Unlimited Creativity
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your content creation with premium features designed for creators, marketers, and storytellers who demand the best.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Features List */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-yellow-500/20 h-fit sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <span>Premium Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan, index) => (
                <Card 
                  key={plan.period}
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-105 animate-in slide-in-from-right-2 ${
                    plan.popular 
                      ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 shadow-lg' 
                      : 'bg-card/50 backdrop-blur-sm border-border/30 hover:border-yellow-500/30'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {(plan.popular || plan.savings) && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                      <span className={`text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-500'
                      }`}>
                        {plan.popular ? plan.badge : plan.savings}
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="space-y-2">
                      <CardTitle className="text-xl flex items-center justify-center space-x-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <span>{plan.name}</span>
                      </CardTitle>
                      <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        {plan.price}
                      </div>
                      <p className="text-sm text-muted-foreground">per {plan.period}</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-6">
                    <p className="text-sm text-muted-foreground text-center">
                      {plan.description}
                    </p>
                    
                    {/* Plan Features */}
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full h-12 font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                      }`}
                      onClick={() => handlePurchase(plan)}
                      disabled={isProcessing}
                    >
                      {isProcessing && selectedPlan === plan.period ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4" />
                          <span>Choose {plan.name}</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center space-y-6">
          <div className="bg-card/30 backdrop-blur-sm border border-border/20 rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">256-bit SSL encryption protects your payment information</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold">Instant Activation</h3>
                <p className="text-sm text-muted-foreground">Premium features activated immediately after payment</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold">Money-back Guarantee</h3>
                <p className="text-sm text-muted-foreground">7-day money-back guarantee, no questions asked</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Cancel anytime • No hidden fees • Secure payment</span>
          </div>
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
