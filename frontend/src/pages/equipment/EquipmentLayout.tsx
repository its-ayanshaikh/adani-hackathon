import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Package, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    name: 'Equipment',
    href: '/equipment/list',
    icon: Package,
  },
  {
    name: 'Categories',
    href: '/equipment/categories',
    icon: FolderOpen,
  },
];

export default function EquipmentLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="px-4 md:px-6">
          <nav className="flex gap-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.href);
              return (
                <NavLink
                  key={tab.name}
                  to={tab.href}
                  className={cn(
                    'flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <Outlet />
    </div>
  );
}
