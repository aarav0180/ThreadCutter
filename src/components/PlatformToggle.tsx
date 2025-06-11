
import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Linkedin, Twitter } from 'lucide-react';
import { Platform } from "../types/platform";

interface PlatformToggleProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
}

const PlatformToggle = ({ selected, onSelect }: PlatformToggleProps) => {
  const platforms = [
    { id: 'twitter' as Platform, name: 'X', icon: Twitter },
    { id: 'linkedin' as Platform, name: 'LinkedIn', icon: Linkedin },
    { id: 'threads' as Platform, name: 'Threads', icon: Twitter },
    { id: 'instagram' as Platform, name: 'Instagram', icon: Instagram },
  ];

  return (
    <div className="flex gap-2 border border-pink-500/20 backdrop-blur-md rounded-xl shadow-md">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        const isSelected = selected === platform.id;

        return (
          <Button
            key={platform.id}
            variant={isSelected ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSelect(platform.id)}
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all
              ${isSelected 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm' 
                : 'text-foreground hover:bg-pink-500/10'}`
            }
          >
            <Icon className="w-4 h-4" style={{ color: '#ffffff' }} />
            <span className="hidden md:inline font-medium">{platform.name}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default PlatformToggle;
