
import React, { useEffect, useState } from 'react';
import { CheckCircle, Crown, Sparkles, Heart, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentConfirmationProps {
  planName: string;
  amount: string;
  onContinue: () => void;
}

const PaymentConfirmation = ({ planName, amount, onContinue }: PaymentConfirmationProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/80 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float ${
              showAnimation ? 'opacity-60' : 'opacity-0'
            } transition-opacity duration-1000`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {i % 4 === 0 && <Crown className="w-4 h-4 text-yellow-400" />}
            {i % 4 === 1 && <Sparkles className="w-4 h-4 text-pink-400" />}
            {i % 4 === 2 && <Star className="w-4 h-4 text-purple-400" />}
            {i % 4 === 3 && <Zap className="w-4 h-4 text-blue-400" />}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className={`relative ${showAnimation ? 'animate-bounce' : ''}`}>
            <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white animate-pulse" />
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 w-32 h-32 bg-green-400 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-2 w-28 h-28 bg-green-400 rounded-full animate-ping opacity-10 animation-delay-300"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`space-y-6 ${showAnimation ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              🎉 Payment Successful!
            </h1>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome to Premium!
              </h2>
              <p className="text-lg text-muted-foreground">
                You've successfully upgraded to the <span className="font-semibold text-yellow-600">{planName}</span> plan
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-semibold">Premium Activated</span>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Amount Charged:</p>
              <p className="text-3xl font-bold text-green-600">{amount}</p>
            </div>
          </div>

          {/* Features unlocked */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>What's Now Unlocked</span>
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Unlimited Messages</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Multiple Tones</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Priority Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Advanced Features</span>
              </div>
            </div>
          </div>

          {/* Thank you message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-pink-400">
              <Heart className="w-5 h-5 animate-pulse" />
              <span className="text-lg">Thank you for supporting ThreadCutter!</span>
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              Your support helps us continue improving and adding new features
            </p>
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Start Creating Amazing Content!</span>
            </div>
          </Button>

          {/* Receipt info */}
          <p className="text-xs text-muted-foreground">
            A receipt has been sent to your email address
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default PaymentConfirmation;
