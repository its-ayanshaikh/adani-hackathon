import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'warning' | 'success';
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/10',
  warning: 'bg-warning/10',
  success: 'bg-success/10',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  warning: 'bg-warning/20 text-warning',
  success: 'bg-success/20 text-success',
};

export function StatCard({ label, value, icon: Icon, trend, variant = 'default', onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 rounded-xl border border-border',
        variantStyles[variant],
        onClick && 'cursor-pointer touch-feedback'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn(
          'p-2 rounded-lg',
          iconStyles[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium',
            trend.isPositive ? 'text-success' : 'text-destructive'
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold font-display">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
