import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, ChevronDown, X, Plus, Check } from 'lucide-react';

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgb(236 72 153 / 0.4), rgb(147 51 234 / 0.4));
    border-radius: 3px;
    transition: all 0.2s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgb(236 72 153 / 0.7), rgb(147 51 234 / 0.7));
  }
  
  .custom-scrollbar::-webkit-scrollbar-corner {
    background: transparent;
  }
`;

interface ToneOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface ToneSelectorProps {
  selectedTones: string[];
  onTonesChange: (tone: string) => void;
  toneOptions: ToneOption[];
  isPremium: boolean;
}

const ToneSelector = ({
  selectedTones,
  onTonesChange,
  toneOptions,
  isPremium,
}: ToneSelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 240; // max-height in pixels
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      calculateDropdownPosition();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleToneClick = (toneValue: string) => {
    onTonesChange(toneValue);
    
    // Close dropdown for non-premium users after selection
    if (!isPremium) {
      setIsDropdownOpen(false);
    }
  };

  const removeTone = (toneValue: string, event: React.MouseEvent) => {
    // Stop the event from bubbling up to the parent button
    event.preventDefault();
    event.stopPropagation();
    
    // For premium users, remove the specific tone
    if (isPremium) {
      onTonesChange(toneValue);
    }
  };

  const getSelectedToneObjects = () => {
    return toneOptions.filter(tone => selectedTones.includes(tone.value));
  };

  const getAllTones = () => {
    return toneOptions;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Tone:</span>
      
      {/* Selected Tones - Compact Display */}
      {getSelectedToneObjects().slice(0, 2).map((tone) => (
        <Button
          key={tone.value}
          variant="default"
          size="sm"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-transparent h-7 text-xs px-2"
          title={tone.description}
        >
          <span className="mr-1">{tone.icon}</span>
          {tone.label}
          {isPremium && (
            <button
              onClick={(e) => removeTone(tone.value, e)}
              className="ml-1 hover:bg-white/20 rounded-full p-0.5 flex items-center justify-center w-4 h-4"
              aria-label={`Remove ${tone.label} tone`}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </Button>
      ))}

      {/* Show "+X more" if there are more than 2 selected tones */}
      {selectedTones.length > 2 && (
        <Button
          variant="default"
          size="sm"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-transparent h-7 text-xs px-2"
          onClick={handleDropdownToggle}
        >
          +{selectedTones.length - 2} more
        </Button>
      )}

      {/* Tone Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Button
          ref={buttonRef}
          variant="outline"
          size="sm"
          onClick={handleDropdownToggle}
          className="hover:border-pink-500/50 hover:bg-pink-500/10 h-7 text-xs px-2"
        >
          <Plus className="w-3 h-3 mr-1" />
          {isPremium ? 'Manage Tones' : 'Change Tone'}
          <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isDropdownOpen && (
          <div 
            className={`absolute left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-64 max-h-60 overflow-y-auto custom-scrollbar ${
              dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full'
            }`}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgb(219 39 119 / 0.3) transparent'
            }}
          >
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-1">
                {isPremium ? 'Select multiple tones:' : 'Choose one tone:'}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {getAllTones().map((tone) => {
                  const isSelected = selectedTones.includes(tone.value);
                  return (
                    <button
                      key={tone.value}
                      onClick={() => handleToneClick(tone.value)}
                      className={`w-full text-left px-2 py-2 rounded-md transition-colors text-sm flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30' 
                          : 'hover:bg-muted/50'
                      }`}
                      title={tone.description}
                    >
                      <div className="flex items-center justify-center w-5 h-5">
                        {isSelected ? (
                          <Check className="w-3 h-3 text-pink-600" />
                        ) : (
                          <span className="text-sm">{tone.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${isSelected ? 'text-pink-700' : ''}`}>
                          {tone.label}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {tone.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {isPremium && selectedTones.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border">
                  <button
                    onClick={() => {
                      selectedTones.forEach(tone => onTonesChange(tone));
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all tones
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {selectedTones.length > 0 && (
        <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-2 py-1 rounded-full border border-pink-500/20">
          <Crown className={`w-3 h-3 ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`} />
          <span>
            {isPremium 
              ? `${selectedTones.length} tone${selectedTones.length > 1 ? 's' : ''}`
              : 'Single tone mode'
            }
          </span>
        </div>
      )}
    </div>
    </>
  );
};

export default ToneSelector;
