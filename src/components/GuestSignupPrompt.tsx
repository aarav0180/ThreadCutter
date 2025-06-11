
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, X } from 'lucide-react';

interface GuestSignupPromptProps {
  messagesLeft: number;
  open: boolean;
  onSignup: () => void;
  onDismiss: () => void;
}

const GuestSignupPrompt = ({ messagesLeft, open, onSignup, onDismiss }: GuestSignupPromptProps) => {
  if (!open) return null;

  const isFinal = messagesLeft === 0;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-card border border-border rounded-lg p-4 shadow-lg neumorphic">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full gradient-primary">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">
                {isFinal ? "You've hit your limit 💔" : "Last free message ✨"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {isFinal
                  ? "Your free message limit is over for today."
                  : "You're about to use your final free message."}
                <br />
                Sign up to unlock <strong>5 messages/day</strong> and premium features!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex space-x-2 mt-3">
          <Button
            onClick={onSignup}
            size="sm"
            className="flex-1 gradient-primary hover:opacity-90 text-xs"
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    </div>
  );
};
export default GuestSignupPrompt;