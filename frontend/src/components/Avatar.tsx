import { cn } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-medium',
        size === 'sm' && 'w-6 h-6 text-xs',
        size === 'md' && 'w-8 h-8 text-sm',
        size === 'lg' && 'w-10 h-10 text-base',
        className
      )}
    >
      {initials}
    </div>
  );
}
