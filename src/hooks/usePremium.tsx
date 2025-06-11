
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePremium = (userId: string | null) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [messageLimit, setMessageLimit] = useState(3);
  const [messagesUsed, setMessagesUsed] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setIsPremium(false);
      setMessageLimit(3);
      setIsLoading(false);
      return;
    }

    checkPremiumStatus();
    fetchUsage();
  }, [userId]);

  const checkPremiumStatus = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase.rpc('has_active_premium', {
        user_uuid: userId
      });

      if (error) throw error;
      
      setIsPremium(data);
      setMessageLimit(data ? -1 : 5); // -1 means unlimited
    } catch (error) {
      console.error('Error checking premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsage = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase.rpc('get_user_daily_usage', {
        user_uuid: userId
      });

      if (error) throw error;
      setMessagesUsed(data || 0);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const incrementUsage = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_usage')
        .upsert({
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          messages_used: messagesUsed + 1
        }, {
          onConflict: 'user_id,date'
        });

      if (error) throw error;
      
      setMessagesUsed(prev => prev + 1);
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const createSubscription = async (planType: string, amount: number) => {
    if (!userId) return;

    const expirationMap = {
      'day': 1,
      'week': 7,
      'month': 30,
      'year': 365
    };

    const days = expirationMap[planType as keyof typeof expirationMap] || 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    try {
      // Create subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_type: planType,
          expires_at: expiresAt.toISOString(),
          amount: amount
        })
        .select()
        .single();

      if (subError) throw subError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          subscription_id: subscription.id,
          user_id: userId,
          amount: amount,
          status: 'completed',
          payment_method: 'demo',
          transaction_id: `demo_${Date.now()}`
        });

      if (paymentError) throw paymentError;

      toast({
        title: "🎉 Welcome to Premium!",
        description: `Your ${planType} subscription is now active!`,
      });

      checkPremiumStatus();
      return true;
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isPremium,
    isLoading,
    messageLimit,
    messagesUsed,
    checkPremiumStatus,
    incrementUsage,
    createSubscription
  };
};
