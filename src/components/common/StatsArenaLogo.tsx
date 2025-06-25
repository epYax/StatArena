import logoImage from '../../assets/statarena-logo.png';

interface StatsArenaLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function StatsArenaLogo({ size = 'medium', className = '' }: StatsArenaLogoProps) {
  const sizeMap = {
    small: 'h-32',
    medium: 'h-48', 
    large: 'h-64'
  };

  const logoHeight = sizeMap[size];

  return (
    <img 
      src={logoImage}
      alt="STATARENA"
      className={`${logoHeight} w-auto object-contain ${className}`}
      style={{ maxWidth: '100%' }}
    />
  );
}