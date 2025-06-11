  `1 `
import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      {/* AI Brain Animation */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          AI is crafting your thread...
        </p>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-muted/50 rounded-full h-2 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
