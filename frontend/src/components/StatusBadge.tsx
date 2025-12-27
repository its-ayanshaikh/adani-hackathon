import { cn } from '@/lib/utils';
import { RequestStage, stageLabels } from '@/lib/localStorage';

interface StatusBadgeProps {
  stage: RequestStage;
  size?: 'sm' | 'md';
}

const stageClasses: Record<RequestStage, string> = {
  submitted: 'bg-info/15 text-info border-info/30',
  in_progress: 'bg-primary/15 text-primary border-primary/30',
  repaired: 'bg-success/15 text-success border-success/30',
  scrap: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

export function StatusBadge({ stage, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        stageClasses[stage],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {stageLabels[stage]}
    </span>
  );
}
