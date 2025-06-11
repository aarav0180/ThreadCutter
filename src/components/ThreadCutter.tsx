import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Send,
  Sparkles,
  Crown,
  Zap,
  Heart,
  Coffee,
  Smile,
  Settings2,
  Plus,
} from "lucide-react";
import PlatformToggle from "./PlatformToggle";
import ChatBubble from "./ChatBubble";
import QuotaDisplay from "./QuotaDisplay";
import SettingsDialog from "./SettingsDialog";
import PremiumDialog from "./PremiumDialog";
import ToneSelector from "./ToneSelector";
import ChatSidebar from "./ChatSidebar";
import GuestSignupPrompt from "./GuestSignupPrompt";
import LoadingAnimation from "./LoadingAnimation";
import AIRewriteDialog from "./AIRewriteDialog";
import { usePremium } from "@/hooks/usePremium";
import { useChats, Chat, Message, ThreadPost } from "@/hooks/useChats";
import { callGeminiAPI, GeminiRequestOptions } from "@/services/geminiService";
import {
  getMessageUsage,
  updateMessageUsage,
  getMessageLimit,
  getTodayString,
} from "@/utils/messageTracking";
import { Platform } from "@/types/platform";

const TONE_OPTIONS = [
  { value: "funny", label: "Funny", icon: "😄", description: "Humor and wit" },
  {
    value: "creative",
    label: "Creative",
    icon: "🎨",
    description: "Imaginative and unique",
  },
  {
    value: "direct",
    label: "Direct",
    icon: "🎯",
    description: "Clear and concise",
  },
  {
    value: "formal",
    label: "Formal",
    icon: "👔",
    description: "Professional tone",
  },
  {
    value: "neutral",
    label: "Neutral",
    icon: "⚖️",
    description: "Balanced approach",
  },
  {
    value: "inspirational",
    label: "Inspirational",
    icon: "🌟",
    description: "Motivating content",
  },
  {
    value: "conversational",
    label: "Conversational",
    icon: "💬",
    description: "Friendly chat",
  },
  {
    value: "educational",
    label: "Educational",
    icon: "📚",
    description: "Teaching focused",
  },
  {
    value: "emotional",
    label: "Emotional",
    icon: "❤️",
    description: "Deep connection",
  },
  {
    value: "bold",
    label: "Bold",
    icon: "⚡",
    description: "Confident and assertive",
  },
];

const ThreadCutter = () => {
  const [input, setInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("twitter");
  const [selectedTones, setSelectedTones] = useState<string[]>(["neutral"]);
  const [useEmojis, setUseEmojis] = useState(false);
  const [defaultTones, setDefaultTones] = useState<string[]>(["neutral"]);
  const [defaultUseEmojis, setDefaultUseEmojis] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showAIRewriteDialog, setShowAIRewriteDialog] = useState(false);
  const [rewriteContext, setRewriteContext] = useState<{
    messageId: string;
    postId?: string;
    content: string;
  } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [localMessageUsage, setLocalMessageUsage] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isPremium, messageLimit, messagesUsed, incrementUsage } = usePremium(
    user?.id
  );
  const { chats, saveChat, updateMessage, deleteChat, setChats } = useChats(
    user?.id
  );

  // Calculate actual message limits and usage
  const actualMessageLimit = getMessageLimit(isPremium, isGuest);
  const currentLocalUsage = getMessageUsage(user?.id);
  const actualMessagesUsed = isGuest ? currentLocalUsage.count : messagesUsed;
  const messagesLeft =
    actualMessageLimit === -1
      ? Infinity
      : Math.max(0, actualMessageLimit - actualMessagesUsed);

  // Get current chat messages
  const currentChat = chats.find((c) => c.id === activeChat);
  const currentMessages = currentChat?.messages || [];

  // Update local usage when user changes
  useEffect(() => {
    const usage = getMessageUsage(user?.id);
    setLocalMessageUsage(usage.count);

    if (usage.date !== getTodayString()) {
      setLocalMessageUsage(0);
    }
  }, [user?.id]);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsGuest(false);
        setUserProfile({
          name: session.user.user_metadata?.name || "",
          email: session.user.email || "",
        });
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        setIsGuest(false);
        setUserProfile({
          name: session.user.user_metadata?.name || "",
          email: session.user.email || "",
        });
      } else {
        setUser(null);
        setIsGuest(true);
        setUserProfile({ name: "", email: "" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Set default tones based on platform
  useEffect(() => {
    if (selectedPlatform === "linkedin") {
      setSelectedTones(["formal"]);
    } else {
      setSelectedTones(defaultTones);
    }

    // Reset emojis to default when platform changes
    setUseEmojis(defaultUseEmojis);
  }, [selectedPlatform, defaultTones, defaultUseEmojis]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setChats([]);
    setActiveChat(null);
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleProfileUpdate = (profile: { name: string; email: string }) => {
    setUserProfile(profile);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const generateChatTitle = (input: string) => {
    const words = input.split(" ").slice(0, 6).join(" ");
    return words.length > 30 ? words.substring(0, 30) + "..." : words;
  };

  const handleToneToggle = (tone: string) => {
    if (!isPremium) {
      if (selectedTones.includes(tone) && selectedTones.length === 1) {
        return;
      }
      setSelectedTones([tone]);
    } else {
      setSelectedTones((prev) =>
        prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
      );
    }
  };

  const handleEmojiToggle = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    setUseEmojis(!useEmojis);
  };

  const splitIntoThreads = async () => {
    const currentUsage = getMessageUsage(user?.id);
    const limit = getMessageLimit(isPremium, isGuest);

    if (!isPremium && currentUsage.count >= limit) {
      if (isGuest) {
        setShowGuestPrompt(true);
        return;
      } else {
        setShowPremiumDialog(true);
        return;
      }
    }

    setIsProcessing(true);

    try {
      const userMessage: Message = {
        id: uuidv4(),
        type: "user",
        content: input,
        timestamp: new Date(),
        platform: selectedPlatform,
        tone: selectedTones,
        useEmojis: useEmojis,
      };

      const geminiOptions: GeminiRequestOptions = {
        prompt: input,
        tones: selectedTones,
        platform: selectedPlatform,
        useEmojis: useEmojis,
        maxPosts: 10,
      };

      const response = await callGeminiAPI(geminiOptions);

      if (!response.success) {
        throw new Error(response.error || "Failed to generate thread");
      }

      const posts: ThreadPost[] = response.posts.map((post, index) => ({
        id: uuidv4(),
        content: post.content,
        isEditing: false,
        index: index + 1,
        total: response.posts.length,
        characterCount: post.characterCount,
        hashtags: post.hashtags,
        mentions: post.mentions,
      }));

      const aiMessage: Message = {
        id: uuidv4(),
        type: "ai",
        content: `Generated ${posts.length} posts for ${selectedPlatform}`,
        timestamp: new Date(),
        posts: posts,
        platform: selectedPlatform,
        tone: selectedTones,
        useEmojis: useEmojis,
      };

      let updatedChat: Chat;
      if (activeChat && currentChat) {
        updatedChat = {
          ...currentChat,
          messages: [...currentChat.messages, userMessage, aiMessage],
        };
      } else {
        updatedChat = {
          id: uuidv4(),
          title: generateChatTitle(input),
          createdAt: new Date(),
          preview: input.substring(0, 50) + (input.length > 50 ? "..." : ""),
          messages: [userMessage, aiMessage],
          platform: selectedPlatform,
          tone: selectedTones,
          useEmojis: useEmojis,
        };
        setActiveChat(updatedChat.id);
      }

      await saveChat(updatedChat);

      if (!isPremium) {
        if (isGuest) {
          const newUsage = updateMessageUsage(user?.id, 1);
          setLocalMessageUsage(newUsage.count);
        } else {
          await incrementUsage();
        }
      }

      const updatedUsage = getMessageUsage(user?.id);
      if (isGuest && updatedUsage.count >= limit - 1) {
        setShowGuestPrompt(true);
      }

      setInput("");

      toast({
        title: "✨ Thread magic complete!",
        description: `Created ${posts.length} perfectly sized posts for ${selectedPlatform}.`,
      });
    } catch (error) {
      console.error("Error generating thread:", error);
      toast({
        title: "Generation failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error generating your thread. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    setActiveChat(null);
    setInput("");
    setSelectedTones(defaultTones);
    setUseEmojis(defaultUseEmojis);
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setActiveChat(chatId);
      setSelectedPlatform(chat.platform as Platform);
      setSelectedTones(chat.tone);
      setUseEmojis(chat.useEmojis);
      setInput("");
      if (isMobile) {
        setIsSidebarCollapsed(true);
      }
    }
  };

  const editPost = async (
    messageId: string,
    postId: string,
    newContent: string
  ) => {
    const chat = chats.find((c) => c.id === activeChat);
    if (!chat) return;

    const message = chat.messages.find((m) => m.id === messageId);
    if (!message || !message.posts) return;

    const updatedPosts = message.posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            content: newContent,
            characterCount: newContent.length,
            isEditing: false,
          }
        : post
    );

    await updateMessage(activeChat!, messageId, { posts: updatedPosts });
  };

  const editUserMessage = async (messageId: string, newContent: string) => {
    await updateMessage(activeChat!, messageId, { content: newContent });
  };

  const toggleEditMode = (messageId: string, postId?: string) => {
    const chat = chats.find((c) => c.id === activeChat);
    if (!chat) return;

    const message = chat.messages.find((m) => m.id === messageId);
    if (!message) return;

    if (message.type === "user") {
      const updatedMessages = chat.messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, isEditing: !(msg as any).isEditing }
          : msg
      );

      const updatedChat = { ...chat, messages: updatedMessages };
      setChats((prev) =>
        prev.map((c) => (c.id === activeChat ? updatedChat : c))
      );
    } else if (message.posts && postId) {
      const updatedPosts = message.posts.map((post) =>
        post.id === postId ? { ...post, isEditing: !post.isEditing } : post
      );

      updateMessage(activeChat!, messageId, { posts: updatedPosts });
    }
  };

  const handleAIRewrite = (messageId: string, postId?: string) => {
    const chat = chats.find((c) => c.id === activeChat);
    if (!chat) return;

    const message = chat.messages.find((m) => m.id === messageId);
    if (!message) return;

    let content = "";
    if (message.type === "user") {
      content = message.content;
    } else if (message.posts && postId) {
      const post = message.posts.find((p) => p.id === postId);
      content = post?.content || "";
    }

    setRewriteContext({
      messageId,
      postId,
      content,
    });
    setShowAIRewriteDialog(true);
  };

  const handleApplyRewrite = async (newContent: string) => {
    if (!rewriteContext) return;

    const { messageId, postId } = rewriteContext;

    if (postId) {
      await editPost(messageId, postId, newContent);
    } else {
      await editUserMessage(messageId, newContent);
    }

    toast({
      title: "✨ Rewrite applied!",
      description: "Your content has been updated with the AI rewrite.",
    });
  };

  const getCharacterLimit = (platform: Platform) => {
    switch (platform) {
      case "twitter":
        return 280;
      case "linkedin":
        return 3000;
      case "threads":
        return 500;
      case "instagram":
        return 2200;
      case "facebook":
        return 63206;
      case "tiktok":
        return 300;
      default:
        return 280;
    }
  };

  // Add this to your component's imports or global styles
  const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgb(236 72 153 / 0.3), rgb(147 51 234 / 0.3));
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgb(236 72 153 / 0.5), rgb(147 51 234 / 0.5));
  }
  
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: transparent;
  }
  
  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgb(236 72 153 / 0.3) transparent;
  }
`;

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background/95 to-background/80 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Messages Left Indicator */}
      {!isPremium && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in-down">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg border border-pink-500/30 rounded-2xl px-4 py-2 shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-100">
                {actualMessageLimit === -1
                  ? "Unlimited"
                  : `${messagesLeft} messages left`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarCollapsed ? "w-0" : "w-80"
        } max-w-80 transition-all duration-300 ease-in-out bg-card/30 backdrop-blur-xl border-r border-border/30 flex flex-col h-screen overflow-hidden
  ${isMobile ? "fixed left-0 top-0 z-50" : "relative"}`}
      >
        {!isSidebarCollapsed && (
          <>
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
              isMobile={isMobile}
            />

            <div className="mt-auto p-4 border border-pink-500/20 space-y-3 bg-gradient-to-r from-background/80 via-background/90 to-background/80 backdrop-blur-sm w-full">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Heart className="w-3 h-3 text-pink-400 animate-pulse flex-shrink-0" />
                <span className="truncate">
                  Designed & Built by{" "}
                  <span className="text-pink-400 font-medium">Aarav</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Coffee className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="truncate">Powered by creativity</span>
              </div>

              <div className="flex flex-col space-y-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/premium")}
                  className="w-full max-w-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-500/20 dark:to-purple-500/20 hover:from-pink-200 hover:to-purple-200 dark:hover:from-pink-500/40 dark:hover:to-purple-500/40 border border-pink-500/30 text-pink-700 dark:text-pink-300 hover:text-pink-900 dark:hover:text-pink-100 transition-all duration-300 ease-in-out text-xs h-8 px-3 py-1 rounded-md shadow-sm overflow-hidden"
                >
                  <Crown className="w-3 h-3 mr-2 text-pink-600 dark:text-pink-200 flex-shrink-0" />
                  <span className="truncate">Upgrade to Premium</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/support")}
                  className="w-full max-w-full hover:bg-purple-500/10 text-purple-300 hover:text-purple-200 text-xs h-8 overflow-hidden"
                >
                  <span className="truncate">Support</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-border/30 backdrop-blur-sm bg-background/80 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {isSidebarCollapsed && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="hover:bg-pink-500/10"
                >
                  ☰
                </Button>

                {!isMobile && (
                  <div className="flex items-center space-x-3 animate-slide-in-left">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center animate-pulse">
                      <Sparkles className="h-5 w-5 text-white animate-spin-slow" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      ThreadCutter
                    </h1>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <PlatformToggle
              selected={selectedPlatform}
              onSelect={setSelectedPlatform}
            />
            <SettingsDialog
              isDarkMode={isDarkMode}
              onThemeToggle={() => setIsDarkMode(!isDarkMode)}
              defaultTone={defaultTones[0]}
              onDefaultToneChange={(tone) => setDefaultTones([tone])}
              userProfile={userProfile}
              onProfileUpdate={handleProfileUpdate}
              //onShowPremium={() => setShowPremiumDialog(true)}
            />
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="hover:bg-pink-500/10"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignIn}
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable Main Content Area */}
        <>
          <style dangerouslySetInnerHTML={{ __html: customScrollbarStyles }} />

          {/* Scrollable Main Content Area */}
          <div
            className="flex-1 overflow-y-auto custom-scrollbar"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgb(236 72 153 / 0.3) transparent",
            }}
          >
            <main className="max-w-4xl mx-auto p-6 space-y-8 w-full">
              {/* Enhanced Guest/Premium Status */}
              {isGuest && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20 p-6 animate-slide-in-up">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                  <div className="relative text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="w-5 h-5 text-pink-400 animate-bounce" />
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                        Welcome, Creative Explorer!
                      </h3>
                      <Crown className="w-5 h-5 text-purple-400 animate-bounce delay-100" />
                    </div>
                    <p className="text-muted-foreground">
                      You're experiencing ThreadCutter in{" "}
                      <span className="text-pink-400 font-medium">
                        Guest Mode
                      </span>{" "}
                      with {messagesLeft} messages remaining.{" "}
                      <button
                        onClick={handleSignIn}
                        className="inline-flex items-center space-x-1 text-pink-400 hover:text-pink-300 underline underline-offset-2 transition-colors group"
                      >
                        <span>Join the community</span>
                        <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                      </button>{" "}
                      for more features!
                    </p>
                  </div>
                </div>
              )}

              {isPremium && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/20 p-6 animate-slide-in-up">
                  <div className="relative text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="w-5 h-5 text-yellow-400 animate-bounce" />
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                        Premium Active ✨
                      </h3>
                    </div>
                    <p className="text-muted-foreground">
                      You have{" "}
                      <span className="text-yellow-400 font-medium">
                        unlimited messages
                      </span>{" "}
                      and access to all premium features!
                    </p>
                  </div>
                </div>
              )}

              {/* Welcome Message or Chat Content */}
              {currentMessages.length === 0 && !input && (
                <div className="text-center py-16 space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-shift">
                      Transform Ideas into Threads
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                      Turn your long-form thoughts into perfectly crafted social
                      media threads.
                      <br />
                      <span className="text-pink-400 font-medium">
                        Paste, polish, and publish
                      </span>{" "}
                      with AI-powered precision.
                    </p>
                  </div>

                  <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                      <span>Smart splitting</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                      <span>Multiple tones</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-400"></div>
                      <span>Multi-platform</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="space-y-6">
                {currentMessages.map((message, messageIndex) => (
                  <div key={message.id}>
                    {message.type === "user" ? (
                      <ChatBubble
                        type="user"
                        content={message.content}
                        animationDelay={messageIndex * 200}
                        isEditing={(message as any).isEditing}
                        allowUserEdit={true}
                        onEdit={(content) =>
                          editUserMessage(message.id, content)
                        }
                        onToggleEdit={() => toggleEditMode(message.id)}
                        onAIRewrite={() => handleAIRewrite(message.id)}
                      />
                    ) : (
                      <div className="space-y-4">
                        {message.posts?.map((post, postIndex) => (
                          <ChatBubble
                            key={post.id}
                            type="ai"
                            content={post.content}
                            index={post.index}
                            total={post.total}
                            characterCount={post.characterCount}
                            characterLimit={getCharacterLimit(selectedPlatform)}
                            isEditing={post.isEditing}
                            onEdit={(content) =>
                              editPost(message.id, post.id, content)
                            }
                            onToggleEdit={() =>
                              toggleEditMode(message.id, post.id)
                            }
                            onAIRewrite={() =>
                              handleAIRewrite(message.id, post.id)
                            }
                            animationDelay={postIndex * 200}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {input && (
                  <ChatBubble
                    type="user"
                    content={input}
                    isProcessing={isProcessing}
                  />
                )}

                {isProcessing && <LoadingAnimation />}
              </div>
            </main>
          </div>
        </>

        {/* Fixed Input Area at Bottom */}
        <div className="bg-gradient-to-t from-background via-background/95 to-background/80 backdrop-blur-xl border-t border-border/30 flex-shrink-0">
          <div className="max-w-4xl mx-auto p-4 space-y-2">
            <ToneSelector
              selectedTones={selectedTones}
              onTonesChange={handleToneToggle}
              toneOptions={TONE_OPTIONS}
              isPremium={isPremium}
            />

            {/* Input Area */}
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts, ideas, or stories here... ✨"
                className="min-h-[80px] max-h-[120px] resize-none bg-card/50 backdrop-blur-sm border-2 border-border/50 focus:border-pink-500/50 rounded-2xl pr-16 pb-6 transition-all duration-300 hover:border-border focus:ring-2 focus:ring-pink-500/20"
                rows={1}
                style={{ height: "auto" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height =
                    Math.min(target.scrollHeight, 120) + "px";
                }}
              />

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  {input.length} characters
                </div>

                {/* Emoji Toggle */}
                <Button
                  variant={useEmojis ? "default" : "outline"}
                  size="sm"
                  onClick={handleEmojiToggle}
                  className={`
                h-6 px-2 text-xs transition-all duration-200
                ${
                  useEmojis
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-transparent"
                    : "hover:border-pink-500/50 hover:bg-pink-500/10"
                }
                ${!isPremium ? "opacity-50 cursor-not-allowed" : ""}
              `}
                  disabled={!isPremium}
                  title={
                    !isPremium
                      ? "Premium feature - Upgrade to use emojis"
                      : "Toggle emoji usage"
                  }
                >
                  <span className="mr-1">😊</span>
                  {useEmojis ? "On" : "Off"}
                  {!isPremium && (
                    <Crown className="w-2 h-2 ml-1 text-yellow-400" />
                  )}
                </Button>
              </div>

              {/* Send Button */}
              <Button
                onClick={splitIntoThreads}
                disabled={!input.trim() || isProcessing}
                className="absolute bottom-4 right-4 h-10 w-10 p-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                size="sm"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <GuestSignupPrompt
        open={showGuestPrompt}
        messagesLeft={Math.max(0, actualMessageLimit - actualMessagesUsed)}
        onSignup={() => navigate("/auth")}
        onDismiss={() => setShowGuestPrompt(false)}
      />

      <PremiumDialog
        isOpen={showPremiumDialog}
        onClose={() => setShowPremiumDialog(false)}
      />

      <AIRewriteDialog
        isOpen={showAIRewriteDialog}
        onClose={() => setShowAIRewriteDialog(false)}
        originalContent={rewriteContext?.content || ""}
        platform={selectedPlatform}
        currentTones={selectedTones}
        useEmojis={useEmojis}
        isPremium={isPremium}
        onApplyRewrite={handleApplyRewrite}
      />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-gradientShift {
          background-size: 200% 200%;
          animation: gradientShift 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ThreadCutter;
