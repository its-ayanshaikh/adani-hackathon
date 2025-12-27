import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { GearGuardLoader } from './GearGuardLoader';
import { InstallPWA } from './InstallPWA';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Show loader for minimum 2 seconds
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (showLoader) {
    return <GearGuardLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      )}

      {/* Main Content */}
      <main 
        className={cn(
          'min-h-screen transition-all duration-300',
          !isMobile && (sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'),
          isMobile && 'pb-20'
        )}
      >
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      {isMobile && <BottomNav />}

      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
}
