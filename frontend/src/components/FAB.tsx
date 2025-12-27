import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABProps {
  onClick: () => void;
  className?: string;
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn('fab', className)}
      aria-label="Add new"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
