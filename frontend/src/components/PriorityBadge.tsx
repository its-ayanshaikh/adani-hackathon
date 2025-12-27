import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const priorityConfig = {
  low: { label: 'Low', class: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', class: 'bg-warning/15 text-warning' },
  high: { label: 'High', class: 'bg-destructive/15 text-destructive' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
      config.class
    )}>
      {config.label}
    </span>
  );
}
