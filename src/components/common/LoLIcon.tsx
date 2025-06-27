import { useState } from 'react';
import { IconType, getIconUrl, getIconFallback, getIconAlt } from '../../assets/iconMappings';

interface LoLIconProps {
  type: IconType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  title?: string;
  animate?: boolean;
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5', 
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
  '2xl': 'w-16 h-16'
};

export default function LoLIcon({ 
  type, 
  size = 'md', 
  className = '', 
  title, 
  animate = false 
}: LoLIconProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const iconUrl = getIconUrl(type);
  const fallbackEmoji = getIconFallback(type);
  const altText = title || getIconAlt(type);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    console.warn(`Failed to load LoL icon for type: ${type}, falling back to emoji`);
  };

  const baseClasses = `inline-block object-contain ${sizeClasses[size]} ${className}`;
  const animationClasses = animate ? 'transition-all duration-300 hover:scale-110' : '';

  // If image failed to load or is still loading, show emoji fallback
  if (imageError || !iconUrl) {
    return (
      <span 
        className={`${baseClasses} ${animationClasses} flex items-center justify-center`}
        title={altText}
        role="img"
        aria-label={altText}
      >
        {fallbackEmoji}
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      {/* Loading state */}
      {isLoading && (
        <div 
          className={`${baseClasses} ${animationClasses} flex items-center justify-center bg-gray-700/50 rounded animate-pulse`}
        >
          <span className="text-xs text-gray-400">{fallbackEmoji}</span>
        </div>
      )}
      
      {/* LoL Asset Image */}
      <img
        src={iconUrl}
        alt={altText}
        title={altText}
        className={`
          ${baseClasses} 
          ${animationClasses} 
          rounded 
          ${isLoading ? 'absolute inset-0 opacity-0' : 'opacity-100'}
          transition-opacity duration-300
        `}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
}