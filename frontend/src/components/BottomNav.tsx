import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wrench, ClipboardList, Users, Calendar, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/equipment', icon: Wrench, label: 'Equipment' },
  { path: '/requests/new', icon: Plus, label: 'New', isAction: true },
  { path: '/requests', icon: ClipboardList, label: 'Requests' },
  { path: '/teams', icon: Users, label: 'Teams' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path) && !item.isAction;
          const Icon = item.icon;
          
          if (item.isAction) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-center w-12 h-12 -mt-4 bg-primary rounded-full shadow-lg active:scale-95 transition-transform"
              >
                <Icon className="w-6 h-6 text-primary-foreground" />
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                'active:bg-accent/50'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
