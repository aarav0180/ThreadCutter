
// Utility for tracking message usage with device fingerprinting
export interface MessageUsage {
  count: number;
  date: string;
  userId?: string;
  deviceId: string;
}

// Generate a device fingerprint
const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  // Type assertion for experimental navigator properties
  const nav = navigator as any;
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 0,
    nav.deviceMemory || 0
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

const STORAGE_KEY = 'threadcutter_usage';

export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = generateDeviceFingerprint();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getMessageUsage = (userId?: string): MessageUsage => {
  const deviceId = getDeviceId();
  const today = getTodayString();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, MessageUsage> = stored ? JSON.parse(stored) : {};
    
    // Create a unique key for this user/device combination
    const key = userId ? `user_${userId}_${deviceId}` : `guest_${deviceId}`;
    
    const usage = data[key];
    
    // If no usage or different date, reset count
    if (!usage || usage.date !== today) {
      return {
        count: 0,
        date: today,
        userId,
        deviceId
      };
    }
    
    return usage;
  } catch {
    return {
      count: 0,
      date: today,
      userId,
      deviceId
    };
  }
};

export const updateMessageUsage = (userId?: string, increment: number = 1): MessageUsage => {
  const deviceId = getDeviceId();
  const today = getTodayString();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, MessageUsage> = stored ? JSON.parse(stored) : {};
    
    const key = userId ? `user_${userId}_${deviceId}` : `guest_${deviceId}`;
    const currentUsage = getMessageUsage(userId);
    
    const newUsage: MessageUsage = {
      count: currentUsage.count + increment,
      date: today,
      userId,
      deviceId
    };
    
    data[key] = newUsage;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    return newUsage;
  } catch {
    return {
      count: increment,
      date: today,
      userId,
      deviceId
    };
  }
};

export const resetMessageUsage = (userId?: string): void => {
  const deviceId = getDeviceId();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, MessageUsage> = stored ? JSON.parse(stored) : {};
    
    const key = userId ? `user_${userId}_${deviceId}` : `guest_${deviceId}`;
    delete data[key];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore errors
  }
};

export const getMessageLimit = (isPremium: boolean, isGuest: boolean): number => {
  if (isPremium) return -1; // Unlimited
  if (isGuest) return 3; // Guest users
  return 5; // Free registered users
};
