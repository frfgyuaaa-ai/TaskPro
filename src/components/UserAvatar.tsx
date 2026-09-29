import React from 'react';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  avatarColor?: string;
}

const SIZE_MAP = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-20 h-20 text-2xl',
};

const COLOR_GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-pink-600',
  'from-emerald-600 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-cyan-600 to-blue-600',
  'from-rose-600 to-red-600',
];

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatar,
  size = 'md',
  className = '',
  avatarColor,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Generate initials (e.g. "Sarah Connor" -> "SC", "Alisher" -> "A")
  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Consistent gradient based on name hash
  const getGradient = (n: string) => {
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLOR_GRADIENTS.length;
    return COLOR_GRADIENTS[index];
  };

  const isUrl = avatar && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image'));

  if (isUrl && !imageError) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImageError(true)}
        className={`${SIZE_MAP[size]} rounded-full object-cover shrink-0 select-none ${className}`}
      />
    );
  }

  const gradient = avatarColor || getGradient(name || 'User');

  return (
    <div
      className={`${SIZE_MAP[size]} rounded-full bg-gradient-to-tr ${gradient} text-white font-bold flex items-center justify-center shrink-0 shadow-xs select-none ${className}`}
      title={name}
    >
      <span>{getInitials(name)}</span>
    </div>
  );
};
