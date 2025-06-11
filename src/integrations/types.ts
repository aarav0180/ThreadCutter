// Platform types for social media integrations
export type Platform = 'twitter' | 'linkedin' | 'threads' | 'instagram';

// Optional: Platform configuration interface if you need additional metadata
export interface PlatformConfig {
  id: Platform;
  name: string;
  color: string;
  baseUrl: string;
}

// Optional: Platform-specific post configuration
export interface PlatformPostConfig {
  platform: Platform;
  maxLength: number;
  supportsImages: boolean;
  supportsVideos: boolean;
  supportsPolls: boolean;
}

// Example platform configurations (optional)
export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  twitter: {
    id: 'twitter',
    name: 'X',
    color: '#000000',
    baseUrl: 'https://x.com'
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0077B5',
    baseUrl: 'https://linkedin.com'
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    color: '#000000',
    baseUrl: 'https://threads.net'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    baseUrl: 'https://instagram.com'
  }
};

// Example post configurations (optional)
export const PLATFORM_POST_CONFIGS: Record<Platform, PlatformPostConfig> = {
  twitter: {
    platform: 'twitter',
    maxLength: 280,
    supportsImages: true,
    supportsVideos: true,
    supportsPolls: true
  },
  linkedin: {
    platform: 'linkedin',
    maxLength: 3000,
    supportsImages: true,
    supportsVideos: true,
    supportsPolls: true
  },
  threads: {
    platform: 'threads',
    maxLength: 500,
    supportsImages: true,
    supportsVideos: true,
    supportsPolls: false
  },
  instagram: {
    platform: 'instagram',
    maxLength: 2200,
    supportsImages: true,
    supportsVideos: true,
    supportsPolls: false
  }
};