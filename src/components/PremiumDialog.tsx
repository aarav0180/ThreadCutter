import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles } from 'lucide-react';

interface PremiumDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumDialog = ({ isOpen, onClose }: PremiumDialogProps) => {
  const plans = [
    { name: '1 Day', price: '$0.50', period: 'day', dailyPrice: '$0.50' },
    { name: '1 Week', price: '$2.00', period: 'week', dailyPrice: '$0.29' },
    { name: '1 Month', price: '$6.00', period: 'month', dailyPrice: '$0.20', popular: true },
    { name: '1 Year', price: '$30.00', period: 'year', dailyPrice: '$0.08', savings: 'Save 84%' },
  ];

  const features = [
    'Unlimited AI conversations',
    'Priority response times',
    'Advanced AI rewrites',
    'Custom thread organization',
    'Export conversation history'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="flex items-center justify-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold">
              Upgrade to Premium
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-6">
            {/* Limit message */}
            <div className="text-center py-4 px-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-amber-400 dark:text-amber-300">Daily Limit Reached</span>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                You've used all 5 daily messages. Upgrade for unlimited access and premium features.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground mb-4">What you'll get:</h3>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Plans */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Choose your plan:</h3>
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div 
                    key={plan.period}
                    className={`relative p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                      plan.popular 
                        ? 'border-blue-500 bg-blue-500/10 shadow-sm' 
                        : 'border-border bg-card hover:border-border/60'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    {plan.savings && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          {plan.savings}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-lg">{plan.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.dailyPrice}/day • Unlimited everything
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl text-foreground">{plan.price}</div>
                        <div className="text-sm text-muted-foreground">per {plan.period}</div>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full py-3 font-medium transition-all duration-200 ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      }`}
                      onClick={() => {
                        // Here you would integrate with a payment processor
                        console.log(`Selected ${plan.name} plan`);
                      }}
                    >
                      Get {plan.name} Premium
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Cancel anytime • Secure payment • No hidden fees
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumDialog;