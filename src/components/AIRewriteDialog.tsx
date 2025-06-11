
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAPI, GeminiRequestOptions } from '@/services/geminiService';
import ChatBubble from './ChatBubble';

interface AIRewriteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  originalContent: string;
  platform: string;
  currentTones: string[];
  useEmojis: boolean;
  isPremium: boolean;
  onApplyRewrite: (newContent: string) => void;
}

const AIRewriteDialog: React.FC<AIRewriteDialogProps> = ({
  isOpen,
  onClose,
  originalContent,
  platform,
  currentTones,
  useEmojis,
  isPremium,
  onApplyRewrite
}) => {
  const [userRequest, setUserRequest] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const handleRewrite = async () => {
    if (!userRequest.trim()) {
      toast({
        title: "Please describe your changes",
        description: "Tell me what you'd like me to change about this post.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const enhancedPrompt = `Original content: "${originalContent}"

User's modification request: "${userRequest}"

Please rewrite the content based on the user's request while maintaining the core message. Apply the following specifications:
- Platform: ${platform}
- Current tones: ${currentTones.join(', ')}
- Use emojis: ${useEmojis ? 'Yes' : 'No'}

Provide the rewritten content as a single, improved post.`;

      const geminiOptions: GeminiRequestOptions = {
        prompt: enhancedPrompt,
        tones: currentTones,
        platform: platform as any,
        useEmojis: useEmojis,
        maxPosts: 1
      };

      const response = await callGeminiAPI(geminiOptions);
      
      if (!response.success || !response.posts.length) {
        throw new Error(response.error || "Failed to generate rewrite");
      }

      setRewrittenContent(response.posts[0].content);
      setShowResult(true);

      toast({
        title: "✨ Rewrite complete!",
        description: "Your content has been rewritten based on your request.",
      });
    } catch (error) {
      console.error("Error rewriting content:", error);
      toast({
        title: "Rewrite failed",
        description: error instanceof Error ? error.message : "There was an error rewriting your content.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    onApplyRewrite(rewrittenContent);
    onClose();
    setShowResult(false);
    setUserRequest('');
    setRewrittenContent('');
  };

  const handleClose = () => {
    onClose();
    setShowResult(false);
    setUserRequest('');
    setRewrittenContent('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>AI Rewrite Assistant</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Original Content</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {platform}
                </Badge>
                <div className="flex space-x-1">
                  {currentTones.map(tone => (
                    <Badge key={tone} variant="secondary" className="text-xs">
                      {tone}
                    </Badge>
                  ))}
                </div>
                {useEmojis && (
                  <Badge variant="secondary" className="text-xs">
                    😊 Emojis
                  </Badge>
                )}
              </div>
            </div>
            <ChatBubble
              type="ai"
              content={originalContent}
              index={1}
              total={1}
              characterCount={originalContent.length}
            />
          </div>

          {!showResult ? (
            /* Request Input */
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">What would you like me to change?</h3>
                <p className="text-xs text-muted-foreground">
                  Describe the modifications you want. Examples: "Make it more professional", "Add more excitement", "Make it shorter", "Add call-to-action", etc.
                </p>
              </div>
              
              <div className="relative">
                <Textarea
                  value={userRequest}
                  onChange={(e) => setUserRequest(e.target.value)}
                  placeholder="E.g., Make it more engaging and add a call-to-action..."
                  className="min-h-[100px] pr-16"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleRewrite}
                  disabled={!userRequest.trim() || isProcessing}
                  size="sm"
                  className="absolute bottom-3 right-3"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            /* Result Display */
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Rewritten Content</h3>
                <ChatBubble
                  type="ai"
                  content={rewrittenContent}
                  index={1}
                  total={1}
                  characterCount={rewrittenContent.length}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowResult(false)}
                >
                  Try Again
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleApply} className="bg-gradient-to-r from-pink-500 to-purple-600">
                    Apply Rewrite
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIRewriteDialog;
