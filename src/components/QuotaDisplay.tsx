
import React from 'react';
import { Crown } from 'lucide-react';

interface QuotaDisplayProps {
  threadsUsed: number;
  maxThreads?: number;
}

const QuotaDisplay = ({ threadsUsed, maxThreads = 5 }: QuotaDisplayProps) => {
  const remaining = Math.max(0, maxThreads - threadsUsed);
  const isLimitReached = remaining === 0;

  return (
    <div className="flex items-center justify-center">
      <div className={`px-4 py-2 rounded-full neumorphic ${
        isLimitReached ? 'bg-destructive/10 text-destructive' : 'bg-card'
      }`}>
        <div className="flex items-center space-x-2 text-sm">
          {isLimitReached ? (
            <>
              <Crown className="h-4 w-4 text-white" />
              <span className="font-medium text-white">Daily limit reached</span>
            </>
          ) : (
            <>
              <span className="text-white/80">You have</span>
              <span className="font-bold text-white">{remaining}</span>
              <span className="text-white/80">messages left today</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotaDisplay;
