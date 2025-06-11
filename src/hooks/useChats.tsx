
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface ThreadPost {
  id: string;
  content: string;
  isEditing: boolean;
  index: number;
  total: number;
  characterCount: number;
  hashtags?: string[];
  mentions?: string[];
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  posts?: ThreadPost[];
  platform?: string;
  tone?: string[];
  useEmojis?: boolean;
  isEditing?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  preview: string;
  messages: Message[];
  platform: string;
  tone: string[];
  useEmojis: boolean;
}

// Helper function to convert database posts to ThreadPost[]
const convertDbPostsToThreadPosts = (dbPosts: any): ThreadPost[] | undefined => {
  if (!dbPosts || !Array.isArray(dbPosts)) return undefined;
  
  return dbPosts.map(post => ({
    id: post.id || uuidv4(),
    content: post.content || '',
    isEditing: false,
    index: post.index || 1,
    total: post.total || 1,
    characterCount: post.characterCount || post.content?.length || 0,
    hashtags: post.hashtags || [],
    mentions: post.mentions || []
  }));
};

// Helper function to convert ThreadPost[] to database format
const convertThreadPostsToDb = (posts: ThreadPost[]) => {
  return posts.map(post => ({
    id: post.id,
    content: post.content,
    index: post.index,
    total: post.total,
    characterCount: post.characterCount,
    hashtags: post.hashtags || [],
    mentions: post.mentions || []
  }));
};

export const useChats = (userId?: string) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load chats from database
  const loadChats = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (chatsError) {
        console.error('Error loading chats:', chatsError);
        throw chatsError;
      }

      const chatsWithMessages = await Promise.all(
        (chatsData || []).map(async (chat) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: true });

          if (messagesError) {
            console.error('Error loading messages for chat:', chat.id, messagesError);
            throw messagesError;
          }

          const messages: Message[] = (messagesData || []).map(msg => ({
            id: msg.id,
            type: msg.type as 'user' | 'ai',
            content: msg.content,
            timestamp: new Date(msg.created_at),
            posts: convertDbPostsToThreadPosts(msg.posts),
            platform: chat.platform,
            tone: chat.tones,
            useEmojis: chat.use_emojis
          }));

          return {
            id: chat.id,
            title: chat.title,
            createdAt: new Date(chat.created_at),
            preview: chat.title,
            messages,
            platform: chat.platform,
            tone: chat.tones,
            useEmojis: chat.use_emojis
          };
        })
      );

      setChats(chatsWithMessages);
    } catch (error) {
      console.error('Error loading chats:', error);
      toast({
        title: "Failed to load chats",
        description: "There was an error loading your chat history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save chat to database
  const saveChat = async (chat: Chat) => {
    if (!userId) {
      // For guests, just update local state
      setChats(prev => {
        const existing = prev.find(c => c.id === chat.id);
        if (existing) {
          return prev.map(c => c.id === chat.id ? chat : c);
        } else {
          return [chat, ...prev];
        }
      });
      return;
    }

    try {
      console.log('Saving chat with ID:', chat.id);
      
      // Ensure chat ID is a valid UUID
      let chatId = chat.id;
      if (!chatId || !chatId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
        chatId = uuidv4();
        chat.id = chatId;
      }

      // Save chat with proper UUID
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .upsert({
          id: chatId,
          user_id: userId,
          title: chat.title,
          platform: chat.platform,
          tones: chat.tone,
          use_emojis: chat.useEmojis,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (chatError) {
        console.error('Error saving chat:', chatError);
        throw chatError;
      }

      console.log('Chat saved successfully:', chatData);

      // Save messages
      for (const message of chat.messages) {
        let messageId = message.id;
        if (!messageId || !messageId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
          messageId = uuidv4();
          message.id = messageId;
        }

        const { error: messageError } = await supabase
          .from('chat_messages')
          .upsert({
            id: messageId,
            chat_id: chatId,
            type: message.type,
            content: message.content,
            posts: message.posts ? convertThreadPostsToDb(message.posts) : null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (messageError) {
          console.error('Error saving message:', messageError);
          throw messageError;
        }
      }

      // Update local state
      setChats(prev => {
        const existing = prev.find(c => c.id === chatId);
        if (existing) {
          return prev.map(c => c.id === chatId ? { ...chat, id: chatId } : c);
        } else {
          return [{ ...chat, id: chatId }, ...prev];
        }
      });

    } catch (error) {
      console.error('Error saving chat:', error);
      toast({
        title: "Failed to save chat",
        description: "There was an error saving your chat.",
        variant: "destructive",
      });
    }
  };

  // Update message in database and local state
  const updateMessage = async (chatId: string, messageId: string, updates: Partial<Message>) => {
    try {
      const chat = chats.find(c => c.id === chatId);
      if (!chat) return;

      const updatedMessages = chat.messages.map(msg =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      );

      const updatedChat = { ...chat, messages: updatedMessages };
      
      // Update database only if user is logged in
      if (userId && (updates.content !== undefined || updates.posts !== undefined)) {
        const { error } = await supabase
          .from('chat_messages')
          .update({
            content: updates.content,
            posts: updates.posts ? convertThreadPostsToDb(updates.posts) : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', messageId);

        if (error) {
          console.error('Error updating message:', error);
          throw error;
        }
      }

      // Update local state
      setChats(prev => prev.map(c => c.id === chatId ? updatedChat : c));

    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "Failed to update message",
        description: "There was an error updating your message.",
        variant: "destructive",
      });
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      if (userId) {
        const { error } = await supabase
          .from('chats')
          .delete()
          .eq('id', chatId);

        if (error) throw error;
      }

      setChats(prev => prev.filter(c => c.id !== chatId));
      
      toast({
        title: "Chat deleted",
        description: "Your chat has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Failed to delete chat",
        description: "There was an error deleting your chat.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (userId) {
      loadChats();
    }
  }, [userId]);

  return {
    chats,
    isLoading,
    saveChat,
    updateMessage,
    deleteChat,
    setChats
  };
};
