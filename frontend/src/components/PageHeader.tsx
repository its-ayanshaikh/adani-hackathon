import { ReactNode } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  rightContent?: ReactNode;
}

export function PageHeader({ title, subtitle, showBack, action, rightContent }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="top-header safe-area-inset-top">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg touch-feedback hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-semibold font-display truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>
        
        {action && (
          <Button
            size="sm"
            onClick={action.onClick}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{action.label}</span>
          </Button>
        )}
        
        {rightContent}
      </div>
    </header>
  );
}
