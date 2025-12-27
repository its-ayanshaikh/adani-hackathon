import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Settings,
  UserCog,
  HardHat,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  children?: { path: string; label: string }[];
}

const navItems: NavItem[] = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/equipment', icon: Wrench, label: 'Equipment' },
  { path: '/requests', icon: ClipboardList, label: 'Requests' },
  {
    path: '/users',
    icon: Users,
    label: 'Users',
    children: [
      { path: '/users/employees', label: 'Employees' },
      { path: '/users/technicians', label: 'Technicians' },
    ],
  },
  { path: '/teams', icon: UserCog, label: 'Teams' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
];

const bottomNavItems = [{ path: '/settings', icon: Settings, label: 'Settings' }];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['/users']);

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isMenuActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.path));
    }
    return (
      location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path))
    );
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen bg-card border-r border-border fixed left-0 top-0 z-40 transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-border',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">MaintainX</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = isMenuActive(item);
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedMenus.includes(item.path);

          return (
            <div key={item.path}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    if (collapsed) {
                      navigate(item.children![0].path);
                    } else {
                      toggleMenu(item.path);
                    }
                  } else {
                    navigate(item.path);
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-accent',
                  isActive && 'bg-primary/10 text-primary',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
                {!collapsed && (
                  <>
                    <span
                      className={cn(
                        'text-sm font-medium truncate flex-1 text-left',
                        isActive ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </span>
                    {hasChildren && (
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {hasChildren && !collapsed && isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-3">
                  {item.children!.map((child) => {
                    const isChildActive = location.pathname.startsWith(child.path);
                    return (
                      <button
                        key={child.path}
                        onClick={() => navigate(child.path)}
                        className={cn(
                          'w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm',
                          'hover:bg-accent',
                          isChildActive && 'bg-primary/10 text-primary font-medium'
                        )}
                      >
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-3 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-accent',
                isActive && 'bg-primary/10 text-primary',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            'hover:bg-destructive/10 text-destructive',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        {/* User Profile */}
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-2 mt-2 rounded-lg bg-accent/50',
            collapsed && 'justify-center px-2'
          )}
        >
          <Avatar initials={user?.avatar || 'U'} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role || 'User'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
