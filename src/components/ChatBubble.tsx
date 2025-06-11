
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Edit, Check, X } from 'lucide-react';

interface ChatBubbleProps {
  type: 'user' | 'ai';
  content: string;
  index?: number;
  total?: number;
  characterCount?: number;
  characterLimit?: number;
  isEditing?: boolean;
  isProcessing?: boolean;
  onEdit?: (content: string) => void;
  onToggleEdit?: () => void;
  onAIRewrite?: () => void;
  animationDelay?: number;
  allowUserEdit?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  type,
  content,
  index,
  total,
  characterCount,
  characterLimit,
  isEditing,
  isProcessing,
  onEdit,
  onToggleEdit,
  onAIRewrite,
  animationDelay = 0,
  allowUserEdit = false,
}) => {
  const [editContent, setEditContent] = useState(content);

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editContent);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    if (onToggleEdit) {
      onToggleEdit();
    }
  };

  const isOverLimit = characterCount && characterLimit && characterCount > characterLimit;

  return (
    <div 
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={`${isEditing ? 'max-w-[95%] w-full' : 'max-w-[80%]'} ${type === 'user' ? 'ml-12' : 'mr-12'}`}>
        <div
          className={`
            p-4 rounded-2xl neumorphic transition-all duration-300
            ${type === 'user' 
              ? 'chat-bubble-user rounded-br-md' 
              : 'chat-bubble-ai rounded-bl-md'
            }
            ${isOverLimit ? 'ring-2 ring-destructive/50' : ''}
            ${isEditing ? 'ring-2 ring-primary/50' : ''}
          `}
        >
          {/* Header with post number and character count */}
          {type === 'ai' && index && total && (
            <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
              <span className="font-medium gradient-primary bg-clip-text text-transparent">
                {index}/{total}
              </span>
              <span className={`font-mono ${isOverLimit ? 'text-destructive' : ''}`}>
                {characterCount}/{characterLimit}
              </span>
            </div>
          )}

          {/* Content */}
          {isEditing ? (
            <div className="space-y-3 w-full">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[120px] w-full bg-background/50 border-border/50 text-sm resize-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSaveEdit();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancelEdit();
                  }
                }}
              />
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-xs text-muted-foreground">
                  {editContent.length} characters • Ctrl+Enter to save • Esc to cancel
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-8 px-3"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="h-8 px-3 gradient-primary"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm leading-relaxed text-foreground">
                {isProcessing ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="ml-2 text-muted-foreground">Processing...</span>
                  </span>
                ) : (
                  content
                )}
              </div>

              {/* Actions */}
              {!isProcessing && (
                <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-border/30">
                  {(type === 'ai' || allowUserEdit) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onToggleEdit}
                      className="h-7 px-2 text-xs hover:bg-accent/50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                  
                  {type === 'ai' && onAIRewrite && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onAIRewrite}
                      className="h-7 px-2 text-xs hover:bg-accent/50 text-primary"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Rewrite
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
