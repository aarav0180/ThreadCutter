import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  MessageSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  preview: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}

const ChatSidebar = ({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
  isMobile,
}: ChatSidebarProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isMobile && isCollapsed) {
    return (
      <Button
        onClick={onToggleCollapse}
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 neumorphic"
      >
        <Menu className="h-5 w-5 text-pink-300" />
      </Button>
    );
  }

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="bg-gradient-to-br from-background via-background/95 to-background/80 dark:border-pink-500/20 backdrop-blur-md text-pink-200 flex flex-col transition-all duration-300 ease-in-out"
          onClick={onToggleCollapse}
        />
      )}

      <div
        className={`
        ${isMobile ? "relative" : "relative"} 
        ${isCollapsed ? (isMobile ? "-translate-x-full" : "w-16") : "w-82"} 
        ${isMobile ? "z-50 h-screen" : "h-screen"}
        flex flex-col transition-all duration-300 ease-in-out shadow-lg

        bg-gradient-to-br from-background via-background/95 to-background/80
        text-zinc-800 border-r border-zinc-300
        backdrop-blur-md backdrop-saturate-150

        dark:bg-gradient-to-br from-background via-background/95 to-background/80 
        dark:text-pink-200 dark:border-pink-500/20 dark:shadow-[inset_0_0_1px_#f472b6]
      `}
      >
        <div className="p-4 border-b border-zinc-300 dark:border-pink-500/20 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center animate-pulse">
                <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
              </div>
              <span className="font-bold text-zinc-800 dark:text-pink-200">
                ThreadCutter
              </span>
            </div>
          )}

          <Button
            onClick={onToggleCollapse}
            variant="ghost"
            size="icon"
            className="neumorphic"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-pink-300" />
            ) : isMobile ? (
              <X className="h-4 w-4 text-pink-300" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-pink-300" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="p-4 border-b border-zinc-300 dark:border-pink-500/20">
            <Button
              variant="ghost"
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 text-zinc-800 dark:text-pink-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        )}

        {isCollapsed && !isMobile && (
          <div className="p-2 border-b border-zinc-300 dark:border-pink-500/20">
            <Button
              onClick={onNewChat}
              variant="ghost"
              size="icon"
              className="w-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 border border-pink-500/20 text-pink-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!isCollapsed && (
          <ScrollArea className="flex-1 max-h-[49vh] overflow-y-auto">
            <div className="px-3 py-2 space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 group 
            ${
              activeChat === chat.id
                ? "bg-gradient-to-r from-pink-100/40 to-pink-200/30 dark:from-pink-400/10 dark:to-pink-400/5 shadow-inner"
                : "hover:bg-pink-100/30 dark:hover:bg-pink-400/5"
            }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-lg mt-0.5">💬</div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-zinc-800 dark:text-pink-100 truncate">
                        {chat.title || "Untitled Thread"}
                      </h4>

                      <p className="text-xs text-muted-foreground dark:text-pink-300/80 mt-0.5 line-clamp-2">
                        {chat.preview ||
                          "Tap to open and continue this conversation"}
                      </p>

                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-zinc-500 dark:text-pink-300/50">
                        <span>🕒</span>
                        <span>{formatDate(chat.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {chats.length === 0 && (
                <div className="text-center py-12 text-zinc-400 dark:text-pink-300/60">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-pink-400" />
                  <p className="text-sm font-medium">No chats yet</p>
                  <p className="text-xs mt-1 opacity-70">
                    Start a new conversation
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default ChatSidebar;
