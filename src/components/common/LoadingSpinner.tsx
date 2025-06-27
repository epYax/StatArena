import LoLIcon from './LoLIcon';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', message, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizeClasses[size]} border-4 border-lol-gold/30 border-t-lol-gold rounded-full animate-spin`}></div>
      {message && (
        <p className={`text-lol-gold-light ${textSizes[size]} animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}

// Battle-specific loading states
interface BattleLoadingProps {
  phase: 'loading_data' | 'generating_stats' | 'calculating' | 'applying_damage';
}

export function BattleLoading({ phase }: BattleLoadingProps) {
  const messages = {
    loading_data: 'Loading match data from Riot API...',
    generating_stats: 'Generating battle statistics...',
    calculating: 'Calculating battle results...',
    applying_damage: 'Applying damage...'
  };

  const iconTypes = {
    loading_data: 'search' as const,
    generating_stats: 'dice' as const,
    calculating: 'calculate' as const,
    applying_damage: 'battle' as const
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-4 animate-bounce flex justify-center">
          <LoLIcon type={iconTypes[phase]} size="2xl" />
        </div>
        <div className="w-12 h-12 border-4 border-lol-gold/30 border-t-lol-gold rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lol-gold-light text-lg animate-pulse">
          {messages[phase]}
        </p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-lol-gold rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;