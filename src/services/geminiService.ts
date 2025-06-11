export interface GeminiPost {
  content: string;
  characterCount: number;
  hashtags?: string[];
  mentions?: string[];
}

export interface GeminiResponse {
  posts: GeminiPost[];
  success: boolean;
  error?: string;
  metadata: {
    totalPosts: number;
    platform: string;
    tones: string[];
    useEmojis: boolean;
    totalCharacters: number;
  };
}

export interface GeminiRequestOptions {
  prompt: string;
  tones: string[];
  platform: string;
  useEmojis: boolean;
  maxPosts?: number;
  customInstructions?: string;
}

export const callGeminiAPI = async (options: GeminiRequestOptions): Promise<GeminiResponse> => {
  const { prompt, tones, platform, useEmojis, maxPosts = 10, customInstructions } = options;
  
  try {
    const api = import.meta.env.VITE_GEMINI_API_KEY;

    if (!api) {
      console.error('VITE_GEMINI_API_KEY not found in environment variables');
    }

    // Use mock API key if real one is not available
    const apiKey = api || 'AIzaSyCGGVj56mBU2c65cA7xuQBLSQ1bY1RjSBI';
    
    // Enhanced tone instructions with combinations
    const toneInstructions = {
      funny: "Use humor, wit, clever wordplay, and entertaining content that makes people smile or laugh",
      creative: "Be imaginative, unique, artistic, and use creative storytelling with fresh perspectives",
      direct: "Be clear, concise, straightforward, and get straight to the point without fluff",
      formal: "Use professional, business-appropriate language with proper grammar and respectful tone",
      neutral: "Maintain a balanced, informative approach that's neither too casual nor too formal",
      inspirational: "Motivate and uplift with positive messaging and encouraging language",
      conversational: "Write as if talking to a friend - casual, relatable, and approachable",
      educational: "Focus on teaching, explaining, and providing valuable information clearly",
      emotional: "Connect deeply with feelings and create emotional resonance with the audience",
      bold: "Be confident, assertive, and take strong positions with powerful language"
    };

    const platformSpecs = {
      twitter: {
        charLimit: 280,
        features: "Use threads for longer content, trending hashtags, @mentions, and Twitter-specific formatting",
        bestPractices: "Keep tweets punchy, use line breaks for readability, encourage engagement"
      },
      linkedin: {
        charLimit: 3000,
        features: "Professional networking focus, industry insights, thought leadership, professional hashtags",
        bestPractices: "Start with a hook, use white space, end with a question or call-to-action"
      },
      threads: {
        charLimit: 500,
        features: "Instagram's text-based platform, casual but engaging, visual storytelling",
        bestPractices: "Use thread format for longer stories, include relevant hashtags, encourage discussion"
      },
      instagram: {
        charLimit: 2200,
        features: "Visual-first platform, lifestyle focus, story-driven captions, hashtag strategy",
        bestPractices: "Start strong, tell a story, use strategic hashtags, include call-to-action"
      },
      facebook: {
        charLimit: 63206,
        features: "Community-focused, longer form content, link sharing, event promotion",
        bestPractices: "Use engaging openings, break up long text, encourage comments and shares"
      },
      tiktok: {
        charLimit: 300,
        features: "Short, catchy descriptions for videos, trending sounds, challenges",
        bestPractices: "Use trending hashtags, reference current events, create curiosity"
      }
    };

    const combinedTones = tones.map(tone => 
      toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.neutral
    ).join('. Additionally, ');

    const platformInfo = platformSpecs[platform as keyof typeof platformSpecs] || platformSpecs.twitter;

    const enhancedPrompt = `
You are an expert social media content creator and copywriter. Your task is to transform content for ${platform} with multiple tone requirements and specific formatting.

CONTENT TO TRANSFORM: "${prompt}"

TONE REQUIREMENTS: ${combinedTones}

PLATFORM SPECIFICATIONS:
- Platform: ${platform}
- Character limit per post: ${platformInfo.charLimit}
- Platform features: ${platformInfo.features}
- Best practices: ${platformInfo.bestPractices}

EMOJI USAGE: ${useEmojis ? 'YES - Use relevant emojis strategically to enhance engagement and readability' : 'NO - Do not use any emojis'}

CUSTOM INSTRUCTIONS: ${customInstructions || 'None'}

REQUIREMENTS:
1. Create engaging, ${platform}-optimized content that combines all specified tones naturally
2. Split into multiple posts if needed, keeping each within character limits
3. Each post should be complete and engaging on its own
4. Maximum ${maxPosts} posts total
5. Include relevant hashtags appropriate for ${platform}
6. Add strategic mentions (@username) where relevant
7. Ensure content flows naturally across posts if creating a thread/series

OUTPUT FORMAT REQUIREMENT:
Return ONLY a valid JSON object with this exact structure:
{
  "posts": [
    {
      "content": "The actual post content here",
      "characterCount": 150,
      "hashtags": ["hashtag1", "hashtag2"],
      "mentions": ["@username1", "@username2"]
    }
  ],
  "metadata": {
    "totalPosts": 1,
    "platform": "${platform}",
    "tones": ${JSON.stringify(tones)},
    "useEmojis": ${useEmojis},
    "totalCharacters": 150
  }
}

IMPORTANT: 
- Do not include any text before or after the JSON
- Ensure all content is appropriate and engaging for ${platform}
- Character count should be accurate for each post
- Include empty arrays for hashtags/mentions if none are used
- Make sure the JSON is properly formatted and valid
`;

    // If using mock API key, return enhanced mock response
    if (apiKey === 'AIzadklj.fnak.aSyCGGVj56mBU2c65cA7xuQBLSQ1bY1RjSBI') {
      console.log('Using enhanced mock Gemini API response');
      
      const mockPosts: GeminiPost[] = [];
      const limit = platformInfo.charLimit;
      
      // Create more sophisticated mock content
      if (prompt.length <= limit - 50) {
        const emojiPrefix = useEmojis ? '✨ ' : '';
        const mockHashtags = platform === 'instagram' ? ['content', 'socialmedia'] : 
                           platform === 'linkedin' ? ['professional', 'insights'] : 
                           ['trending', 'thoughts'];
        
        const mockContent = `${emojiPrefix}${prompt}${useEmojis ? ' 🚀' : ''}`;
        mockPosts.push({
          content: mockContent,
          characterCount: mockContent.length,
          hashtags: mockHashtags,
          mentions: []
        });
      } else {
        // Split into multiple posts
        const words = prompt.split(' ');
        let currentPost = '';
        let postIndex = 1;
        const totalPosts = Math.min(Math.ceil(words.length / 10), maxPosts);
        
        for (const word of words) {
          if ((currentPost + ' ' + word).length > limit - 50) {
            const emojiSuffix = useEmojis ? ` ${postIndex === 1 ? '🧵' : '👇'}` : '';
            const threadIndicator = totalPosts > 1 ? `${postIndex}/${totalPosts} ` : '';
            const finalContent = `${threadIndicator}${currentPost.trim()}${emojiSuffix}`;
            
            mockPosts.push({
              content: finalContent,
              characterCount: finalContent.length,
              hashtags: postIndex === 1 ? ['thread', 'content'] : [],
              mentions: []
            });
            
            currentPost = word;
            postIndex++;
            
            if (postIndex > maxPosts) break;
          } else {
            currentPost = currentPost ? currentPost + ' ' + word : word;
          }
        }
        
        if (currentPost && postIndex <= maxPosts) {
          const emojiSuffix = useEmojis ? ' ✅' : '';
          const threadIndicator = totalPosts > 1 ? `${postIndex}/${totalPosts} ` : '';
          const finalContent = `${threadIndicator}${currentPost.trim()}${emojiSuffix}`;
          
          mockPosts.push({
            content: finalContent,
            characterCount: finalContent.length,
            hashtags: ['end', 'thread'],
            mentions: []
          });
        }
      }

      const totalCharacters = mockPosts.reduce((sum, post) => sum + post.characterCount, 0);

      return {
        posts: mockPosts,
        success: true,
        metadata: {
          totalPosts: mockPosts.length,
          platform,
          tones,
          useEmojis,
          totalCharacters
        }
      };
    }

    // Real API call with enhanced configuration
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.8, // Slightly higher for more creativity
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096, // Increased for longer responses
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedContent = data.candidates[0].content.parts[0].text.trim();
    
    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean the response - remove any markdown formatting or extra text
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : generatedContent;
      
      parsedResponse = JSON.parse(jsonString);
      
      // Validate the structure
      if (!parsedResponse.posts || !Array.isArray(parsedResponse.posts)) {
        throw new Error('Invalid response structure');
      }

      // Ensure all posts have required fields
      parsedResponse.posts = parsedResponse.posts.map((post: any) => ({
        content: post.content || '',
        characterCount: post.characterCount || post.content?.length || 0,
        hashtags: post.hashtags || [],
        mentions: post.mentions || []
      }));

      // Calculate total characters if not provided
      const totalCharacters = parsedResponse.posts.reduce((sum: number, post: GeminiPost) => 
        sum + post.characterCount, 0);

      return {
        posts: parsedResponse.posts,
        success: true,
        metadata: {
          totalPosts: parsedResponse.posts.length,
          platform,
          tones,
          useEmojis,
          totalCharacters,
          ...parsedResponse.metadata
        }
      };

    } catch (parseError) {
      console.error('JSON parsing failed, attempting fallback processing');
      
      // Fallback: Create structured response from unstructured content
      const fallbackPosts = createFallbackPosts(generatedContent, platform, platformInfo.charLimit, useEmojis);
      const totalCharacters = fallbackPosts.reduce((sum, post) => sum + post.characterCount, 0);

      return {
        posts: fallbackPosts,
        success: true,
        metadata: {
          totalPosts: fallbackPosts.length,
          platform,
          tones,
          useEmojis,
          totalCharacters
        }
      };
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      posts: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      metadata: {
        totalPosts: 0,
        platform,
        tones,
        useEmojis,
        totalCharacters: 0
      }
    };
  }
};

// Helper function for fallback post creation
function createFallbackPosts(content: string, platform: string, charLimit: number, useEmojis: boolean): GeminiPost[] {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim());
  const posts: GeminiPost[] = [];
  let currentPost = "";

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;

    const potentialPost = currentPost ? `${currentPost} ${trimmedSentence}.` : `${trimmedSentence}.`;
    
    if (potentialPost.length <= charLimit - 50) {
      currentPost = potentialPost;
    } else {
      if (currentPost) {
        posts.push({
          content: currentPost.trim(),
          characterCount: currentPost.trim().length,
          hashtags: extractHashtags(currentPost),
          mentions: extractMentions(currentPost)
        });
      }
      currentPost = `${trimmedSentence}.`;
    }
  }

  if (currentPost) {
    posts.push({
      content: currentPost.trim(),
      characterCount: currentPost.trim().length,
      hashtags: extractHashtags(currentPost),
      mentions: extractMentions(currentPost)
    });
  }

  return posts.length > 0 ? posts : [{
    content: content.substring(0, charLimit - 10) + "...",
    characterCount: Math.min(content.length, charLimit - 10) + 3,
    hashtags: [],
    mentions: []
  }];
}

// Helper functions for extracting hashtags and mentions
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.substring(1)) : [];
}

function extractMentions(text: string): string[] {
  const mentionRegex = /@[\w]+/g;
  const matches = text.match(mentionRegex);
  return matches || [];
}